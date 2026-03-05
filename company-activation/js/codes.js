/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ACTIVATION CODES MANAGEMENT
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * This file contains the code database with pre-computed hashes.
 * 
 * HOW TO ADD NEW CODES:
 * 1. Open browser console on the activation page
 * 2. Run: await Auth.generateCodeHash('YOUR-NEW-CODE')
 * 3. Copy the hash and add it to ACTIVATION_CODES below
 * 
 * ⚠️ SECURITY REMINDER:
 * - NEVER commit plain-text codes to source control
 * - This database should be managed by admin only
 * - In production, codes should come from a secure backend
 */

const ACTIVATION_CODES = {
    // ═══════════════════════════════════════════════════════════════════════════
    // AVAILABLE TEST CODES (for demonstration)
    // These are the actual codes users can enter:
    // 
    // BASIC Tier:      TEST-BASIC-001
    // PRO Tier:        TEST-PRO-001
    // ENTERPRISE Tier: TEST-ENTERPRISE-001
    // 
    // ═══════════════════════════════════════════════════════════════════════════

    codes: [
        // ─────────────────────────────────────────────────────────────────────
        // BASIC TIER CODES
        // Features: Dashboard, Reports
        // Max Users: 5
        // ─────────────────────────────────────────────────────────────────────
        {
            // Plain code: TEST-BASIC-001
            hash: null, // Will be computed on first load
            plainCode: 'TEST-BASIC-001', // REMOVE IN PRODUCTION
            tier: 'basic',
            maxUsers: 5,
            features: ['dashboard', 'reports']
        },

        // ─────────────────────────────────────────────────────────────────────
        // PRO TIER CODES
        // Features: Dashboard, Reports, API, Customization
        // Max Users: 25
        // ─────────────────────────────────────────────────────────────────────
        {
            // Plain code: TEST-PRO-001
            hash: null,
            plainCode: 'TEST-PRO-001', // REMOVE IN PRODUCTION
            tier: 'pro',
            maxUsers: 25,
            features: ['dashboard', 'reports', 'api', 'customization']
        },

        // ─────────────────────────────────────────────────────────────────────
        // ENTERPRISE TIER CODES
        // Features: All features + White-label + Support
        // Max Users: Unlimited
        // ─────────────────────────────────────────────────────────────────────
        {
            // Plain code: TEST-ENTERPRISE-001
            hash: null,
            plainCode: 'TEST-ENTERPRISE-001', // REMOVE IN PRODUCTION
            tier: 'enterprise',
            maxUsers: -1,
            features: ['dashboard', 'reports', 'api', 'customization', 'white-label', 'support']
        }
    ],

    /**
     * Initialize codes - compute hashes for all codes
     * Call this on app startup
     */
    async init() {
        for (const code of this.codes) {
            if (code.plainCode && !code.hash) {
                code.hash = await Security.hashActivationCode(code.plainCode);
            }
        }
        console.log('[CODES] Activation codes initialized');
        return this.codes;
    },

    /**
     * Get all codes as array (for use in Auth module)
     */
    getAll() {
        return this.codes.map(c => ({
            hash: c.hash,
            tier: c.tier,
            maxUsers: c.maxUsers,
            features: c.features
        }));
    }
};

// Auto-initialize when script loads
document.addEventListener('DOMContentLoaded', async () => {
    await ACTIVATION_CODES.init();
});
