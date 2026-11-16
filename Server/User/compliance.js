/**
 * Legal / privacy document versions acknowledged at signup.
 * Keep in sync with https://logym.fit legal pages.
 */
const LEGAL_DOC_VERSION = '2024-11-01';
const MIN_AGE = 16;

const USER_UPDATE_ALLOWLIST = ['username', 'stepSize'];

function pickAllowedFields(data, allowlist = USER_UPDATE_ALLOWLIST) {
  const result = {};
  if (!data || typeof data !== 'object') return result;
  for (const key of allowlist) {
    if (Object.prototype.hasOwnProperty.call(data, key) && data[key] !== undefined) {
      result[key] = data[key];
    }
  }
  return result;
}

function buildSignupCompliance(body) {
  const now = new Date();
  return {
    termsAcceptedAt: now,
    privacyAcceptedAt: now,
    ageConfirmedAt: now,
    healthDisclaimerAcceptedAt: now,
    legalDocVersion: LEGAL_DOC_VERSION,
    termsAccepted: true,
    privacyAccepted: true,
    ageConfirmed: true,
    healthDisclaimerAccepted: true,
  };
}

function validateSignupConsent(body) {
  const missing = [];
  if (!body.acceptedTerms) missing.push('acceptedTerms');
  if (!body.acceptedPrivacy) missing.push('acceptedPrivacy');
  if (!body.ageConfirmed) missing.push('ageConfirmed');
  if (!body.acceptedHealthDisclaimer) missing.push('acceptedHealthDisclaimer');
  return missing;
}

module.exports = {
  LEGAL_DOC_VERSION,
  MIN_AGE,
  USER_UPDATE_ALLOWLIST,
  pickAllowedFields,
  buildSignupCompliance,
  validateSignupConsent,
};
