const net = require('net');

// Basic SSRF guard: true if the given IP is loopback, link-local, or a
// private/internal range that a public chapter URL should never resolve to.
function isPrivateAddress(ip) {
  const type = net.isIP(ip);

  if (type === 4) {
    const [a, b] = ip.split('.').map(Number);
    if (a === 127) return true; // loopback
    if (a === 10) return true; // 10.0.0.0/8
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
    if (a === 192 && b === 168) return true; // 192.168.0.0/16
    if (a === 169 && b === 254) return true; // link-local / cloud metadata
    if (a === 0) return true;
    return false;
  }

  if (type === 6) {
    const normalized = ip.toLowerCase();
    if (normalized === '::1') return true; // loopback
    if (normalized.startsWith('fe80:')) return true; // link-local
    if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true; // unique local
    if (normalized.startsWith('::ffff:')) {
      return isPrivateAddress(normalized.replace('::ffff:', ''));
    }
    return false;
  }

  return true; // not a valid IP — treat as unsafe
}

module.exports = isPrivateAddress;
