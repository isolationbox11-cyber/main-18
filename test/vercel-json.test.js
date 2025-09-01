/**
 * vercel-json.test.js
 * Testing library/framework: Jest (describe/test/expect).
 * Focus: Validate the vercel.json diff content (rewrites, redirects, headers),
 * covering happy paths and failure-guard checks (duplicates, shapes, values).
 */

const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.resolve(__dirname, '..', 'vercel.json');
const CONFIG_EXISTS = fs.existsSync(CONFIG_PATH);

/**
 * Utility: Load and parse vercel.json (throws if invalid JSON).
 */
function loadConfig() {
  const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
  return JSON.parse(raw);
}

/**
 * Utility: Find a headers rule by its "source" pattern.
 */
function findHeaderRuleBySource(cfg, source) {
  return Array.isArray(cfg.headers) ? cfg.headers.find(h => h && h.source === source) : undefined;
}

/**
 * Utility: Convert a header rule's headers array into a case-insensitive Map.
 */
function headerMap(rule) {
  const entries = (rule && Array.isArray(rule.headers)) ? rule.headers : [];
  return new Map(entries.map(h => [String(h.key || '').toLowerCase(), String(h.value || '')]));
}

/**
 * Utility: Parse a Permissions-Policy header value like:
 * "camera=(), microphone=(), geolocation=()"
 * Returns Map<feature, string[]>
 */
function parsePermissionsPolicy(header) {
  const map = new Map();
  if (!header || typeof header !== 'string') return map;
  const parts = header.split(',').map(t => t.trim()).filter(Boolean);
  for (const token of parts) {
    const m = /^([a-zA-Z-]+)\s*=\s*\(([^)]*)\)$/.exec(token);
    if (!m) continue;
    const feature = m[1];
    const values = m[2].trim() ? m[2].split(/\s+/).map(s => s.trim()).filter(Boolean) : [];
    map.set(feature, values);
  }
  return map;
}

// If vercel.json is not present (unlikely), skip rather than fail the entire suite
const describeIf = CONFIG_EXISTS ? describe : describe.skip;

describeIf('vercel.json configuration', () => {
  let cfg;

  beforeAll(() => {
    cfg = loadConfig();
  });

  test('is valid JSON with required top-level arrays', () => {
    expect(cfg && typeof cfg).toBe('object');
    expect(Array.isArray(cfg.rewrites)).toBe(true);
    expect(Array.isArray(cfg.redirects)).toBe(true);
    expect(Array.isArray(cfg.headers)).toBe(true);
  });

  test('includes pass-through rewrite /(.*) -> /$1', () => {
    const match = (cfg.rewrites || []).find(r => r && r.source === '/(.*)' && r.destination === '/$1');
    expect(match).toBeDefined();
  });

  test('redirects "/" to "/dashboard" permanently', () => {
    const rule = (cfg.redirects || []).find(r => r && r.source === '/' && r.destination === '/dashboard');
    expect(rule).toBeDefined();
    expect(rule.permanent).toBe(true);
  });

  test('applies standard security headers globally (source "/(.*)")', () => {
    const rule = findHeaderRuleBySource(cfg, '/(.*)');
    expect(rule).toBeDefined();

    const map = headerMap(rule);

    const xcto = map.get('x-content-type-options');
    expect(xcto && xcto.toLowerCase()).toBe('nosniff');

    const xfo = map.get('x-frame-options');
    expect(xfo).toBe('DENY');

    const xxp = map.get('x-xss-protection');
    expect(xxp).toBe('1; mode=block');

    const refpol = map.get('referrer-policy');
    expect(refpol).toBe('strict-origin-when-cross-origin');

    // Ensure header is present; value validated in a dedicated test below
    expect(map.has('permissions-policy')).toBe(true);
  });

  test('Permissions-Policy denies camera, microphone, and geolocation', () => {
    const rule = findHeaderRuleBySource(cfg, '/(.*)');
    const map = headerMap(rule);
    const pp = parsePermissionsPolicy(map.get('permissions-policy') || '');

    expect(pp.has('camera')).toBe(true);
    expect(pp.get('camera')).toEqual([]);

    expect(pp.has('microphone')).toBe(true);
    expect(pp.get('microphone')).toEqual([]);

    expect(pp.has('geolocation')).toBe(true);
    expect(pp.get('geolocation')).toEqual([]);
  });

  test('no duplicate header keys in the global headers rule', () => {
    const rule = findHeaderRuleBySource(cfg, '/(.*)');
    expect(rule && Array.isArray(rule.headers)).toBe(true);
    const keys = rule.headers.map(h => String(h.key || '').toLowerCase());
    const unique = new Set(keys);
    expect(unique.size).toBe(keys.length);
  });

  test('all route patterns and destinations begin with "/"', () => {
    for (const r of cfg.rewrites || []) {
      if (!r) continue;
      expect(typeof r.source).toBe('string');
      expect(typeof r.destination).toBe('string');
      expect(r.source.startsWith('/')).toBe(true);
      expect(r.destination.startsWith('/')).toBe(true);
    }
    for (const r of cfg.redirects || []) {
      if (!r) continue;
      expect(typeof r.source).toBe('string');
      expect(typeof r.destination).toBe('string');
      expect(r.source.startsWith('/')).toBe(true);
      expect(r.destination.startsWith('/')).toBe(true);
    }
    for (const h of cfg.headers || []) {
      if (!h) continue;
      expect(typeof h.source).toBe('string');
      expect(h.source.startsWith('/')).toBe(true);
    }
  });

  test('the /(.*) rewrite destination references a capture group (e.g., $1)', () => {
    const r = (cfg.rewrites || []).find(x => x && x.source === '/(.*)');
    expect(r).toBeDefined();
    expect(/\$[0-9]+/.test(r.destination)).toBe(true);
  });
});