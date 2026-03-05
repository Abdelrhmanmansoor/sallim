/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AUTHENTICATION MODULE - Company Activation System
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * This module handles:
 * - Code validation against hashed codes database
 * - Company registration and activation
 * - Login flow with existing activations
 * 
 * ⚠️ SECURITY NOTE: The hashed codes are stored client-side. While SHA-256
 * prevents direct code visibility, a determined attacker could:
 * 1. Brute-force common codes
 * 2. Modify the validation logic
 * For true security, validation must happen server-side.
 */

const Auth = (function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════
    // ACTIVATION CODES DATABASE (SHA-256 HASHED)
    // 
    // These are pre-hashed codes. To add new codes:
    // 1. Hash the code: await Security.hashActivationCode('YOUR-CODE-HERE')
    // 2. Add the hash to this array
    // 
    // Original codes are NEVER stored in the code.
    // Format: { hash: 'sha256_hash', tier: 'basic|pro|enterprise', maxUsers: number }
    // ═══════════════════════════════════════════════════════════════════════════

    const VALID_CODES = [
        // Example hashed codes (you would generate these for real codes)
        // Code: STARTUP-2024-BASIC → Hash below
        { 
            hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 
            tier: 'basic', 
            maxUsers: 5,
            features: ['dashboard', 'reports']
        },
        // Code: BUSINESS-PRO-2024 → Hash below
        { 
            hash: '5e884898da28047d3598653bee65b1c917f30b8c8f9e71efeabe2a9c88d4b6b9',
            tier: 'pro',
            maxUsers: 25,
            features: ['dashboard', 'reports', 'api', 'customization']
        },
        // Code: ENTERPRISE-MAX-2024 → Hash below  
        {
            hash: '6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090',
            tier: 'enterprise',
            maxUsers: -1, // unlimited
            features: ['dashboard', 'reports', 'api', 'customization', 'white-label', 'support']
        }
    ];

    /**
     * Initialize valid codes - call this to generate hashes for new codes
     * Only used during development to generate hashes
     */
    async function generateCodeHash(plainCode) {
        const hash = await Security.hashActivationCode(plainCode);
        console.log(`Code: ${plainCode}`);
        console.log(`Hash: ${hash}`);
        return hash;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // ACTIVATION FLOW
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Validate activation code and return tier info if valid
     * @param {string} code - Plain text activation code
     * @returns {Promise<Object|null>} - Code info if valid, null if invalid
     */
    async function validateCode(code) {
        // Input validation
        if (!Security.isValidCode(code)) {
            return { error: 'صيغة الكود غير صحيحة' };
        }

        // Hash the input code
        const inputHash = await Security.hashActivationCode(code);

        // Find matching code
        const codeInfo = VALID_CODES.find(c => c.hash === inputHash);
        
        if (!codeInfo) {
            return { error: 'الكود غير صحيح' };
        }

        // Check if code already used
        const isUsed = await SecureStorage.UsedCodes.isUsed(inputHash);
        if (isUsed) {
            return { error: 'هذا الكود مستخدم بالفعل' };
        }

        return {
            valid: true,
            hash: inputHash,
            tier: codeInfo.tier,
            maxUsers: codeInfo.maxUsers,
            features: codeInfo.features
        };
    }

    /**
     * Complete activation process
     * @param {Object} data - Activation data
     * @returns {Promise<Object>} - Result with success/error
     */
    async function activate(data) {
        const { code, companyName, email, password } = data;

        // ═══════════════════════════════════════════════════════════════════════
        // Step 1: Check brute force protection
        // ═══════════════════════════════════════════════════════════════════════
        const bfCheck = Security.BruteForce.checkCanAttempt();
        if (!bfCheck.canAttempt) {
            return { error: bfCheck.message };
        }

        // ═══════════════════════════════════════════════════════════════════════
        // Step 2: Validate inputs
        // ═══════════════════════════════════════════════════════════════════════
        if (!companyName || companyName.trim().length < 2) {
            return { error: 'اسم الشركة مطلوب (حرفين على الأقل)' };
        }

        if (!Security.isValidEmail(email)) {
            Security.BruteForce.recordFailedAttempt();
            return { error: 'البريد الإلكتروني غير صحيح' };
        }

        if (!password || password.length < 8) {
            return { error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' };
        }

        // ═══════════════════════════════════════════════════════════════════════
        // Step 3: Check if email already registered
        // ═══════════════════════════════════════════════════════════════════════
        const emailUsed = await SecureStorage.UsedCodes.isEmailUsed(email);
        if (emailUsed) {
            Security.BruteForce.recordFailedAttempt();
            return { error: 'هذا البريد مسجل بالفعل' };
        }

        // ═══════════════════════════════════════════════════════════════════════
        // Step 4: Validate activation code
        // ═══════════════════════════════════════════════════════════════════════
        const codeResult = await validateCode(code);
        if (codeResult.error) {
            Security.BruteForce.recordFailedAttempt();
            return { error: codeResult.error };
        }

        // ═══════════════════════════════════════════════════════════════════════
        // Step 5: Create account
        // ═══════════════════════════════════════════════════════════════════════
        const passwordHash = await Security.sha256(password);
        
        const userData = {
            companyName: Security.sanitize(companyName.trim()),
            email: email.toLowerCase().trim(),
            passwordHash: passwordHash,
            tier: codeResult.tier,
            maxUsers: codeResult.maxUsers,
            features: codeResult.features,
            activatedAt: Date.now(),
            logo: null // Will be set later via logo upload
        };

        // Mark code as used
        await SecureStorage.UsedCodes.markUsed(codeResult.hash, email);

        // Save user data
        await SecureStorage.setSecure('user_data', userData);

        // Create session
        await SecureStorage.Session.create(userData);

        // Reset brute force counter on success
        Security.BruteForce.resetAttempts();

        return {
            success: true,
            message: 'تم التفعيل بنجاح!',
            user: userData
        };
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // LOGIN FLOW (for returning users)
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Login with existing credentials
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<Object>} - Result with success/error
     */
    async function login(email, password) {
        // Check brute force protection
        const bfCheck = Security.BruteForce.checkCanAttempt();
        if (!bfCheck.canAttempt) {
            return { error: bfCheck.message };
        }

        // Validate inputs
        if (!Security.isValidEmail(email)) {
            Security.BruteForce.recordFailedAttempt();
            return { error: 'البريد الإلكتروني غير صحيح' };
        }

        if (!password) {
            return { error: 'كلمة المرور مطلوبة' };
        }

        // Get stored user data
        const userData = await SecureStorage.getSecure('user_data');
        
        if (!userData) {
            Security.BruteForce.recordFailedAttempt();
            return { error: 'لا يوجد حساب مسجل' };
        }

        // Verify email
        if (userData.email !== email.toLowerCase().trim()) {
            Security.BruteForce.recordFailedAttempt();
            return { error: 'البريد أو كلمة المرور غير صحيحة' };
        }

        // Verify password
        const passwordHash = await Security.sha256(password);
        if (userData.passwordHash !== passwordHash) {
            Security.BruteForce.recordFailedAttempt();
            return { error: 'البريد أو كلمة المرور غير صحيحة' };
        }

        // Create new session
        await SecureStorage.Session.create(userData);

        // Reset brute force counter
        Security.BruteForce.resetAttempts();

        return {
            success: true,
            message: 'تم تسجيل الدخول بنجاح',
            user: userData
        };
    }

    /**
     * Logout current user
     * @returns {Promise<void>}
     */
    async function logout() {
        await SecureStorage.Session.destroy();
    }

    /**
     * Check if user is authenticated
     * @returns {Promise<boolean>}
     */
    async function isAuthenticated() {
        const session = await SecureStorage.Session.validate();
        return session !== null;
    }

    /**
     * Get current user data
     * @returns {Promise<Object|null>}
     */
    async function getCurrentUser() {
        return await SecureStorage.Session.getUser();
    }

    /**
     * Require authentication - redirect to login if not authenticated
     * Call this at the start of protected pages
     * @param {string} loginUrl - URL to redirect to
     * @returns {Promise<Object|null>} - User data if authenticated
     */
    async function requireAuth(loginUrl = 'index.html') {
        const user = await getCurrentUser();
        if (!user) {
            window.location.href = loginUrl;
            return null;
        }
        return user;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════════════════════

    return {
        validateCode,
        activate,
        login,
        logout,
        isAuthenticated,
        getCurrentUser,
        requireAuth,
        generateCodeHash // For development use
    };

})();
