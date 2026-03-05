/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SECURE STORAGE MODULE - Company Activation System
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * This module provides secure localStorage operations:
 * - HMAC-signed data storage (tamper detection)
 * - Automatic signature verification on read
 * - Session management with 8-hour expiry
 * - Used/burned codes tracking (persists even if localStorage cleared)
 * 
 * ⚠️ SECURITY NOTE: localStorage can be cleared by users. The "burned codes"
 * list is stored separately and also in sessionStorage as backup, but a
 * determined user can still reset it. True protection requires a backend.
 */

const SecureStorage = (function() {
    'use strict';

    const PREFIX = Security.STORAGE_PREFIX;
    const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

    // ═══════════════════════════════════════════════════════════════════════════
    // CORE SIGNED STORAGE OPERATIONS
    // Why: Detect if user manually edits localStorage data
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Store data with HMAC signature
     * @param {string} key - Storage key
     * @param {any} value - Data to store
     * @returns {Promise<void>}
     */
    async function setSecure(key, value) {
        const data = JSON.stringify(value);
        const signature = await Security.createHMAC(data);
        const envelope = {
            d: data,      // data
            s: signature, // signature
            t: Date.now() // timestamp
        };
        localStorage.setItem(PREFIX + key, JSON.stringify(envelope));
    }

    /**
     * Retrieve and verify signed data
     * @param {string} key - Storage key
     * @returns {Promise<any|null>} - Data if valid, null if tampered/missing
     */
    async function getSecure(key) {
        const raw = localStorage.getItem(PREFIX + key);
        if (!raw) return null;

        try {
            const envelope = JSON.parse(raw);
            
            // Verify signature
            const isValid = await Security.verifyHMAC(envelope.d, envelope.s);
            if (!isValid) {
                // ⚠️ TAMPERING DETECTED
                console.warn(`[SECURITY] Tampering detected for key: ${key}`);
                localStorage.removeItem(PREFIX + key);
                return null;
            }

            return JSON.parse(envelope.d);
        } catch (e) {
            console.warn(`[SECURITY] Invalid data format for key: ${key}`);
            localStorage.removeItem(PREFIX + key);
            return null;
        }
    }

    /**
     * Remove item from storage
     * @param {string} key - Storage key
     */
    function removeSecure(key) {
        localStorage.removeItem(PREFIX + key);
    }

    /**
     * Clear all app data from storage
     */
    function clearAll() {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(PREFIX)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SESSION MANAGEMENT
    // Why: Auto-expire sessions after 8 hours for security
    // ═══════════════════════════════════════════════════════════════════════════

    const Session = {
        /**
         * Create new session after successful activation
         * @param {Object} userData - User/company data
         * @returns {Promise<void>}
         */
        async create(userData) {
            const session = {
                user: Security.sanitizeObject(userData),
                createdAt: Date.now(),
                expiresAt: Date.now() + SESSION_DURATION_MS,
                sessionId: crypto.randomUUID ? crypto.randomUUID() : 
                           'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
            };

            await setSecure('session', session);
            
            // Also store session ID in sessionStorage for tab-specific access
            sessionStorage.setItem(PREFIX + 'session_id', session.sessionId);
        },

        /**
         * Validate current session
         * @returns {Promise<Object|null>} - Session data if valid, null otherwise
         */
        async validate() {
            const session = await getSecure('session');
            
            if (!session) {
                return null;
            }

            // Check expiry
            if (Date.now() > session.expiresAt) {
                console.warn('[SESSION] Session expired');
                await this.destroy();
                return null;
            }

            // Verify session ID matches (prevents session hijacking across tabs)
            const currentSessionId = sessionStorage.getItem(PREFIX + 'session_id');
            if (currentSessionId && currentSessionId !== session.sessionId) {
                console.warn('[SESSION] Session ID mismatch');
                return null;
            }

            return session;
        },

        /**
         * Get remaining session time
         * @returns {Promise<number>} - Remaining time in milliseconds
         */
        async getRemainingTime() {
            const session = await getSecure('session');
            if (!session) return 0;
            return Math.max(0, session.expiresAt - Date.now());
        },

        /**
         * Refresh session expiry (extend by 8 more hours)
         * @returns {Promise<boolean>} - True if refreshed successfully
         */
        async refresh() {
            const session = await this.validate();
            if (!session) return false;

            session.expiresAt = Date.now() + SESSION_DURATION_MS;
            await setSecure('session', session);
            return true;
        },

        /**
         * Destroy current session (logout)
         * @returns {Promise<void>}
         */
        async destroy() {
            removeSecure('session');
            sessionStorage.removeItem(PREFIX + 'session_id');
        },

        /**
         * Get current user data
         * @returns {Promise<Object|null>}
         */
        async getUser() {
            const session = await this.validate();
            return session ? session.user : null;
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // USED CODES TRACKING
    // Why: Prevent same code from being used multiple times
    // Note: Uses multiple storage locations as backup against clearing
    // ═══════════════════════════════════════════════════════════════════════════

    const UsedCodes = {
        /**
         * Mark a code as used (burned)
         * @param {string} codeHash - SHA-256 hash of the activation code
         * @param {string} email - Email that used the code
         * @returns {Promise<void>}
         */
        async markUsed(codeHash, email) {
            // Get existing used codes
            let usedCodes = await getSecure('used_codes') || {};
            
            // Add new entry
            usedCodes[codeHash] = {
                usedAt: Date.now(),
                emailHash: await Security.sha256(email.toLowerCase())
            };

            // Save to localStorage with signature
            await setSecure('used_codes', usedCodes);

            // Also save to IndexedDB as backup (harder to clear)
            this._saveToIndexedDB(usedCodes);
        },

        /**
         * Check if code has been used
         * @param {string} codeHash - SHA-256 hash of the activation code
         * @returns {Promise<boolean>}
         */
        async isUsed(codeHash) {
            // Check localStorage first
            let usedCodes = await getSecure('used_codes') || {};
            
            // If localStorage was cleared, try to recover from IndexedDB
            if (Object.keys(usedCodes).length === 0) {
                usedCodes = await this._loadFromIndexedDB() || {};
                if (Object.keys(usedCodes).length > 0) {
                    // Restore to localStorage
                    await setSecure('used_codes', usedCodes);
                }
            }

            return !!usedCodes[codeHash];
        },

        /**
         * Check if email already has an activation
         * @param {string} email - Email to check
         * @returns {Promise<boolean>}
         */
        async isEmailUsed(email) {
            const emailHash = await Security.sha256(email.toLowerCase());
            let usedCodes = await getSecure('used_codes') || {};

            // Recover from IndexedDB if needed
            if (Object.keys(usedCodes).length === 0) {
                usedCodes = await this._loadFromIndexedDB() || {};
            }

            return Object.values(usedCodes).some(entry => entry.emailHash === emailHash);
        },

        /**
         * Save to IndexedDB as backup storage
         * @param {Object} usedCodes - Used codes data
         * @private
         */
        _saveToIndexedDB(usedCodes) {
            if (!window.indexedDB) return;

            const request = indexedDB.open('CompanyActivation', 1);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('usedCodes')) {
                    db.createObjectStore('usedCodes', { keyPath: 'id' });
                }
            };

            request.onsuccess = async (event) => {
                const db = event.target.result;
                const transaction = db.transaction(['usedCodes'], 'readwrite');
                const store = transaction.objectStore('usedCodes');
                
                // Sign the data before storing
                const signature = await Security.createHMAC(JSON.stringify(usedCodes));
                store.put({ id: 'codes', data: usedCodes, signature });
            };
        },

        /**
         * Load from IndexedDB backup
         * @returns {Promise<Object|null>}
         * @private
         */
        _loadFromIndexedDB() {
            return new Promise((resolve) => {
                if (!window.indexedDB) {
                    resolve(null);
                    return;
                }

                const request = indexedDB.open('CompanyActivation', 1);
                
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains('usedCodes')) {
                        db.createObjectStore('usedCodes', { keyPath: 'id' });
                    }
                };

                request.onsuccess = async (event) => {
                    try {
                        const db = event.target.result;
                        const transaction = db.transaction(['usedCodes'], 'readonly');
                        const store = transaction.objectStore('usedCodes');
                        const getRequest = store.get('codes');

                        getRequest.onsuccess = async () => {
                            const result = getRequest.result;
                            if (!result) {
                                resolve(null);
                                return;
                            }

                            // Verify signature
                            const isValid = await Security.verifyHMAC(
                                JSON.stringify(result.data),
                                result.signature
                            );

                            if (!isValid) {
                                console.warn('[SECURITY] IndexedDB data tampered');
                                resolve(null);
                                return;
                            }

                            resolve(result.data);
                        };

                        getRequest.onerror = () => resolve(null);
                    } catch {
                        resolve(null);
                    }
                };

                request.onerror = () => resolve(null);
            });
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════════════════════

    return {
        setSecure,
        getSecure,
        removeSecure,
        clearAll,
        Session,
        UsedCodes,
        SESSION_DURATION_MS
    };

})();
