const dns = require('dns').promises;
const asyncHandler = require('../utils/asyncHandler');
const isPrivateAddress = require('../utils/isPrivateAddress');

const FETCH_TIMEOUT_MS = 5000;
const MAX_REDIRECTS = 3;

async function assertPublicHost(hostname) {
  const records = await dns.lookup(hostname, { all: true });
  if (records.length === 0) {
    throw new Error('Could not resolve host');
  }
  if (records.some((record) => isPrivateAddress(record.address))) {
    throw new Error('URL resolves to a private/internal address');
  }
}

// Follows redirects manually (rather than letting fetch auto-follow) so
// every hop can be re-validated against the private-address guard — a
// chapter URL that redirects to an internal address should be rejected
// just as if it pointed there directly.
async function fetchHeadersSafely(startUrl) {
  let currentUrl = startUrl;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    const parsed = new URL(currentUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new Error('Only http/https URLs are supported');
    }

    await assertPublicHost(parsed.hostname);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    let response;
    try {
      response = await fetch(currentUrl, {
        method: 'GET',
        redirect: 'manual',
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PixelPanelEmbedCheck/1.0)' },
      });
    } finally {
      clearTimeout(timer);
    }

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('location');
      if (!location) return response;
      currentUrl = new URL(location, currentUrl).toString();
      continue;
    }

    return response;
  }

  throw new Error('Too many redirects');
}

// @desc    Check whether a URL is likely embeddable in an <iframe>, by
//          inspecting its X-Frame-Options / CSP frame-ancestors headers
//          server-side (the browser gives no reliable JS signal for this).
// @route   GET /api/embed-check?url=<url>
// @access  Private
const checkEmbeddable = asyncHandler(async (req, res) => {
  const { url } = req.query;

  if (typeof url !== 'string' || !url.trim()) {
    res.status(400);
    throw new Error('url query parameter is required');
  }

  let response;
  try {
    response = await fetchHeadersSafely(url.trim());
  } catch (error) {
    // Any failure (blocked address, timeout, DNS error, bad URL) means we
    // can't safely embed it — the frontend falls back to a link-out button.
    res.json({ embeddable: false, reason: error.message });
    return;
  }

  const xFrameOptions = (response.headers.get('x-frame-options') || '').toLowerCase();
  const csp = (response.headers.get('content-security-policy') || '').toLowerCase();

  const blockedByXfo = xFrameOptions.includes('deny') || xFrameOptions.includes('sameorigin');
  const blockedByCsp = csp.includes('frame-ancestors') && !csp.includes("frame-ancestors *");

  res.json({ embeddable: !blockedByXfo && !blockedByCsp });
});

module.exports = { checkEmbeddable };
