/**
 * Minimal unit tests for compliance helpers (no DB required).
 * Run: node User/compliance.test.js
 */
const assert = require('assert');
const {
  LEGAL_DOC_VERSION,
  MIN_AGE,
  pickAllowedFields,
  buildSignupCompliance,
  validateSignupConsent,
} = require('./compliance');

assert.strictEqual(typeof LEGAL_DOC_VERSION, 'string');
assert.ok(LEGAL_DOC_VERSION.length > 0);
assert.strictEqual(MIN_AGE, 16);

// Mass-assignment: only allowlisted keys
const picked = pickAllowedFields({
  username: 'Ada',
  stepSize: 3,
  permission: 'admin',
  password: 'hacked',
  email: 'evil@example.com',
});
assert.deepStrictEqual(picked, { username: 'Ada', stepSize: 3 });

assert.deepStrictEqual(pickAllowedFields(null), {});
assert.deepStrictEqual(pickAllowedFields({ foo: 1 }), {});

// Consent validation
assert.deepStrictEqual(
  validateSignupConsent({}),
  ['acceptedTerms', 'acceptedPrivacy', 'ageConfirmed', 'acceptedHealthDisclaimer']
);
assert.deepStrictEqual(
  validateSignupConsent({
    acceptedTerms: true,
    acceptedPrivacy: true,
    ageConfirmed: true,
    acceptedHealthDisclaimer: true,
  }),
  []
);

const compliance = buildSignupCompliance({});
assert.ok(compliance.termsAcceptedAt instanceof Date);
assert.ok(compliance.privacyAcceptedAt instanceof Date);
assert.ok(compliance.ageConfirmedAt instanceof Date);
assert.ok(compliance.healthDisclaimerAcceptedAt instanceof Date);
assert.strictEqual(compliance.legalDocVersion, LEGAL_DOC_VERSION);
assert.strictEqual(compliance.termsAccepted, true);

console.log('compliance.test.js: all assertions passed');
