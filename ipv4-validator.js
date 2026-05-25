/**
 * Wyrażenie regularne walidujące adres IPv4 (cztery oktety 0–255).
 *
 * Struktura: ^ (oktet \.){3} oktet $
 * Oktet: 250–255 | 200–249 | 100–199 | 0–99 (bez wiodących zer, np. "01")
 */
const IPV4_REGEX =
  /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])$/;

/**
 * Sprawdza, czy podany ciąg jest poprawnym adresem IPv4.
 *
 * @param {string} ip - Adres IP do walidacji.
 * @returns {boolean}
 */
function isValidIPv4(ip) {
  if (typeof ip !== 'string') {
    return false;
  }
  return IPV4_REGEX.test(ip.trim());
}

module.exports = { isValidIPv4, IPV4_REGEX };

// Przykładowe testy przy uruchomieniu: node ipv4-validator.js
if (require.main === module) {
  const examples = [
    { ip: '192.168.1.1', expected: true },
    { ip: '0.0.0.0', expected: true },
    { ip: '255.255.255.255', expected: true },
    { ip: '10.0.0.1', expected: true },
    { ip: '256.1.1.1', expected: false },
    { ip: '192.168.1', expected: false },
    { ip: '192.168.1.1.1', expected: false },
    { ip: '192.168.01.1', expected: false },
    { ip: 'abc.def.gh.i', expected: false },
    { ip: '', expected: false },
    { ip: ' 172.16.0.1 ', expected: true },
  ];

  console.log('Testy walidacji IPv4:\n');
  for (const { ip, expected } of examples) {
    const result = isValidIPv4(ip);
    const status = result === expected ? 'OK' : 'FAIL';
    console.log(
      `[${status}] "${ip}" → ${result} (oczekiwano: ${expected})`
    );
  }
}
