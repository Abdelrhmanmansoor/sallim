/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SECURITY CORE MODULE - Company Activation System
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * This module provides core security utilities:
 * - SHA-256 hashing for code verification
 * - HMAC signing for data integrity
 * - XSS protection and input sanitization
 * - Brute force protection
 * 
 * ⚠️ SECURITY NOTE: This is client-side only. A determined attacker can bypass
 * these protections. For production systems, always use a backend server.
 */

const Security = (function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════
    // PRIVATE: Secret key for HMAC (in production, this should come from server)
    // ⚠️ This key is visible in DevTools - it's obfuscation, not true security
    // ═══════════════════════════════════════════════════════════════════════════
    const _HMAC_SECRET = 'sYs_@ct1v8_k3y_2024_!x7z';
    const _STORAGE_PREFIX = 'cmp_act_';

    // ═══════════════════════════════════════════════════════════════════════════
    // SHA-256 HASHING
    // Used for: Hashing activation codes before comparison
    // Why: Prevents plain-text codes from being visible in source code
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Convert string to SHA-256 hash using Web Crypto API
     * @param {string} message - Text to hash
     * @returns {Promise<string>} - Hex-encoded hash
     */
    async function sha256(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Hash activation code with salt for additional security
     * @param {string} code - Activation code
     * @returns {Promise<string>} - Salted hash
     */
    async function hashActivationCode(code) {
        const salt = 'act_salt_2024';
        return await sha256(salt + code.toUpperCase().trim() + salt);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // HMAC SIGNING
    // Used for: Signing localStorage data to detect tampering
    // Why: If user modifies localStorage manually, signature won't match
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Create HMAC signature for data integrity verification
     * @param {string} data - Data to sign
     * @returns {Promise<string>} - HMAC signature
     */
    async function createHMAC(data) {
        const key = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(_HMAC_SECRET),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );
        const signature = await crypto.subtle.sign(
            'HMAC',
            key,
            new TextEncoder().encode(data)
        );
        return Array.from(new Uint8Array(signature))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    /**
     * Verify HMAC signature
     * @param {string} data - Original data
     * @param {string} signature - Signature to verify
     * @returns {Promise<boolean>} - True if valid
     */
    async function verifyHMAC(data, signature) {
        const expectedSig = await createHMAC(data);
        return expectedSig === signature;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // XSS PROTECTION
    // Used for: Sanitizing all user inputs before display
    // Why: Prevents script injection attacks
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Sanitize string to prevent XSS attacks
     * @param {string} str - Untrusted input
     * @returns {string} - Safe string
     */
    function sanitize(str) {
        if (typeof str !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Sanitize object recursively
     * @param {Object} obj - Object with untrusted data
     * @returns {Object} - Sanitized object
     */
    function sanitizeObject(obj) {
        if (typeof obj !== 'object' || obj === null) {
            return typeof obj === 'string' ? sanitize(obj) : obj;
        }
        const result = Array.isArray(obj) ? [] : {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                result[key] = sanitizeObject(obj[key]);
            }
        }
        return result;
    }

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} - True if valid
     */
    function isValidEmail(email) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }

    /**
     * Validate activation code format (alphanumeric, 8-32 chars)
     * @param {string} code - Code to validate
     * @returns {boolean} - True if valid
     */
    function isValidCode(code) {
        const pattern = /^[A-Z0-9-]{8,32}$/i;
        return pattern.test(code);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // BRUTE FORCE PROTECTION
    // Used for: Rate limiting login attempts
    // Why: Prevents automated password/code guessing attacks
    // ═══════════════════════════════════════════════════════════════════════════

    const BruteForce = {
        MAX_ATTEMPTS_SOFT: 5,      // After this: 30 second delay
        MAX_ATTEMPTS_HARD: 10,     // After this: 1 hour ban
        SOFT_DELAY_MS: 30000,      // 30 seconds
        HARD_BAN_MS: 3600000,      // 1 hour

        /**
         * Get current attempt data from storage
         * @returns {Object} - Attempt tracking data
         */
        _getAttemptData() {
            const raw = localStorage.getItem(_STORAGE_PREFIX + 'bf_data');
            if (!raw) return { attempts: 0, lastAttempt: 0, bannedUntil: 0 };
            try {
                return JSON.parse(raw);
            } catch {
                return { attempts: 0, lastAttempt: 0, bannedUntil: 0 };
            }
        },

        /**
         * Save attempt data to storage
         * @param {Object} data - Attempt data
         */
        _saveAttemptData(data) {
            localStorage.setItem(_STORAGE_PREFIX + 'bf_data', JSON.stringify(data));
        },

        /**
         * Record a failed attempt
         */
        recordFailedAttempt() {
            const data = this._getAttemptData();
            data.attempts++;
            data.lastAttempt = Date.now();

            // Check if we need to impose hard ban
            if (data.attempts >= this.MAX_ATTEMPTS_HARD) {
                data.bannedUntil = Date.now() + this.HARD_BAN_MS;
            }

            this._saveAttemptData(data);
        },

        /**
         * Reset attempts after successful login
         */
        resetAttempts() {
            localStorage.removeItem(_STORAGE_PREFIX + 'bf_data');
        },

        /**
         * Check if user can attempt login
         * @returns {Object} - { canAttempt: boolean, waitTime: number, message: string }
         */
        checkCanAttempt() {
            const data = this._getAttemptData();
            const now = Date.now();

            // Check hard ban
            if (data.bannedUntil > now) {
                const waitTime = Math.ceil((data.bannedUntil - now) / 60000);
                return {
                    canAttempt: false,
                    waitTime: data.bannedUntil - now,
                    message: `محظور مؤقتاً. انتظر ${waitTime} دقيقة`
                };
            }

            // Check soft delay
            if (data.attempts >= this.MAX_ATTEMPTS_SOFT) {
                const timeSinceLastAttempt = now - data.lastAttempt;
                if (timeSinceLastAttempt < this.SOFT_DELAY_MS) {
                    const waitSeconds = Math.ceil((this.SOFT_DELAY_MS - timeSinceLastAttempt) / 1000);
                    return {
                        canAttempt: false,
                        waitTime: this.SOFT_DELAY_MS - timeSinceLastAttempt,
                        message: `انتظر ${waitSeconds} ثانية قبل المحاولة التالية`
                    };
                }
            }

            // Reset if ban expired
            if (data.bannedUntil > 0 && data.bannedUntil <= now) {
                this.resetAttempts();
            }

            return {
                canAttempt: true,
                waitTime: 0,
                message: '',
                remainingAttempts: this.MAX_ATTEMPTS_SOFT - data.attempts
            };
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════════════════════

    return {
        sha256,
        hashActivationCode,
        createHMAC,
        verifyHMAC,
        sanitize,
        sanitizeObject,
        isValidEmail,
        isValidCode,
        BruteForce,
        STORAGE_PREFIX: _STORAGE_PREFIX
    };

})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Security;
}
