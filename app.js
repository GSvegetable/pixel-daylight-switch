/*!
 * Pixel Day-Night Switch (Unlicense, public domain)
 * https://github.com/GSvegetable/pixel-daylight-switch
 *
 * 用法：引入这个文件，页面里放一个空的 div 就行。
 *   <script src="app.js"></script>
 *   <div data-ld-part="toggle-daylight"></div>
 * 样式和内部结构都由本文件自动生成，不需要 style.css。
 */
(function () {
"use strict";
const reportDiagnostic = (title, detail) => {
  try {
    if (typeof window !== 'undefined' && window.__PDS_DIAG__ && typeof window.__PDS_DIAG__.show === 'function') {
      window.__PDS_DIAG__.show(title, detail);
    }
  } catch (_) {}
};
const CORE_W = 192;
const CORE_H = 112;
const HORIZON = 82;
const MARGIN = 14;
const WORLD_HZ = 30;
const WORLD_SLACK = 0.004;
const PILL_RATIO = 1.85;
const CLOCK_DAY = 12;
const CLOCK_NIGHT = 21.5;
const CLOCK_SLEEP = 23.4;
const NIGHT_CREEP = 26;

const RAMPS = [
  ['bg', [0.76, 0.85, 0.93, 0.985]],
  ['surface', [0.4, 0.52, 0.64, 0.76]],
  ['fg', [0.17, 0.25, 0.33, 0.44]],
  ['muted', [0.5, 0.62, 0.74, 0.86]],
  ['accent', [0.5, 0.66, 0.8, 0.92]],
];
const C0 = 0, C1 = 1, C2 = 2, C3 = 3;
const G0 = 4, G1 = 5, G2 = 6, G3 = 7;
const I0 = 8, I1 = 9, I2 = 10, I3 = 11;
const U0 = 12, U1 = 13, U2 = 14, U3 = 15;
const A0 = 16, A1 = 17, A2 = 18, A3 = 19;

const MATS = [
  ['SKY', C3, C3, C3, C3],
  ['HILL_FAR', U2, U1, I3, I1],
  ['HILL_NEAR', U1, U0, I2, I1],
  ['TREE_FAR', G1, G0, I2, I0],
  ['GRASS', G2, G1, I3, I1],
  ['GRASS_DK', G1, G0, I2, I0],
  ['GRASS_LT', G3, G2, U0, I2],
  ['PATH', C1, C0, U0, I2],
  ['PATH_DK', C0, A0, I3, I1],
  ['WALL', C3, A3, U1, I2],
  ['WALL_SH', C2, A2, U0, I1],
  ['PLANK', C1, A1, I3, I1],
  ['STONE', U1, U0, I2, I1],
  ['STONE_LT', U2, U1, I3, I2],
  ['ROOF', I3, I2, I1, I0],
  ['ROOF_LT', U0, I3, I2, I1],
  ['ROOF_HI', U1, U0, I3, I1],
  ['WOOD', A0, A0, I2, I0],
  ['WOOD_LT', A1, A1, I3, I1],
  ['WOOD_DK', I3, I2, I1, I0],
  ['BRICK', U0, I3, I2, I0],
  ['BRICK_LT', U1, U0, I3, I1],
  ['BARK', I3, I2, I1, I0],
  ['BARK_LT', A0, A0, I1, I0],
  ['LEAF0', G0, G0, I1, I0],
  ['LEAF1', G1, G0, I2, I0],
  ['LEAF2', G2, A0, I2, I1],
  ['LEAF3', G3, A1, I3, I1],
  ['FLOWER_A', A2, A1, A0, I2],
  ['FLOWER_C', C3, A3, U1, I3],
  ['STEM', G0, G0, I2, I0],
  ['GLASS', I2, A0, I1, I0],
  ['GLASS_HI', U1, A1, I2, I1],
  ['ROOM', C1, C0, I3, I1],
  ['SKIN', A3, A3, U2, I3],
  ['HAIR', I0, I0, I0, I0],
  ['SHIRT', A1, A0, I3, I1],
  ['SHIRT_DK', A0, A0, I2, I0],
  ['PANTS', I2, I2, I1, I0],
  ['BOOT', I0, I0, I0, I0],
  ['BOOK', C3, C3, U2, I3],
  ['BOOK_DK', C1, C1, U0, I2],
  ['CLOUD', C3, A3, U1, I2],
  ['CLOUD_SH', U3, A2, U0, I1],
  ['SMOKE', C1, C1, U2, I3],
  ['SMOKE_DK', U2, U1, U0, I2],
  ['SUN', C3, C3, A3, A3],
  ['SUN_RIM', A3, A2, A2, A2],
  ['MOON', C3, C3, C3, C3],
  ['MOON_DK', C1, C1, C1, C1],
  ['STAR', C3, C3, C3, C3],
  ['STAR_DIM', U2, U2, U2, U2],
  ['LIT', A2, A2, A2, A2],
  ['LIT_HI', A3, A3, A3, A3],
  ['LIT_DK', A1, A1, A1, A1],
  ['SIL', I0, I0, I0, I0],
  ['FIREFLY', A3, A3, A3, A3],
  ['BIRD', I2, I2, I1, I0],
  ['MARK', I0, I0, C3, C3],
  ['ZZZ', U3, U3, U3, U3],
  ['WING', A2, A2, A1, I2],
  ['SNOW', C3, A3, U2, I3],
  ['SNOW_SH', U2, U1, U0, I2],
  ['SNOW_DK', U1, U0, I3, I1],
  ['SEA', U1, U0, I3, I1],
  ['SEA_DK', U0, I3, I2, I0],
  ['SEA_LT', U2, A1, U0, I2],
  ['SEA_HI', U3, A3, U2, I3],
  ['FOAM', C3, A3, U2, I3],
  ['ROCK', U0, I3, I1, I0],
  ['LANTERN', A1, A2, A3, A3],
  ['LANTERN_HI', A2, A3, A3, A3],
  ['BAND', A1, A1, I3, I1],
  ['PLASTER', C2, A2, U1, I2],
  ['PLASTER_SH', C1, A1, U0, I1],
  ['CONCRETE', U2, U1, I3, I1],
  ['CONCRETE_SH', U1, U0, I2, I0],
  ['ASPHALT', U0, I3, I2, I1],
  ['ASPHALT_LT', U1, U0, I3, I1],
  ['ASPHALT_DK', I3, I2, I1, I0],
  ['LINE', C3, A3, U2, I3],
  ['GLASS_SKY', U2, A2, I3, I1],
  ['GLASS_SKY_HI', U3, A3, U1, I2],
  ['NOREN', I3, I2, I1, I0],
  ['CAT', A2, A1, I3, I1],
  ['CAT_DK', A0, A0, I2, I0],
  ['AUR_HI', G3, G3, G3, G3],
  ['AUR_MID', G2, G2, G2, G2],
  ['AUR_LO', G1, G1, G1, G1],
  ['AUR_ICE', U3, U3, U3, U3],
  ['SAND_LT', C2, A2, U1, I3],
  ['SOFA', G1, G0, I2, I0],
  ['SOFA_LT', G2, G1, I3, I1],
  ['SOFA_DK', G0, G0, I1, I0],
  ['RUG', U1, U0, I3, I1],
  ['RUG_LT', U2, U1, I3, I2],
  ['SHALLOW', G3, A2, U1, I2],
];
const M = Object.fromEntries(MATS.map((row, i) => [row[0], i]));
const KEYS = [
  [0, 3, [I0, I0, I1, I1, I2]],
  [4.8, 3, [I0, I0, I1, I1, I2]],
  [5.4, 3, [I0, I1, I2, I3, U0]],
  [6.0, 2, [I1, I2, I3, U0, U1, A1]],
  [6.7, 1, [I3, U0, U1, U2, A2, A3]],
  [7.8, 0, [U1, U2, U3, C2, C3]],
  [10, 0, [U2, U3, C2, C3, C3]],
  [15, 0, [U1, U2, U3, C2, C3]],
  [17, 1, [U0, U1, U3, C1, A3, A2]],
  [18, 1, [I3, U0, U1, A1, A2, A3]],
  [19, 2, [I1, I2, I3, U0, A0, A1]],
  [20.3, 3, [I0, I0, I1, I1, I2]],
  [24, 3, [I0, I0, I1, I1, I2]],
];
const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const mix = (a, b, t) => a + (b - a) * t;
const smoothstep = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const bayerAt = (x, y) => BAYER[((y & 3) << 2) | (x & 3)];
function seeded(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function makeNoise(seed) {
  const r = seeded(seed); const table = new Float32Array(65536); for (let i = 0; i < 65536; i++) table[i] = r();
  const at = (x, y) => table[((x & 255) << 8) | (y & 255)];
  return (x, y) => { const xi = Math.floor(x); const yi = Math.floor(y); const fx = x - xi; const fy = y - yi; const u = fx * fx * (3 - 2 * fx); const v = fy * fy * (3 - 2 * fy); return mix(mix(at(xi, yi), at(xi + 1, yi), u), mix(at(xi, yi + 1), at(xi + 1, yi + 1), u), v); };
}
const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const toGamma = (c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);
function rgbToOklab([r8, g8, b8]) {
  const r = toLinear(r8 / 255); const g = toLinear(g8 / 255); const b = toLinear(b8 / 255);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
function oklabToLinear(L, a, b) {
  const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
  const m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
  const s = Math.pow(L - 0.0894841775 * a - 1.291485548 * b, 3);
  return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
}
function labTone(lab, L) {
  let chroma = 1;
  for (let i = 0; i < 24; i++) {
    const rgb = oklabToLinear(L, lab[1] * chroma, lab[2] * chroma);
    if (rgb.every((v) => v >= -0.001 && v <= 1.001)) return rgb.map((v) => Math.round(toGamma(clamp(v)) * 255));
    chroma *= 0.9;
  }
  return oklabToLinear(L, 0, 0).map((v) => Math.round(toGamma(clamp(v)) * 255));
}
const CHARS = { H: 'HAIR', S: 'SKIN', E: 'HAIR', T: 'SHIRT', D: 'SHIRT_DK', P: 'PANTS', B: 'BOOT', W: 'BOOK', K: 'BOOK_DK', C: 'CAT', Q: 'CAT_DK', L: 'LANTERN', F: 'FOAM' };
const makeSprite = (rows) => { const list = []; rows.forEach((row, y) => { [...row].forEach((ch, x) => { if (ch !== '.') list.push([x, y, M[CHARS[ch]], ch === 'E']); }); }); return { list, w: rows[0].length, h: rows.length }; };
const HEAD = ['..HHH..', '.HHHHH.', '.HHSSS.', '.HSSES.', '..SSSS.'];
const HEAD_BLINK = ['..HHH..', '.HHHHH.', '.HHSSS.', '.HSSSS.', '..SSSS.'];
const HEAD_UP = ['..HHH..', '.HHHHH.', '.HHSES.', '.HSSSS.', '..SSSS.'];
const BODY_STAND = ['..TTT..', '.TTTTT.', '.STTTS.', '..DDD..', '..PPP..', '..P.P..', '..B.B..'];
const BODY_WALK1 = ['..TTT..', '.TTTTT.', '..TTTS.', '.SDDD..', '..PPP..', '.PP.P..', '.B..BB.'];
const BODY_WALK2 = ['..TTT..', '.TTTTT.', '.STTTS.', '..DDD..', '..PPP..', '..PP...', '..BB...'];
const BODY_WALK3 = ['..TTT..', '.TTTTT.', '.STTT..', '..DDDS.', '..PPP..', '..P.PP.', '.BB..B.'];
const BODY_ARMS = ['S.TTT.S', 'STTTTTS', '..TTT..', '..DDD..', '..PPP..', '..P.P..', '..B.B..'];
const person = (head, body) => makeSprite([...head, ...body]);
const SPR = {
  stand: person(HEAD, BODY_STAND),
  blink: person(HEAD_BLINK, BODY_STAND),
  walk: [person(HEAD, BODY_WALK1), person(HEAD, BODY_WALK2), person(HEAD, BODY_WALK3), person(HEAD, BODY_WALK2)],
  up: person(HEAD_UP, BODY_ARMS),
  crouch: person(HEAD, ['..TTT..', '.TTTTTS', '..DDD.S', '..PPP..', '.BB.B..']),
  seat: makeSprite(['....HHH..','...HHHHH.','...SSSHH.','...ESSHH.','...SSSS..','...TTTT..','...STTTT.','...STTTT.','PPPPPPDD.','BB.PPPPP.']),
  seatBlink: makeSprite(['....HHH..','...HHHHH.','...SSSHH.','...SSSHH.','...SSSS..','...TTTT..','...STTTT.','...STTTT.','PPPPPPDD.','BB.PPPPP.']),
  seatUp: makeSprite(['....HHH..','...HHHHH.','...ESSHH.','...SSSHH.','...SSSS..','...TTTT..','...STTTT.','...STTTT.','PPPPPPDD.','BB.PPPPP.']),
  bust: makeSprite(['...HHH...', '..HHHHH..', '..HSSES..', '...SSS...', '..TTTTT..', '.TTTTTTT.', '.TTTTTTT.', '.TTTTTTT.']),
  bustBlink: makeSprite(['...HHH...', '..HHHHH..', '..HSSSS..', '...SSS...', '..TTTTT..', '.TTTTTTT.', '.TTTTTTT.', '.TTTTTTT.']),
  bustUp: makeSprite(['S..HHH..S', 'S.HHHHH.S', 'S.HSSES.S', 'SS.SSS.SS', '.STTTTTS.', '..TTTTT..', '..TTTTT..', '..TTTTT..']),
  bustHalf: makeSprite(['...HHH...', '..HHHHH..', 'S.HSSES.S', 'SS.SSS.SS', '.STTTTTS.', '..TTTTT..', '.TTTTTTT.', '.TTTTTTT.']),
  sil: makeSprite(['...HHH..', '..HHHHH.', '..HHHHH.', '...HHH..', '..HHHHH.', '.HHHHHHH', 'HHHHHHHH', 'HHHHHHHH']),
  silLook: makeSprite(['....HHH.', '...HHHHH', '...HHHHH', '...HHH..', '..HHHHH.', '.HHHHHHH', 'HHHHHHHH', 'HHHHHHHH']),
};
const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;
const FRAG = `#version 300 es
precision highp float;
precision highp sampler2D;
uniform sampler2D uWorld, uGlowNear;
uniform vec2 uRes, uPill, uOrigin, uWorldSize, uGlowSize;
uniform vec4 uLens;
uniform float uBezel, uK, uNight, uLift, uSeam, uCalm, uRefraction, uDispersion, uShine;
uniform vec3 uShellDay, uShellNight, uInk, uLight, uHiNight, uLoNight, uSkyDay, uHomeCol, uSkyCol;
uniform vec2 uHomePos, uSkyPos;
out vec4 outColor;
float rb(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
vec3 smoothTex(sampler2D t, vec2 uv, vec2 size) { vec2 st = uv * size - 0.5; vec2 i = floor(st); vec2 f = st - i; vec2 f2 = f * f; vec2 f3 = f2 * f; vec2 w0 = (1.0 - 3.0 * f + 3.0 * f2 - f3) / 6.0; vec2 w1 = (4.0 - 6.0 * f2 + 3.0 * f3) / 6.0; vec2 w2 = (1.0 + 3.0 * f + 3.0 * f2 - 3.0 * f3) / 6.0; vec2 w3 = f3 / 6.0; vec2 g0 = w0 + w1; vec2 g1 = w2 + w3; vec2 h0 = (i - 0.5 + w1 / g0 + 0.5) / size; vec2 h1 = (i + 1.5 + w3 / g1 + 0.5) / size; return g0.y * (g0.x * texture(t, vec2(h0.x, h0.y)).rgb + g1.x * texture(t, vec2(h1.x, h0.y)).rgb) + g1.y * (g0.x * texture(t, vec2(h0.x, h1.y)).rgb + g1.x * texture(t, vec2(h1.x, h1.y)).rgb); }
vec3 glowNear(vec2 frag) { vec2 uv = vec2(frag.x / uRes.x, 1.0 - frag.y / uRes.y); vec3 rough = textureLod(uGlowNear, uv, 0.0).rgb; if (rough.r + rough.g + rough.b < 1.0e-4) return vec3(0.0); return smoothTex(uGlowNear, uv, uGlowSize); }
vec3 reach(vec2 p, vec2 pos, vec3 col, float radius) { vec2 L = pos - p; float r2 = radius * radius; return col * r2 / (r2 + dot(L, L)); }
float seamAt(vec2 w, float scale) { if (scale < 7.0) return 1.0; vec2 f = fract(w) * scale; vec2 g = min(f, scale - f); float edge = min(g.x, g.y); return 1.0 - 0.075 * (1.0 - smoothstep(0.0, uSeam, edge)); }
vec3 worldExact(vec2 frag) { vec2 w = vec2(frag.x - uOrigin.x, uOrigin.y - frag.y) / uK; ivec2 t = ivec2(floor(w)); t = clamp(t, ivec2(0), ivec2(uWorldSize) - 1); return texelFetch(uWorld, t, 0).rgb * seamAt(w, uK); }
vec3 worldBent(vec2 frag, float scale, float foot) { vec2 w = vec2(frag.x - uOrigin.x, uOrigin.y - frag.y) / uK; if (foot > 1.0) return textureLod(uWorld, w / uWorldSize, log2(foot)).rgb; vec2 r = floor(w + 0.5); vec2 sharp = r - 0.5 + clamp((w - r) / max(foot, 1.0e-3) + 0.5, 0.0, 1.0); return textureLod(uWorld, sharp / uWorldSize, 0.0).rgb * seamAt(w, scale); }
vec3 envLow, envHigh;
float softBox(vec2 p, vec2 c, vec2 h, float s) { vec2 q = abs(p - c) - h; float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0); return 1.0 - smoothstep(-s, s, d); }
vec3 studio(vec3 R) { vec3 c = mix(envLow, envHigh, smoothstep(-0.55, 0.85, R.y)); vec2 s = R.xy / (1.0 + max(R.z, 0.0)); float key = softBox(s, vec2(-0.1, 0.56), vec2(0.5, 0.11), 0.17); float fill = softBox(s, vec2(0.34, -0.6), vec2(0.3, 0.05), 0.2); c += envHigh * key * 1.15; c += envHigh * fill * 0.14; return c; }
vec3 shellColor(vec2 p, vec2 frag, float d) { vec2 q = p; float inner = uPill.x - uPill.y; q.x = sign(p.x) * max(abs(p.x) - inner, 0.0); vec2 g = q / max(length(q), 1.0e-3); float t = clamp(-d / uBezel, 0.0, 1.0); float a = (1.0 - 2.0 * t); a = sign(a) * pow(abs(a), 1.35) * 0.96; vec3 N = normalize(vec3(g * a, sqrt(max(1.0 - a * a, 0.02)))); vec3 R = vec3(2.0 * N.z * N.xy, 2.0 * N.z * N.z - 1.0); vec3 albedo = mix(uShellDay, uShellNight, uNight); float diffuse = 0.62 + 0.38 * clamp(dot(N, normalize(vec3(-0.25, 0.75, 0.6))), 0.0, 1.0); float fresnel = 0.05 + 0.95 * pow(1.0 - N.z, 3.5); vec3 c = albedo * diffuse; c = mix(c, studio(R), clamp(fresnel * 0.9 + 0.1, 0.0, 1.0)); float toWindow = smoothstep(0.62, 1.0, t); c = mix(c, c * 0.8, toWindow * 0.55); float radius = uPill.y * 0.62; for (int i = 0; i < 2; i++) { vec2 pos = i == 0 ? uHomePos : uSkyPos; vec3 col = i == 0 ? uHomeCol : uSkyCol; vec3 e = reach(p, pos, col, radius); vec2 toL = normalize(pos - p + 1.0e-3); float wrap = 0.5 + 0.5 * dot(N.xy, toL); c += e * wrap * mix(albedo * 0.9, vec3(dot(albedo, vec3(0.34))) + 0.34, 0.55) * 3.1; vec3 Ld = normalize(vec3(pos - p, uPill.y * 0.7)); float spec = pow(max(dot(R, Ld), 0.0), 5.0); c += reach(p, pos, col, uPill.y * 0.4) * spec * 1.4; } return c; }
void main() { vec2 frag = gl_FragCoord.xy; vec2 p = frag - 0.5 * uRes; envLow = mix(uShellDay * 0.74, uLoNight, uNight); envHigh = mix(uLight, uHiNight, uNight); float d = rb(p, uPill, uPill.y); float dw = d + uBezel; vec3 premul = vec3(0.0); float alpha = 0.0; if (d > -2.0) { float h = uPill.y; float wide = rb(p + vec2(0.0, h * 0.13), uPill - vec2(h * 0.02, h * 0.02), uPill.y); float contact = rb(p + vec2(0.0, h * 0.028), uPill, uPill.y); float shadow = 0.24 * (1.0 - smoothstep(-h * 0.2, h * 0.28, wide)) + 0.22 * (1.0 - smoothstep(-h * 0.03, h * 0.07, contact)); alpha = shadow; premul = uInk * shadow; if (uHomeCol.r + uHomeCol.g + uHomeCol.b > 0.0) { vec3 outside = reach(p, uHomePos, uHomeCol, uPill.y * 0.62) * exp(-max(d, 0.0) / (h * 0.2)); float amount = clamp(dot(outside, vec3(0.34)) * 2.3, 0.0, 0.85); vec3 tint = outside / max(dot(outside, vec3(0.34)), 1.0e-3) * 0.34; premul = mix(premul, tint * 1.25, amount); alpha = mix(alpha, 1.0, amount); } vec2 toEdge = 0.5 * uRes - abs(p); float room = min(toEdge.x, toEdge.y) / (h * 0.32); float fade = smoothstep(0.0, 1.0, clamp(room, 0.0, 1.0)); premul *= fade; alpha *= fade; } vec3 color = premul; if (d < 1.0) { vec3 body = dw > -0.8 ? shellColor(p, frag, d) : vec3(0.0); if (dw < 1.0) { vec3 c = worldExact(frag); vec3 near = glowNear(frag); c = 1.0 - (1.0 - c) * (1.0 - clamp(near * 0.82, 0.0, 1.0)); float win = uPill.y - uBezel; float sheen = smoothstep(win * 0.1, win * 1.02, p.y + p.x * 0.09); c = mix(c, envHigh, sheen * sheen * mix(0.17, 0.05, uNight)); float low = smoothstep(-win * 0.5, -win * 1.05, p.y - p.x * 0.05); c = mix(c, envHigh, low * mix(0.05, 0.015, uNight)); float top = rb(p - vec2(0.0, win * 0.06), uPill - vec2(uBezel), win); float inset = 1.0 - smoothstep(-win * 0.2, win * 0.03, top + win * 0.0); float ring = exp(max(dw, -win) / (win * 0.075)); float depth = clamp(ring * 0.46 + (1.0 - exp(min(top, 0.0) / (win * 0.14))) * 0.0 + exp(min(top, 0.0) / (win * 0.1)) * 0.4 * inset, 0.0, 0.82); c = mix(c, uInk, depth); vec2 lc = uLens.xy; vec2 he = uLens.zw; float lr = min(he.x, he.y); vec2 lq = p - lc; float lift = 0.055 + uLift * 0.04; float sd = rb(lq + vec2(0.0, lr * lift * 1.5), he, lr); float sh = 1.0 - smoothstep(-lr * 0.16, lr * (0.2 + uLift * 0.1), sd); c = mix(c, uInk, sh * mix(0.36, 0.55, uNight)); float ld = rb(lq, he, lr); if (ld < 1.0) { vec2 axis = lq; vec2 inner2 = max(he - lr, vec2(0.0)); axis.x = sign(lq.x) * max(abs(lq.x) - inner2.x, 0.0); axis.y = sign(lq.y) * max(abs(lq.y) - inner2.y, 0.0); float rad = length(axis); vec2 gr = axis / max(rad, 1.0e-3); float rho = clamp(rad / lr, 0.0, 1.0); float mag = uRefraction; float bt = clamp((rho - 0.7) / 0.3, 0.0, 1.0); float band = bt * bt * (3.0 - 2.0 * bt); float strength = 1.0 - 1.0 / mag + 0.2; float bend = pow(band, 2.2) * lr * strength; vec2 base = lc + lq / mag; vec2 shiftDir = gr * bend; vec2 center = 0.5 * uRes; float dBand = 6.0 * bt * (1.0 - bt) / 0.3; float foot = (1.0 / mag + 2.2 * pow(max(band, 1.0e-3), 1.2) * dBand * strength) / uK; vec3 seen; float scale = uK * mag; if (band > 0.02) { float ca = uDispersion * band; seen.r = worldBent(center + base + shiftDir * (1.0 - ca), scale, foot).r; seen.g = worldBent(center + base + shiftDir, scale, foot).g; seen.b = worldBent(center + base + shiftDir * (1.0 + ca), scale, foot).b; } else { seen = worldBent(center + base, scale, foot); } vec3 throughGlow = glowNear(center + base + shiftDir); seen = 1.0 - (1.0 - seen) * (1.0 - clamp(throughGlow * 0.8, 0.0, 1.0)); vec2 tilt = gr * (0.22 * rho + 0.78 * pow(rho, 7.0)); vec3 N = normalize(vec3(tilt, sqrt(max(1.0 - dot(tilt, tilt), 0.02)))); vec3 R = vec3(2.0 * N.z * N.xy, 2.0 * N.z * N.z - 1.0); vec2 lp = lq / lr; vec3 lens = seen * 1.035; float edge = pow(rho, 16.0); lens = mix(lens, uInk, edge * 0.42); float pool = smoothstep(0.05, 0.95, -lp.y * 0.9 + lp.x * 0.2) * smoothstep(1.0, 0.8, rho) * smoothstep(0.42, 0.86, rho); lens += envHigh * pool * mix(0.3, 0.1, uNight); float broad = softBox(lp, vec2(-0.1, 0.62), vec2(0.5, 0.17), 0.3) * smoothstep(0.98, 0.72, rho); lens = mix(lens, envHigh, broad * mix(uShine, 0.1, uNight)); float fresnel = pow(1.0 - N.z, 3.0); float dir = 0.2 + 0.8 * smoothstep(-0.6, 0.85, dot(gr, normalize(vec2(-0.42, 0.9)))); float mirror = clamp(fresnel * dir * dir * 0.6, 0.0, 0.42); if (mirror > 1.0e-3) lens = mix(lens, studio(R), mirror); if (rho > 0.62) { for (int i = 0; i < 2; i++) { vec2 pos = i == 0 ? uHomePos : uSkyPos; vec3 col = i == 0 ? uHomeCol : uSkyCol; vec2 toL = normalize(pos - p + 1.0e-3); float side = max(dot(gr, toL), 0.0); lens += reach(p, pos, col, uPill.y * 0.9) * side * side * side * smoothstep(0.62, 0.97, rho) * 0.6; } } c = mix(c, lens, 1.0 - smoothstep(-0.8, 0.8, ld)); } body = mix(body, c, 1.0 - smoothstep(-0.8, 0.8, dw)); } float cover = 1.0 - smoothstep(-0.8, 0.8, d); color = mix(premul, body, cover); alpha = mix(alpha, 1.0, cover); } float n = fract(sin(dot(frag, vec2(12.9898, 78.233))) * 43758.5453); n += fract(sin(dot(frag, vec2(93.989, 67.345))) * 24634.6345) - 1.0; color += (n * 0.75) / 255.0 * min(alpha * 4.0, 1.0); outColor = vec4(clamp(color, 0.0, 1.0), alpha); }`;
function mount(root) {
  const dataset = root.dataset || {};
  const readPositiveNumber = (name, fallback) => {
    const raw = dataset[name];
    if (raw == null || String(raw).trim() === '') return fallback;
    const value = Number(raw);
    return Number.isFinite(value) && value > 0 ? value : fallback;
  };
  const speed = readPositiveNumber('speed', 9.5);
  const refraction = readPositiveNumber('refraction', 1.24);
  const bezelRatio = readPositiveNumber('bezel', 0.046);
  const startNight = dataset.startNight === 'true';
  const readRangeNumber = (name, fallback, min, max) => {
    const raw = dataset[name];
    if (raw == null || String(raw).trim() === '') return fallback;
    const value = Number(raw);
    return Number.isFinite(value) ? clamp(value, min, max) : fallback;
  };
  const friction = readRangeNumber('friction', 0.6, 0.1, 0.9);
  const bounce = readRangeNumber('bounce', 3.2, 0, 12);
  const dispersion = readRangeNumber('dispersion', 0.05, 0, 0.25);
  const shine = readRangeNumber('shine', 0.44, 0, 1.5);
  const timeSpeed = readRangeNumber('timeSpeed', 1, 0, 8);
  const weather = dataset.weather === 'snow' ? 'snow' : 'default';
  const cleanups = [];
  const on = (target, type, fn, options) => { target.addEventListener(type, fn, options); cleanups.push(() => target.removeEventListener(type, fn, options)); };
  let canvas = root.querySelector('.scene');
  const button = root.querySelector('.hit');
  const statusEl = root.querySelector('[data-status]');
  const probe = root.querySelector('.probe');
  const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const schemeQuery = matchMedia('(prefers-color-scheme: dark)');
  let calm = motionQuery.matches;
  const offscreen = (w, h) => (typeof OffscreenCanvas === 'function' ? new OffscreenCanvas(w, h) : Object.assign(root.ownerDocument.createElement('canvas'), { width: w, height: h }));
  const paint = offscreen(1, 1).getContext('2d', { willReadFrequently: true });
  const palette = new Array(20);
  const palette32 = new Uint32Array(20);
  const readPalette = () => {
    const style = getComputedStyle(root);
    RAMPS.forEach(([name, tones], ramp) => {
      probe.style.color = style.getPropertyValue(`--_${name}`).trim();
      paint.clearRect(0, 0, 1, 1);
      paint.fillStyle = getComputedStyle(probe).color;
      paint.fillRect(0, 0, 1, 1);
      const d = paint.getImageData(0, 0, 1, 1).data;
      const lab = rgbToOklab([d[0], d[1], d[2]]);
      tones.forEach((L, step) => {
        const rgb = labTone(lab, L);
        const id = ramp * 4 + step;
        palette[id] = rgb;
        palette32[id] = (255 << 24) | (rgb[2] << 16) | (rgb[1] << 8) | rgb[0];
      });
    });
  };
  const unit = (id) => palette[id].map((v) => v / 255);
  const STEP_L = RAMPS.flatMap(([, tones]) => tones);
  const shadeOf = (id) => { const step = id % 4; if (step > 0) return id - 1; if (id === C0) return U0; if (id === G0) return I3; if (id === U0) return I3; if (id === A0) return I3; return id; };
  const litOf = (dayId) => { const L = STEP_L[dayId]; return L < 0.9 ? A0 : A1; };
  const NM = MATS.length;
  const table = KEYS.map(([, col]) => { const t = new Uint8Array(NM * 3); MATS.forEach((row, m) => { const id = row[col + 1]; t[m] = id; t[NM + m] = shadeOf(id); t[NM * 2 + m] = litOf(row[1]); }); return t; });
  let bw = 1; let bh = 1; let ox = 0; let oy = 0; let k = 1;
  let matBuf = new Uint8Array(1); let baseBuf = new Uint8Array(1); let varBuf = new Uint8Array(1);
  let thrA = new Uint8Array(1); let thrB = new Uint8Array(1);
  let pixels = new Uint32Array(1); let pixelBytes = new Uint8Array(pixels.buffer);
  let skyKeys = []; let canopy = []; let stars = [];
  const emitList = [];
  const sources = [{ w: 0, x: 0, y: 0, r: 0, g: 0, b: 0 }, { w: 0, x: 0, y: 0, r: 0, g: 0, b: 0 }];
  const noiseA = makeNoise(11); const noiseB = makeNoise(29);
  const put = (x, y, m) => { const px = x + ox; const py = y + oy; if (px < 0 || py < 0 || px >= bw || py >= bh) return; matBuf[py * bw + px] = m; };
  const putSky = (x, y, m) => { const px = x + ox; const py = y + oy; if (px < 0 || py < 0 || px >= bw || py >= bh) return; const i = py * bw + px; if (matBuf[i] === 0) matBuf[i] = m; };
  const rect = (x, y, w, h, m) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) put(x + i, y + j, m); };
  const get = (x, y) => { const px = x + ox; const py = y + oy; if (px < 0 || py < 0 || px >= bw || py >= bh) return -1; return matBuf[py * bw + px]; };
  const blit = (s, x, y, flip = false, force = -1) => { for (const [dx, dy, m] of s.list) put(flip ? x + s.w - 1 - dx : x + dx, y + dy, force >= 0 ? force : m); };
  const emit = (x, y, weight, group = 2) => { const px = x + ox; const py = y + oy; if (px < 0 || py < 0 || px >= bw || py >= bh) return; emitList.push(py * bw + px, weight); if (group < 2) { const c = sources[group]; c.w += weight; c.x += px * weight; c.y += py * weight; } };
  const hillFar = (x) => 58 + noiseA(x * 0.022 + 3, 1.5) * 16 + noiseB(x * 0.09, 4.5) * 3;
  const hillNear = (x) => 69 + noiseA(x * 0.034 + 40, 7.5) * 11 + noiseB(x * 0.14 + 7, 2.5) * 2;
  const pathDist = (x, y) => { const main = Math.abs(x - (74 + Math.pow(Math.max(y - 86, 0), 1.45) * 0.62 + Math.sin(y * 0.3) * 1.5)); const toTree = y < 100 ? Math.abs(y - (92 + Math.sin(x * 0.09) * 1.4 + (x - 78) * 0.012)) * (x > 78 && x < 136 ? 1 : 99) : 99; return Math.min(main * 0.5, toTree); };
  const paintGround = () => { for (let py = 0; py < bh; py++) { const y = py - oy; for (let px = 0; px < bw; px++) { const x = px - ox; const i = py * bw + px; if (y < HORIZON) { if (y >= hillNear(x)) { const tuft = noiseB(x * 0.5, y * 0.8) > 0.74 && y > hillNear(x) + 1; matBuf[i] = tuft ? M.TREE_FAR : M.HILL_NEAR; } else if (y >= hillFar(x)) { const fromTop = y - hillFar(x); matBuf[i] = fromTop < 2 && bayerAt(x, y) > 9 ? 0 : M.HILL_FAR; } continue; } const n = noiseA(x * 0.075 + 9, y * 0.2 + 3) + noiseB(x * 0.3, y * 0.5) * 0.28; const depth = (y - HORIZON) / 30; const v = n + (bayerAt(x, y) / 16 - 0.5) * 0.14 - depth * 0.14; let m = M.GRASS; if (v > 0.84) m = M.GRASS_LT; else if (v < 0.5) m = M.GRASS_DK; const pd = pathDist(x, y); if (pd < 2.4 + depth * 2.4) { const pebble = noiseB(x * 0.7 + 3, y * 0.9) > 0.68; m = pebble ? M.PATH_DK : M.PATH; } else if (pd < 3.4 + depth * 2.4 && bayerAt(x, y) > 7) { m = M.PATH_DK; } matBuf[i] = m; } } const r = seeded(5); for (let x = -ox; x < bw - ox; x++) { if (r() < 0.6) put(x, HORIZON, M.GRASS_DK); } for (let i = 0; i < (bw * bh) / 60; i++) { const x = Math.floor(r() * bw) - ox; const y = HORIZON + 2 + Math.floor(r() * (bh - oy - HORIZON)); if (pathDist(x, y) < 5) continue; put(x, y, r() < 0.5 ? M.GRASS_LT : M.GRASS_DK); if (r() < 0.5) put(x, y - 1, M.GRASS_LT); } };
  const paintFence = () => { for (let x = 90; x < 124; x += 4) { rect(x, 74, 2, 9, M.WOOD_LT); put(x + 1, 74, M.PLANK); rect(x + 1, 75, 1, 8, M.WOOD); } rect(89, 76, 36, 1, M.WOOD_LT); rect(89, 80, 36, 1, M.WOOD); };
  const paintBush = (cx, cy, rx, ry, seed) => { const r = seeded(seed); const blobs = Array.from({ length: 6 }, () => [cx + (r() - 0.5) * rx * 1.5, cy + (r() - 0.5) * ry, 3 + r() * (ry * 0.75)]); for (let y = cy - ry - 3; y <= cy + ry + 1; y++) { for (let x = cx - rx - 3; x <= cx + rx + 3; x++) { let inside = false; let shade = 0; for (const [bx, by, br] of blobs) { const d = Math.hypot(x - bx, (y - by) * 1.15); if (d < br) { inside = true; shade = Math.max(shade, 1 - d / br); } } if (!inside) continue; const v = shade * 0.6 + (cy - y) / (ry * 2.4) + (bayerAt(x, y) / 16 - 0.5) * 0.3 + noiseB(x * 0.4, y * 0.5) * 0.25; put(x, y, v > 0.82 ? M.LEAF3 : v > 0.52 ? M.LEAF2 : v > 0.24 ? M.LEAF1 : M.LEAF0); } } };
  const paintFlowers = (x0, x1, y0, y1, count, seed) => { const r = seeded(seed); for (let i = 0; i < count; i++) { const x = Math.floor(mix(x0, x1, r())); const y = Math.floor(mix(y0, y1, r())); if (pathDist(x, y) < 4.5) continue; put(x, y, M.STEM); put(x, y - 1, M.STEM); const m = r() < 0.55 ? M.FLOWER_A : M.FLOWER_C; put(x, y - 2, m); if (r() < 0.5) { put(x - 1, y - 2, m); put(x + 1, y - 2, m); put(x, y - 3, m); } } };
  const paintHouse = () => {
    const X0 = 38; const X1 = 84; const TOP = 53; const BASE = 85;
    rect(68, 28, 8, 18, M.BRICK);
    for (let y = 28; y < 46; y += 2) { for (let x = 68; x < 76; x++) if ((x + (((y - 28) / 2) & 1) * 2) % 4 < 2) put(x, y, M.BRICK_LT); }
    rect(67, 26, 10, 2, M.STONE_LT); rect(67, 28, 10, 1, M.STONE);
    rect(X0, TOP, X1 - X0, BASE - TOP, M.WALL);
    for (let y = TOP + 3; y < BASE; y += 4) { for (let x = X0; x < X1; x++) if ((x * 7 + y * 3) % 23 !== 0) put(x, y, M.PLANK); }
    for (let y = TOP; y < TOP + 6; y++) { for (let x = X0; x < X1; x++) { if (y < TOP + 3 || bayerAt(x, y) < (TOP + 6 - y) * 4) put(x, y, M.WALL_SH); } }
    for (let x = X1 - 3; x < X1; x++) { for (let y = TOP; y < BASE; y++) if (bayerAt(x, y) < (x - (X1 - 3) + 1) * 5) put(x, y, M.WALL_SH); }
    rect(X0 - 1, BASE - 3, X1 - X0 + 2, 3, M.STONE);
    for (let x = X0 - 1; x < X1 + 1; x += 5) { rect(x, BASE - 3, 4, 1, M.STONE_LT); put(x + 2, BASE - 2, M.STONE_LT); }
    const RT = 34;
    for (let y = RT; y < TOP; y++) { const t = (y - RT) / (TOP - RT); const l = Math.round(mix(47, X0 - 6, t)); const r = Math.round(mix(75, X1 + 6, t)); for (let x = l; x <= r; x++) { const row = Math.floor((y - RT) / 3); const tile = (x + (row & 1) * 3) % 6; let m = M.ROOF; if ((y - RT) % 3 === 0) m = M.ROOF; else if (tile === 0) m = M.ROOF; else m = (y - RT) % 3 === 1 ? M.ROOF_LT : M.ROOF; if (x - l < 5 + t * 8 && (y - RT) % 3 === 1 && tile !== 0) m = M.ROOF_HI; put(x, y, m); } }
    rect(46, RT - 1, 31, 1, M.ROOF_HI);
    for (let x = X0 - 6; x <= X1 + 6; x++) { put(x, TOP, M.WOOD_DK); if (x % 3 === 0) put(x, TOP + 1, M.WOOD_DK); }
    rect(67, 66, 12, 19, M.WOOD_DK); rect(68, 67, 10, 18, M.WOOD);
    for (let x = 70; x < 78; x += 3) rect(x, 67, 1, 18, M.WOOD_DK);
    rect(68, 72, 10, 1, M.WOOD_DK); rect(69, 68, 8, 3, M.GLASS); put(70, 69, M.GLASS_HI); put(71, 69, M.GLASS_HI); put(76, 77, M.FLOWER_A); rect(66, 85, 14, 2, M.STONE_LT); rect(65, 87, 16, 1, M.STONE);
    rect(44, 59, 18, 16, M.WOOD_DK); rect(43, 75, 20, 3, M.WOOD); rect(43, 75, 20, 1, M.WOOD_LT);
    const r = seeded(77); for (let x = 44; x < 62; x++) { if (r() < 0.75) put(x, 74, r() < 0.5 ? M.FLOWER_A : M.FLOWER_C); if (r() < 0.5) put(x, 73, M.STEM); }
    put(64, 63, M.WOOD_DK); put(65, 63, M.WOOD_DK);
    rect(92, 82, 1, 8, M.WOOD_DK); rect(90, 78, 6, 4, M.ROOF_LT); rect(90, 78, 6, 1, M.ROOF_HI); put(96, 79, M.FLOWER_A); put(96, 80, M.FLOWER_A);
  };
  const buildCanopy = () => {
    canopy = []; const r = seeded(303); const CX = 146; const CY = 44; const blobs = [[CX, CY, 21]];
    for (let i = 0; i < 16; i++) { const a = r() * Math.PI * 2; const d = 14 + r() * 13; blobs.push([CX + Math.cos(a) * d * 1.08, CY + Math.sin(a) * d * 0.82, 6 + r() * 7]); }
    for (let y = CY - 36; y <= CY + 32; y++) { for (let x = CX - 42; x <= CX + 42; x++) { let inside = false; let best = 0; for (const [bx, by, br] of blobs) { const d = Math.hypot(x - bx, y - by); if (d < br) { inside = true; best = Math.max(best, 1 - d / br); } } if (!inside) continue; const lightDir = ((CX - x) * 0.4 + (CY - y) * 0.75) / 26; const clump = best * 0.5; const grain = noiseB(x * 0.26 + 20, y * 0.3) * 0.7 + noiseA(x * 0.7, y * 0.7) * 0.3; const v = lightDir * 0.34 + clump + grain + (bayerAt(x, y) / 16 - 0.5) * 0.16 - 0.3; const m = v > 0.82 ? M.LEAF3 : v > 0.52 ? M.LEAF2 : v > 0.26 ? M.LEAF1 : M.LEAF0; canopy.push(x, y, m); } }
  };
  const paintTrunk = () => {
    const X = 143;
    for (let y = 56; y < 90; y++) { const flare = y > 83 ? (y - 83) * 0.8 : 0; const up = y < 66 ? (66 - y) * 0.1 : 0; const l = Math.round(X - flare - up); const r = Math.round(X + 7 + flare * 0.9 + up); for (let x = l; x <= r; x++) { const t = (x - l) / Math.max(r - l, 1); const grain = noiseB(x * 0.9, y * 0.14) > 0.55; put(x, y, t > 0.84 ? M.BARK : t < 0.2 ? M.WOOD_LT : grain ? M.BARK_LT : M.WOOD); } }
    rect(156, 87, 5, 2, M.STONE); rect(157, 86, 3, 1, M.STONE_LT); rect(124, 95, 4, 2, M.STONE); rect(125, 94, 2, 1, M.STONE_LT);
  };


  // ===== Scene toolkit: shared by the four non-countryside scenes =====
  // Every painter fills the WHOLE world buffer (-ox..bw-ox, -oy..bh-oy), not just the 192x112 core,
  // so wide windows never show raw sky at the edges. Dynamic things (lights, people, water, smoke) are
  // redrawn each frame on top of the static base in drawSceneLive().
  const hash2 = (a, b) => { let t = Math.imul(a | 0, 374761393) ^ Math.imul(b | 0, 668265263); t = Math.imul(t ^ (t >>> 13), 1274126177); return ((t ^ (t >>> 16)) >>> 0) / 4294967296; };
  const dth = (x, y, t) => t * 16 > bayerAt(x, y);
  const strip = (y0, y1, m) => { for (let y = y0; y < y1; y++) for (let x = -ox; x < bw - ox; x++) put(x, y, m); };
  const disc = (cx, cy, r, m) => { for (let y = Math.floor(cy - r); y <= cy + r; y++) for (let x = Math.floor(cx - r); x <= cx + r; x++) if ((x - cx) * (x - cx) + (y - cy) * (y - cy) <= r * r + 0.3) put(x, y, m); };
  const line = (x0, y0, x1, y1, m) => { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1); for (let i = 0; i <= n; i++) put(Math.round(mix(x0, x1, i / n)), Math.round(mix(y0, y1, i / n)), m); };
  const sunPos = (h) => { if (h <= 5.2 || h >= 19) return null; const a = ((h - 6) / 12) * Math.PI; return { x: Math.round(96 - Math.cos(a) * 102), y: Math.round(HORIZON - 2 - Math.sin(a) * 70) }; };
  const moonPos = (h) => { const mh = h >= 17.6 ? h : h + 24; if (mh <= 17.6 || mh >= 30.4) return null; const a = ((mh - 18) / 12) * Math.PI; return { x: Math.round(96 - Math.cos(a) * 102), y: Math.round(HORIZON - 2 - Math.sin(a) * 66) }; };
  const nightF = (h) => clamp(smoothstep(18.2, 20.2, h) + (1 - smoothstep(4.6, 6.2, h)));
  const lampAmt = (h) => (h >= 12 ? smoothstep(17.4, 19.0, h) : 1 - smoothstep(5.2, 6.8, h));
  const winFrac = (h) => { if (h >= 12) return 0.9 * smoothstep(17.2, 20.4, h) * (1 - 0.35 * smoothstep(23, 24, h)); if (h < 5) return 0.58 - h * 0.1; return Math.max(0, (0.08 + 0.32 * smoothstep(5, 6.3, h)) * (1 - smoothstep(6.8, 8.3, h))); };
  // windows that light up one by one as evening falls
  const wins = [];
  const addWin = (x, y, w, h, o = {}) => wins.push({ x, y, w, h, seed: o.seed !== undefined ? o.seed : hash2(x * 7 + 3, y * 13 + 1), mull: o.mull || 0, always: !!o.always, tiny: !!o.tiny });
  const drawWins = (h, level, boost = 1) => {
    for (const w of wins) {
      const on = w.always ? lampAmt(h) > 0.4 : w.seed < level; if (!on) continue;
      if (w.tiny) { put(w.x, w.y, M.LIT); emit(w.x, w.y, 70 * boost, 2); continue; }
      const flick = calm ? 1 : 0.93 + 0.07 * Math.sin(anim * 2.1 + w.seed * 40);
      for (let j = 0; j < w.h; j++) for (let i = 0; i < w.w; i++) {
        const ring = i === 0 || j === 0 || i === w.w - 1 || j === w.h - 1; const low = j === w.h - 1 && w.h > 3;
        let m = low ? M.LIT_DK : ring ? M.LIT : M.LIT_HI; if (w.mull && i === (w.w >> 1) && w.w > 4) m = M.WOOD_DK;
        put(w.x + i, w.y + j, m);
        if (!ring && ((i + j) & 1) === 0) emit(w.x + i, w.y + j, 62 * boost * flick, 2);
      }
    }
  };
  // warm light pool: switches nearby non-sky pixels to the "lit" tone table
  const pool = (cx, cy, rx, ry, L) => { if (L <= 0.01) return; for (let y = Math.max(Math.floor(cy - ry), -oy); y <= cy + ry; y++) for (let x = Math.floor(cx - rx); x <= cx + rx; x++) { const px = x + ox; const py = y + oy; if (px < 0 || py < 0 || px >= bw || py >= bh) continue; const i = py * bw + px; const m = matBuf[i]; if (m === 0 || m === M.SIL || m === M.LIT || m === M.LIT_HI || m === M.LIT_DK || m === M.LANTERN || m === M.LANTERN_HI) continue; const d = Math.hypot((x - cx) / rx, (y - cy) / ry); if ((1 - d) * L * 1.5 * 16 > bayerAt(x, y)) varBuf[i] = 2; } };
  // shell glow without bloom (the shell reads this as "the room is lit")
  const homeLight = (x, y, weight) => { if (weight <= 0) return; const c = sources[0]; const px = x + ox; const py = y + oy; c.w += weight; c.x += px * weight; c.y += py * weight; };
  const isSeaMat = (m) => m === M.SEA || m === M.SEA_DK || m === M.SEA_LT || m === M.SEA_HI;
  const fx = { smoke: [], t: 0 };
  // ===== Scene: seaside (lighthouse + pier + village across the bay) =====
  const SEAL = { YH: 60, SH: 98, LX: 182, T: 38, BASE: 76, DECK: 90 };
  const paintSeaside = () => {
    wins.length = 0; const { YH, SH, LX, T, BASE, DECK } = SEAL; const xa = -ox; const xb = bw - ox;
    // sea: pale haze at the horizon, deeper water in the middle, lighter shallows near the shore
    for (let y = YH; y <= SH + 10; y++) {
      const t = clamp((y - YH) / (SH - YH));
      for (let x = xa; x < xb; x++) {
        const n = noiseA(x * 0.05 + 9, y * 0.45 + 2);
        let m;
        if (t < 0.16) m = dth(x, y, (0.16 - t) * 6.5) ? M.SEA_LT : M.SEA;
        else if (t < 0.6) m = dth(x, y, (n - 0.3) * 1.7 + t * 0.35) ? M.SEA_DK : M.SEA;
        else m = dth(x, y, (t - 0.6) * 1.9 + (n - 0.5) * 0.4) ? M.SEA_LT : M.SEA;
        if (t > 0.78 && dth(x, y, (t - 0.78) * 3.8 + (n - 0.5) * 0.3)) m = M.SHALLOW;
        put(x, y, m);
      }
    }
    for (let x = xa; x < xb; x += 2) put(x, YH, M.SEA_HI);
    // far hills + village across the bay (left) and a low island (centre)
    const farTop = (x) => Math.round(YH - 10 + noiseA(x * 0.05 + 2, 3.5) * 3 + Math.pow(clamp((x - 6) / 64), 1.6) * 10);
    for (let x = xa; x < 76; x++) { const top = farTop(x); for (let y = top; y < YH; y++) put(x, y, y === top || dth(x, y, 0.3) ? M.HILL_NEAR : M.HILL_FAR); }
    for (const cx of [4, 22, 40]) for (let i = 0; i < 3; i++) {
      const x = cx + i * 4 + ((hash2(cx, i) * 2) | 0); const top = farTop(x) + 2; const hh = 2 + ((hash2(x, 9) * 2) | 0);
      rect(x, top - hh, 3, hh, M.CONCRETE_SH); put(x, top - hh - 1, M.ROOF); put(x + 1, top - hh - 2, M.ROOF); put(x + 1, top - hh - 1, M.ROOF); put(x + 2, top - hh - 1, M.ROOF); if (hash2(x, 4) < 0.85) addWin(x + 1, top - 1, 1, 1, { tiny: true });
    }
    for (let x = 98; x < 134; x++) { const top = YH - 1 - Math.round(3.4 * Math.sin(clamp((x - 98) / 36) * Math.PI) + noiseA(x * 0.1, 8) * 1.2); for (let y = top; y < YH; y++) put(x, y, y === top ? M.HILL_NEAR : M.HILL_FAR); }
    // rocky headland with the lighthouse (right): left-lit, dithered three-tone rock with strata
    const cliffTop = (x) => Math.round((x < 150 ? 98 - 22 * smoothstep(118, 150, x) : BASE) + (x > 204 ? (x - 204) * 0.4 : 0) + (noiseB(x * 0.2, 1) - 0.5) * 2.4);
    for (let x = 118; x < xb; x++) {
      const top = cliffTop(x);
      for (let y = top; y <= SH + 8; y++) {
        const depth = y - top; const strata = Math.sin((y + noiseA(x * 0.05, 3) * 7) * 1.25) * 0.09;
        const v = 0.62 - (x - 118) * 0.0045 - depth * 0.014 + (noiseB(x * 0.17 + 4, y * 0.3) - 0.5) * 0.5 + strata + (bayerAt(x, y) / 16 - 0.5) * 0.2 + (x < 150 ? (150 - x) * 0.004 : 0);
        let m = v > 0.6 ? M.STONE_LT : v > 0.3 ? M.STONE : M.ROCK;
        if (depth < 2 && x >= 150) m = (x + y) % 3 === 0 ? M.GRASS_LT : M.GRASS;
        else if (depth >= 2 && depth < 4 && x >= 150 && dth(x, y, 0.45)) m = M.GRASS_DK;
        else if (depth < 1) m = M.STONE_LT;
        put(x, y, m);
      }
    }
    for (let i = 0; i < 18; i++) { const x = 152 + ((hash2(i, 1) * 46) | 0); put(x, BASE - 1, M.GRASS_LT); put(x, BASE - 2, M.GRASS_LT); if (i % 4 === 0) put(x + 1, BASE - 3, M.FLOWER_C); }
    // keeper's cottage
    const CX0 = 153; const CB = BASE;
    rect(CX0, CB - 9, 17, 9, M.WALL); rect(CX0 + 14, CB - 9, 3, 9, M.WALL_SH); rect(CX0, CB - 9, 17, 1, M.WALL_SH);
    for (let y = CB - 17; y < CB - 9; y++) { const hw = Math.round(9.8 - (CB - 10 - y) * 1.1); for (let x = CX0 + 8 - hw; x <= CX0 + 8 + hw; x++) put(x, y, (y + x) % 3 === 0 ? M.ROOF_LT : M.ROOF); }
    rect(CX0 - 2, CB - 10, 21, 1, M.ROOF_LT); rect(CX0 + 11, CB - 22, 3, 7, M.BRICK); rect(CX0 + 10, CB - 23, 5, 1, M.STONE_LT);
    rect(CX0 + 3, CB - 6, 4, 6, M.WOOD_DK); put(CX0 + 6, CB - 3, M.WOOD_LT); rect(CX0 + 9, CB - 7, 4, 3, M.GLASS); put(CX0 + 9, CB - 7, M.GLASS_HI); addWin(CX0 + 9, CB - 7, 4, 3, {});
    // lighthouse tower
    const half = (y) => 5.5 + ((y - T) / (BASE - T)) * 3;
    for (let y = T; y < BASE; y++) {
      const hw = Math.round(half(y));
      for (let x = LX - hw; x <= LX + hw; x++) {
        const t = (x - (LX - hw)) / (2 * hw); let m = M.WALL;
        if (t > 0.78 || (t > 0.58 && dth(x, y, 0.55))) m = M.WALL_SH;
        if ((y >= T + 9 && y < T + 15) || (y >= T + 25 && y < T + 31)) m = t > 0.62 ? M.WOOD : M.BAND;
        put(x, y, m);
      }
    }
    rect(LX - 2, BASE - 7, 5, 7, M.WOOD_DK); put(LX + 1, BASE - 4, M.WOOD_LT); rect(LX - 1, T + 19, 3, 4, M.GLASS); put(LX - 1, T + 19, M.GLASS_HI); rect(LX - 1, T + 3, 3, 3, M.GLASS); put(LX - 1, T + 3, M.GLASS_HI);
    rect(LX - 9, T - 3, 19, 3, M.WOOD_DK); rect(LX - 9, T - 3, 19, 1, M.WOOD_LT); for (let x = LX - 9; x <= LX + 9; x += 3) rect(x, T - 6, 1, 3, M.WOOD_DK); rect(LX - 9, T - 7, 19, 1, M.WOOD_DK);
    rect(LX - 4, T - 15, 9, 8, M.GLASS); put(LX - 3, T - 14, M.GLASS_HI); put(LX - 3, T - 13, M.GLASS_HI); for (const dx of [-4, 0, 4]) rect(LX + dx, T - 15, 1, 8, M.WOOD_DK); rect(LX - 5, T - 8, 11, 1, M.WOOD_DK); rect(LX - 5, T - 16, 11, 1, M.WOOD_DK);
    for (let y = T - 22; y < T - 16; y++) { const hw = Math.round(1.6 + (y - (T - 22)) * 1.1); for (let x = LX - hw; x <= LX + hw; x++) put(x, y, x < LX - hw + 2 && y > T - 22 ? M.ROOF_HI : M.ROOF); }
    put(LX, T - 24, M.WOOD_DK); put(LX, T - 23, M.WOOD_DK); put(LX, T - 25, M.LANTERN_HI);
    // pier (left): plank deck, piles standing in the water, a lantern post at the end
    for (let x = xa; x < 106; x++) { put(x, DECK, (x % 6 === 0) ? M.WOOD : M.WOOD_LT); put(x, DECK + 1, M.WOOD); put(x, DECK + 2, M.WOOD_DK); }
    for (let x = xa + 3; x < 104; x += 12) { rect(x, DECK + 3, 2, 7, M.WOOD_DK); put(x, DECK + 3, M.WOOD); rect(x - 1, DECK + 9, 4, 1, M.SEA_HI); }
    for (let x = xa + 9; x < 100; x += 12) line(x, DECK + 3, x + 5, DECK + 7, M.WOOD_DK);
    rect(103, DECK - 9, 2, 9, M.WOOD_DK); rect(102, DECK - 12, 4, 3, M.LANTERN); put(102, DECK - 13, M.WOOD_DK); put(105, DECK - 13, M.WOOD_DK); rect(102, DECK - 14, 4, 1, M.WOOD_DK);
    // beach: tan sand, a thin wet band at the water, a few light grains
    for (let y = SH + 2; y < bh - oy; y++) {
      for (let x = xa; x < xb; x++) {
        const d = y - (SH + 2); const n = noiseA(x * 0.08 + 3, y * 0.25) + noiseB(x * 0.4, y * 0.6) * 0.3;
        let m = M.PATH; if (d < 3) m = dth(x, y, 0.8 - d * 0.25) ? M.PATH_DK : M.PATH; else if (n > 0.98) m = M.SAND_LT; else if (n < 0.3 && dth(x, y, 0.2)) m = M.PATH_DK;
        put(x, y, m);
      }
    }
    const rr = seeded(612); for (let i = 0; i < 26; i++) { const x = xa + ((rr() * bw) | 0); const y = SH + 6 + ((rr() * (bh - oy - SH - 6)) | 0); put(x, y, rr() < 0.6 ? M.SAND_LT : M.STONE_LT); }
    // row boat on the sand
    for (let y = 103; y < 110; y++) { const t = (y - 103) / 6; const l = Math.round(22 + t * 5); const r = Math.round(58 - t * 6); for (let x = l; x <= r; x++) put(x, y, y === 103 ? M.WOOD_LT : x < l + 2 || x > r - 2 ? M.WOOD_DK : (y + x) % 5 === 0 ? M.WOOD_LT : M.WOOD); }
    rect(26, 101, 28, 1, M.WOOD_DK); put(26, 100, M.WOOD_DK); put(53, 100, M.WOOD_DK); rect(36, 104, 8, 1, M.WOOD_LT); rect(50, 98, 1, 7, M.WOOD_LT); rect(49, 97, 3, 1, M.WOOD_LT);
    paintBush(8, 112, 9, 3, 951); paintBush(196, 113, 12, 3, 952); paintBush(112, 115, 8, 2, 953);
    for (let x = xa; x < xb; x += 9) { const y = 106 + (hash2(x, 5) * 7 | 0); put(x, y, M.GRASS_DK); put(x, y - 1, M.GRASS); put(x + 1, y - 2, M.GRASS_LT); put(x - 1, y - 2, M.GRASS_LT); }
  };
  const seaPerson = { x: 84, face: 1, step: 0, bite: 0, nextBite: 6, bob: 0 };
  const walkTo = (p, want, speed, dt) => { const d = want - p.x; if (Math.abs(d) < 0.6) { p.x = want; p.step = 0; return false; } const mv = Math.min(Math.abs(d), speed * dt); p.x += Math.sign(d) * mv; p.face = Math.sign(d); p.step += mv * 0.28; return true; };
  const liveSeaside = (h, dt) => {
    const { YH, SH, LX, T, DECK } = SEAL; const LY = T - 11; const xa = -ox; const xb = bw - ox; const lamp = lampAmt(h); const t = anim;
    // wave crests
    for (let y = YH + 2; y < SH - 1; y++) {
      if (y & 1) continue; const tt = (y - YH) / (SH - YH); const cnt = 3 + Math.round(tt * 4);
      for (let i = 0; i < cnt; i++) {
        const sp = (0.7 + tt * 4.5) * (hash2(y, i + 70) > 0.5 ? 1 : -1); const span = bw + 30;
        const x = Math.round((((hash2(y, i + 50) * span + t * sp) % span) + span) % span) + xa - 15; const len = 2 + Math.floor(tt * 4) + ((hash2(y, i + 9) * 3) | 0);
        if (Math.sin(t * 0.8 + hash2(y, i + 3) * 6.28) < -0.25) continue;
        for (let k2 = 0; k2 < len; k2++) { const xx = x + k2; if (isSeaMat(get(xx, y))) put(xx, y, k2 === 0 || k2 === len - 1 ? M.SEA_LT : M.SEA_HI); }
      }
    }
    // sun / moon glitter on the water
    const sp = sunPos(h); const mp = moonPos(h); const lit = sp && sp.y < YH - 3 ? { x: sp.x, m: M.LIT_HI } : mp && mp.y < YH - 3 ? { x: mp.x, m: M.STAR } : null;
    if (lit) for (let y = YH + 2; y < SH - 1; y++) { const tt = (y - YH) / (SH - YH); const spread = 1.5 + tt * 8; const n = 1 + Math.round(tt * 3); for (let i = 0; i < n; i++) { const r = hash2(y * 5 + i, Math.floor(t * 2.5 + i * 3)); const x = lit.x + Math.round((r - 0.5) * 2 * spread); if (r > 0.25 && isSeaMat(get(x, y))) { put(x, y, lit.m); if (r > 0.7 && isSeaMat(get(x + 1, y))) put(x + 1, y, lit.m); } } }
    // distant village lights
    drawWins(h, winFrac(h) * 1.1);
    for (const w of wins) if (w.tiny && w.seed < winFrac(h) * 1.1 && ((Math.floor(t * 1.5 + w.seed * 9) & 1) === 0)) put(w.x, YH + 1 + (w.seed > 0.5 ? 1 : 0), M.SEA_HI);
    // sailing boat
    const span = 330; const bx = Math.round((((t * 2.4 + 60) % span) + span) % span) - 70 + xa + 10; const by = YH + 5 + Math.round(Math.sin(t * 1.2));
    if (bx > xa - 14 && bx < xb + 14) {
      rect(bx, by, 9, 1, M.WOOD_DK); rect(bx + 1, by + 1, 7, 1, M.WOOD_DK); rect(bx + 1, by, 7, 1, M.WOOD_LT); line(bx + 4, by - 1, bx + 4, by - 11, M.WOOD_DK);
      for (let j = 0; j < 9; j++) { const w2 = Math.round(j * 0.45); for (let i = 1; i <= w2 + 1; i++) put(bx + 4 - i, by - 2 - j, M.CLOUD); }
      for (let j = 0; j < 6; j++) { const w2 = Math.round(j * 0.35); for (let i = 1; i <= w2 + 1; i++) put(bx + 5 + i - 1, by - 2 - j, j > 3 ? M.CLOUD : M.CLOUD_SH); }
      if (lamp > 0.1) { put(bx + 4, by - 12, M.LANTERN_HI); emit(bx + 4, by - 12, 110 * lamp, 2); put(bx + 4, by + 3, M.SEA_HI); }
    }
    // fisherman on the pier
    const away = h >= 22.6 || h < 7.4; const P = seaPerson;
    const moving = calm ? ((P.x = away ? -40 : 84), false) : walkTo(P, away ? -40 : 84, 14, dt);
    if (P.x > xa - 8) {
      if (moving) blit(SPR.walk[Math.floor(P.step) % 4], Math.round(P.x) - 3, DECK - 12, P.face < 0);
      else {
        P.nextBite -= calm ? 0 : dt; if (P.nextBite <= 0) { P.bite = 1.1; P.nextBite = 7 + hash2(Math.floor(t), 4) * 6; } P.bite = Math.max(0, P.bite - dt);
        const spr = P.bite > 0.5 ? SPR.seatUp : (!calm && Math.sin(t * 0.9) > 0.97 ? SPR.seatBlink : SPR.seat); const sx = 90; const sy = DECK - 9;
        blit(spr, sx, sy, true);
        const hx = sx + 6; const hy = sy + 5; const tipx = hx + 12; const tipy = hy - 8 + (P.bite > 0.5 ? 2 : 0);
        line(hx, hy, tipx, tipy, M.WOOD_LT);
        const bobY = DECK + 4 + Math.round(calm ? 0 : Math.sin(t * 1.6)) + (P.bite > 0 ? 1 : 0); const bobX = tipx + 7;
        for (let y = tipy; y < bobY; y++) if (((y - tipy) & 1) === 0 || y > bobY - 3) put(Math.round(mix(tipx, bobX, (y - tipy) / (bobY - tipy))), y, M.STAR_DIM);
        put(bobX, bobY, M.LANTERN_HI); put(bobX, bobY + 1, M.ROOF_LT);
        if (P.bite > 0.7 && P.bite < 1.0) { put(bobX - 1, bobY - 1, M.FOAM); put(bobX + 1, bobY - 2, M.FOAM); put(bobX + 2, bobY - 1, M.FOAM); }
      }
    }
    // pier lantern
    const pl = lamp > 0.05; rect(103, DECK - 11, 2, 2, pl ? M.LANTERN_HI : M.LANTERN); if (pl) { emit(103, DECK - 11, 150 * lamp, 2); emit(104, DECK - 10, 150 * lamp, 2); pool(104, DECK + 1, 12, 5, lamp * 0.7); }
    // lighthouse lamp + sweeping beam
    if (lamp > 0.02) {
      for (let j = 0; j < 8; j++) for (let i = 0; i < 9; i++) { const xx = LX - 4 + i; const mm = get(xx, T - 15 + j); if (mm === M.GLASS || mm === M.GLASS_HI) put(xx, T - 15 + j, j > 5 ? M.LIT : M.LIT_HI); }
      for (let j = 0; j < 8; j += 1) for (let i = 1; i < 8; i += 2) emit(LX - 4 + i, T - 15 + j, 230 * lamp, 0);
      const th = t * 0.55; const bx2 = Math.cos(th); const LYb = T - 11; const dir = bx2 >= 0 ? 1 : -1; const ab = Math.abs(bx2);
      if (ab > 0.1) { const len = 150 * ab; for (let d = 6; d < len; d += 1) { const hh = 0.8 + d * 0.05 * ab; const fade = (1 - d / len) * (0.5 + 0.5 * lamp); for (let dy = -Math.floor(hh); dy <= hh; dy++) { const x = LX + dir * d; const y = LYb + dy + Math.round(d * 0.02); if (dth(x, y, fade * 2.2 * (1 - Math.abs(dy) / (hh + 1.5)))) { const mm = get(x, y); if (mm === 0 || isSeaMat(mm) || mm === M.STAR || mm === M.STAR_DIM) put(x, y, d < len * 0.25 ? M.LIT_HI : M.LIT); } } } }
      if (ab < 0.45) { const f = 1 - ab / 0.45; disc(LX, LYb, 2 + Math.round(f * 2), M.LIT_HI); for (let k2 = 0; k2 < 18; k2++) { const a = k2 * 0.349; const r2 = 6 + f * 6; if (dth(Math.round(LX + Math.cos(a) * r2), Math.round(LYb + Math.sin(a) * r2), f)) putSky(Math.round(LX + Math.cos(a) * r2), Math.round(LYb + Math.sin(a) * r2), M.LIT); } }
      homeLight(LX, LYb, 20000 * lamp);
    }
    // surf at the shoreline
    const wash = 1.6 * Math.sin(t * 0.7) + 0.8 * Math.sin(t * 1.9 + 1);
    for (let x = xa; x < xb; x++) { if (x > 116 && get(x, SH - 1) === M.ROCK) continue; const sy2 = Math.round(SH + wash + Math.sin(x * 0.09 + t * 0.6) * 1.2); const m0 = get(x, sy2); if (m0 === M.WOOD_DK || m0 === M.ROCK || m0 === M.STONE || m0 === M.STONE_LT) continue; put(x, sy2, M.FOAM); if (((x + Math.floor(t * 2)) & 1) === 0) put(x, sy2 + 1, M.SEA_HI); put(x, sy2 + 2, M.PATH_DK); }
  };

  // ===== Scene: mountain cabin (snow, pines, chopping wood, aurora at night) =====
  const pineTree = (cx, base, h, tiers, snowy) => {
    rect(cx - 1, base - 7, 3, 7, M.BARK); put(cx - 1, base - 7, M.BARK_LT); put(cx - 1, base - 5, M.BARK_LT);
    const span = h - 6; const tierH = Math.round((span / tiers) * 1.9);
    for (let i = 0; i < tiers; i++) {
      const top = base - h + Math.round((i * span) / tiers); const maxW = 2 + Math.round(((i + 1) * h * 0.34) / tiers);
      for (let y = top; y < Math.min(top + tierH, base - 5); y++) {
        const t = (y - top) / tierH; const hw = Math.round(0.6 + t * (maxW - 0.6));
        for (let x = cx - hw; x <= cx + hw; x++) {
          const rel = (x - cx) / Math.max(hw, 1);
          if (t > 0.9 && ((x + i) & 1) && Math.abs(rel) < 0.85) continue;
          const v = 0.5 - rel * 0.45 + (bayerAt(x, y) / 16 - 0.5) * 0.36 + (noiseB(x * 0.5 + i, y * 0.4) - 0.5) * 0.3;
          let m = v > 0.72 ? M.LEAF2 : v > 0.4 ? M.LEAF1 : M.LEAF0;
          if (snowy) { const edge = hw - Math.abs(x - cx); if (edge < 1.6 && t < 0.85 && t > 0.05) m = rel < 0 ? M.SNOW : M.SNOW_SH; else if (t < 0.28 && edge < 3.4 && dth(x, y, 0.5)) m = rel < 0 ? M.SNOW : M.SNOW_SH; }
          put(x, y, m);
        }
      }
    }
  };
  const paintMountainCabin = () => {
    wins.length = 0; const xa = -ox; const xb = bw - ox; const yb = bh - oy;
    // ---- far range: left-lit rock faces, snow above the snow line ----
    const tent = (x, cx, hgt, s) => Math.max(0, hgt - Math.abs(x - cx) * s);
    const far = (x) => Math.round(70 - Math.max(tent(x, 40, 44, 1.0), tent(x, 156, 29, 0.92), tent(x, 96, 17, 0.9), tent(x, -6, 34, 1.0), tent(x, 214, 30, 0.95)) + (noiseB(x * 0.33, 2) - 0.5) * 5);
    for (let x = xa; x < xb; x++) {
      const top = far(x); const lit = far(x + 2) - far(x - 2) < 0;
      for (let y = top; y < 80; y++) {
        const snowLine = 52 + (noiseA(x * 0.09, 6) - 0.5) * 9 + (bayerAt(x, y) / 16 - 0.5) * 3.5; const streak = noiseB(x * 0.55, y * 0.12) > 0.68;
        let m; if (y < snowLine) m = lit ? M.SNOW : M.SNOW_SH; else m = lit ? (streak ? M.HILL_NEAR : M.HILL_FAR) : (streak ? M.ROCK : M.HILL_NEAR);
        put(x, y, m);
      }
    }
    // ---- forested foothills ----
    const hill = (x) => Math.round(64 + noiseA(x * 0.035 + 11, 4) * 10 - 2 * Math.sin(x * 0.05));
    for (let x = xa; x < xb; x++) { const top = hill(x); for (let y = top; y < 84; y++) { const d = y - top; put(x, y, d < 1 ? M.LEAF0 : dth(x, y, 0.4 - d * 0.03) ? M.SNOW_SH : (noiseB(x * 0.6, y * 0.7) > 0.55 ? M.TREE_FAR : M.LEAF0)); } }
    for (let x = xa + 2; x < xb; x += 3 + ((hash2(x, 5) * 3) | 0)) { const top = hill(x); const hh = 4 + ((hash2(x, 7) * 4) | 0); for (let j = 0; j < hh; j++) { const hw = Math.floor(j / 3) + (j > 0 ? 0 : 0); for (let i = -hw; i <= hw; i++) put(x + i, top - hh + j + 1, (i < 0 && j % 3 === 0) ? M.SNOW_SH : M.LEAF0); } }
    // ---- snow field with soft dune shading ----
    for (let y = 78; y < yb; y++) for (let x = xa; x < xb; x++) {
      const n = noiseA(x * 0.045 + 3, y * 0.16 + 1) + (noiseB(x * 0.3, y * 0.5) - 0.5) * 0.2 + (bayerAt(x, y) / 16 - 0.5) * 0.16;
      const dune = Math.sin(x * 0.07 + y * 0.18) * 0.12;
      put(x, y, n + dune > 0.72 ? M.SNOW_SH : (y < 81 && dth(x, y, 0.5)) ? M.SNOW_SH : M.SNOW);
    }
    for (let i = 0; i < 40; i++) { const x = xa + ((hash2(i, 31) * bw) | 0); const y = 84 + ((hash2(i, 32) * (yb - 84)) | 0); put(x, y, M.SNOW_SH); put(x + 1, y, M.SNOW_SH); }
    // ---- mid pines ----
    pineTree(52, 86, 34, 5, true); pineTree(62, 83, 24, 4, true); pineTree(138, 84, 26, 4, true); pineTree(122, 82, 18, 3, true);
    // ---- cabin (front gable) ----
    const CX = 90; const AP = 36; const EY = 62; const SLOPE = 0.76;
    // external stone chimney on the right wall
    for (let y = 33; y < 88; y++) for (let x = 116; x < 124; x++) { const k2 = ((x + (((y >> 1) & 1) * 2)) % 4) < 2; put(x, y, x > 120 ? M.STONE : k2 ? M.STONE_LT : M.STONE); if (y % 2 === 0 && x === 116) put(x, y, M.STONE); }
    rect(115, 31, 10, 3, M.STONE_LT); rect(115, 33, 10, 1, M.STONE); rect(118, 29, 4, 2, M.ROCK);
    // gable wall (vertical planks), main log wall
    for (let y = AP; y < EY; y++) { const hw = (y - AP) / SLOPE; for (let x = Math.round(CX - hw); x <= Math.round(CX + hw); x++) put(x, y, (x % 4 === 0) ? M.WOOD_DK : (x % 4 === 1 ? M.WOOD_LT : M.WOOD)); }
    for (let y = EY; y < 88; y++) for (let x = 66; x < 115; x++) { const row = (y - EY) % 4; let m = row === 0 ? M.WOOD_LT : row === 3 ? M.WOOD_DK : M.WOOD; if (x > 109 && dth(x, y, 0.5)) m = row === 0 ? M.WOOD : M.WOOD_DK; put(x, y, m); }
    for (let y = EY; y < 88; y += 4) { for (const cx2 of [66, 67, 112, 113]) { put(cx2, y, M.WOOD_LT); put(cx2, y + 1, M.BARK); } }
    rect(64, 87, 52, 3, M.STONE); for (let x = 64; x < 116; x += 6) put(x, 87, M.STONE_LT); rect(64, 89, 52, 1, M.ROCK);
    // attic round window
    disc(CX, 50, 3, M.WOOD_DK); disc(CX, 50, 2, M.GLASS); put(CX - 1, 49, M.GLASS_HI);
    // roof rakes with thick snow on top (snow overhang gets a blue underside)
    for (let y = AP - 3; y < EY + 4; y++) {
      const hw = (y - AP) / SLOPE; const l = Math.round(CX - hw); const r = Math.round(CX + hw);
      for (let i = 0; i < 3; i++) { put(l - i + (y >= EY ? 0 : 0), y, M.WOOD_DK); put(r + i, y, M.WOOD_DK); }
      for (let i = 3; i < 7; i++) { const mL = i === 6 ? M.SNOW_SH : (i === 3 && y > AP + 8 ? M.SNOW_SH : M.SNOW); put(l - i + 2, y - 1, mL); put(r + i - 2, y - 1, i === 6 || i === 3 ? M.SNOW_SH : M.SNOW); }
    }
    for (let x = 56; x <= 124; x++) { if ((x * 5) % 7 < 4) put(x, EY + 4, M.SNOW); }
    rect(57, EY + 3, 68, 1, M.WOOD_DK); rect(CX - 3, AP - 4, 7, 4, M.SNOW); put(CX - 1, AP - 5, M.SNOW); put(CX, AP - 5, M.SNOW);
    // porch canopy and posts
    rect(77, 69, 26, 3, M.WOOD_DK); rect(76, 66, 28, 3, M.SNOW); rect(78, 68, 24, 1, M.SNOW_SH); rect(79, 72, 2, 16, M.WOOD_DK); rect(99, 72, 2, 16, M.WOOD_DK);
    // door
    rect(84, 73, 12, 15, M.WOOD_DK); rect(85, 74, 10, 14, M.WOOD); for (let x = 87; x < 95; x += 3) rect(x, 74, 1, 14, M.WOOD_DK); rect(85, 74, 10, 4, M.GLASS); rect(89, 74, 1, 4, M.WOOD_DK); put(93, 81, M.LANTERN_HI);
    addWin(85, 74, 4, 4, { always: true }); addWin(90, 74, 5, 4, { always: true });
    // side windows with shutters + flower boxes
    const winAt = (x0) => { rect(x0 - 2, 71, 14, 13, M.WOOD_DK); rect(x0, 73, 10, 9, M.GLASS); rect(x0, 73, 10, 1, M.GLASS_HI); put(x0 + 1, 74, M.GLASS_HI); rect(x0 + 4, 73, 2, 9, M.WOOD_DK); rect(x0 - 3, 72, 2, 11, M.WOOD); rect(x0 + 11, 72, 2, 11, M.WOOD); rect(x0 - 1, 84, 12, 2, M.WOOD_DK); for (let x = x0; x < x0 + 10; x += 2) { put(x, 83, M.SNOW); } addWin(x0, 73, 10, 9, { always: true, mull: 1 }); };
    winAt(68); winAt(102);
    // lantern on the porch
    rect(81, 74, 1, 2, M.WOOD_DK); rect(80, 76, 3, 4, M.LANTERN); rect(80, 76, 3, 1, M.WOOD_DK); rect(80, 80, 3, 1, M.WOOD_DK);
    // steps
    rect(81, 88, 18, 2, M.STONE_LT); rect(79, 90, 22, 2, M.STONE); rect(78, 92, 24, 1, M.ROCK);
    // snow drifts against the cabin
    for (let x = 62; x < 120; x++) { const dr = 90 + Math.round(Math.sin(x * 0.3) * 1.2); put(x, dr, M.SNOW); if (x % 3 === 0) put(x, dr + 1, M.SNOW_SH); }
    // ---- woodpile, chopping block, footprints ----
    rect(150, 86, 24, 3, M.SNOW_SH);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) { const x = 151 + c * 3 + (r & 1); const y = 77 + r * 3; if (x > 172) continue; rect(x, y, 3, 3, M.WOOD); put(x + 1, y + 1, (c + r) % 2 ? M.WOOD_LT : M.BARK_LT); put(x, y, M.WOOD_DK); put(x + 2, y + 2, M.WOOD_DK); }
    rect(149, 74, 26, 3, M.SNOW); rect(150, 77, 24, 1, M.SNOW_SH); put(149, 77, M.SNOW_SH); put(174, 77, M.SNOW_SH);
    rect(140, 82, 8, 6, M.WOOD); rect(140, 82, 8, 2, M.WOOD_LT); put(141, 83, M.WOOD); put(144, 83, M.WOOD_DK); rect(147, 83, 1, 5, M.WOOD_DK); rect(139, 81, 10, 1, M.SNOW); rect(140, 88, 8, 1, M.SNOW_SH);
    for (let i = 0; i < 12; i++) { const x = 98 + i * 3 + (i & 1) * 2; const y = 95 + (i % 3 === 1 ? 1 : 0) - Math.floor(i / 6); put(x, y, M.SNOW_DK); put(x + 1, y + (i & 1), M.SNOW_DK); }
    // ---- foreground pines ----
    pineTree(24, 100, 66, 7, true); pineTree(179, 98, 58, 7, true); pineTree(196, 104, 40, 5, true);
    const rr = seeded(77); for (let i = 0; i < 14; i++) { const x = xa + ((rr() * bw) | 0); const y = 100 + ((rr() * (yb - 100)) | 0); rect(x, y, 3, 1, M.SNOW_SH); }
  };
  const cabinP = { x: 132, inside: false, door: 0, face: 1, step: 0, cycle: 0, split: -1 };
  const liveCabin = (h, dt) => {
    const t = anim; const lamp = lampAmt(h); const xa = -ox; const xb = bw - ox; const P = cabinP;
    // aurora curtains
    const an = nightF(h);
    if (an > 0.5) {
      const amp = smoothstep(0.5, 0.95, an);
      for (let x = xa; x < xb; x++) {
        const base = 27 + Math.sin(x * 0.045 + t * 0.22) * 7 + Math.sin(x * 0.11 - t * 0.35) * 3; const len = 17 + 11 * Math.sin(x * 0.03 + t * 0.13 + 1.3) + noiseB(x * 0.15, t * 0.25) * 10;
        const ray = 0.55 + 0.45 * Math.sin(x * 1.6 + noiseA(x * 0.2, t * 0.2) * 6);
        for (let y = Math.floor(base - len); y <= base; y++) { const f = (y - (base - len)) / len; const pr = amp * Math.pow(f, 1.4) * 1.7 * ray; if (dth(x, y, pr)) putSky(x, y, f > 0.86 ? M.AUR_HI : f > 0.45 ? M.AUR_MID : M.AUR_LO); }
      }
    }
    // chimney smoke
    if (!calm) { fx.t += dt * 3.2; while (fx.t >= 1) { fx.t -= 1; fx.smoke.push({ x: 119 + Math.random() * 2, y: 28, t: 0, seed: Math.random() * 10 }); } }
    for (let i = fx.smoke.length - 1; i >= 0; i--) { const s = fx.smoke[i]; s.t += dt; s.y -= dt * (6.5 - s.t * 0.7); s.x += dt * (2.4 + Math.sin(s.t * 1.7 + s.seed) * 2.4); if (s.t > 4.6 || s.y < -4) { fx.smoke.splice(i, 1); continue; } const size = 1 + Math.floor(s.t * 0.75); for (let dy = 0; dy < size; dy++) for (let dx = 0; dx < size; dx++) { const x = Math.round(s.x) + dx; const y = Math.round(s.y) + dy; if (bayerAt(x, y) < 16 - s.t * 2.9) put(x, y, s.t > 2.4 ? M.SMOKE_DK : M.SMOKE); } }
    if (calm) for (let i = 0; i < 5; i++) rect(119 + i * 2, 24 - i * 4, 1 + (i >> 1), 2, M.SMOKE);
    // windows, lantern, light on the snow
    drawWins(h, 0, 1.3);
    if (lamp > 0.05) { rect(80, 76, 3, 4, M.LANTERN_HI); for (let y = 77; y < 79; y++) for (let x = 80; x < 83; x++) emit(x, y, 200 * lamp, 0); pool(90, 92, 30, 7, lamp * 0.95); pool(73, 88, 10, 6, lamp * 0.6); pool(107, 88, 10, 6, lamp * 0.6); pool(81, 82, 8, 6, lamp * 0.7); homeLight(90, 78, 16000 * lamp); }
    // daytime shadows on the snow (cabin + pines), opposite the sun
    const sp = sunPos(h);
    if (sp && sp.y < 70 && h > 6.4 && h < 17.4) {
      const off = clamp((96 - sp.x) / 80, -1.3, 1.3); const sh = (cx, base, rx, ry) => { for (let y = base - ry; y <= base + ry; y++) for (let x = Math.floor(cx - rx); x <= cx + rx; x++) { if ((((x - cx) / rx) ** 2 + ((y - base) / ry) ** 2) > 1) continue; if (get(x, y) === M.SNOW) put(x, y, M.SNOW_SH); } };
      sh(24 + off * 30, 101, 30, 3); sh(179 + off * 24, 99, 26, 3); sh(52 + off * 16, 87, 14, 2); sh(90 + off * 22, 92, 36, 3);
    }
    // the woodcutter
    const outdoors = h >= 8.4 && h < 17.6; const wantX = outdoors ? 132 : 90;
    if (calm) { P.inside = !outdoors; P.x = wantX; }
    else {
      P.door = Math.max(0, P.door - dt);
      if (P.inside && outdoors) { P.inside = false; P.x = 90; P.door = 0.5; }
      if (!P.inside) { const d = wantX - P.x; if (Math.abs(d) > 0.6) { const mv = Math.min(Math.abs(d), 16 * dt); P.x += Math.sign(d) * mv; P.face = Math.sign(d); P.step += mv * 0.28; } else { P.x = wantX; P.step = 0; if (!outdoors) { P.inside = true; P.door = 0.5; } } }
    }
    if (P.door > 0) { rect(85, 74, 10, 14, M.SIL); rect(85, 74, 2, 14, M.WOOD_LT); }
    if (!P.inside) {
      const base = 88; const x0 = Math.round(P.x) - 3; const moving = Math.abs(wantX - P.x) > 0.6;
      if (moving) blit(SPR.walk[Math.floor(P.step) % 4], x0, base - 12, P.face < 0);
      else if (outdoors) {
        P.cycle = calm ? 1.2 : (P.cycle + dt) % 4.4; const c = P.cycle; const bx = 140; const by = 82;
        let spr = SPR.stand; let axe = 0;
        if (c > 2.5 && c < 2.95) { spr = SPR.up; axe = 1; } else if (c >= 2.95 && c < 3.25) { spr = SPR.crouch; axe = 2; } else if (c >= 3.25 && c < 3.6) { spr = SPR.stand; axe = 3; } else if (!calm && Math.sin(t * 0.9) > 0.93) spr = SPR.blink;
        blit(spr, x0, base - 12, false);
        if (axe === 1) { rect(x0 + 3, base - 18, 1, 6, M.WOOD_DK); rect(x0 + 3, base - 19, 3, 2, M.STONE_LT); }
        else if (axe === 2) { line(x0 + 6, base - 7, x0 + 10, base - 5, M.WOOD_DK); rect(x0 + 10, base - 7, 2, 3, M.STONE_LT); }
        else if (axe === 3) { rect(x0 + 7, base - 9, 1, 6, M.WOOD_DK); }
        const sp2 = c > 2.95 && c < 3.9 ? (c - 2.95) : -1;
        if (sp2 < 0) { rect(bx + 1, by - 3, 6, 3, M.WOOD_LT); rect(bx + 1, by - 3, 6, 1, M.WOOD); put(bx + 2, by - 2, M.WOOD_DK); }
        else { const e = Math.min(1, sp2 / 0.9); rect(bx + 1 - Math.round(e * 3), by - 3 + Math.round(e * e * 5), 3, 3, M.WOOD); rect(bx + 4 + Math.round(e * 3), by - 3 + Math.round(e * e * 5), 3, 3, M.WOOD_LT); if (sp2 < 0.25) { put(bx - 1, by - 5, M.SNOW); put(bx + 8, by - 6, M.SNOW); put(bx + 3, by - 7, M.SNOW); } }
      }
    }
  };

  // ===== Scene: Japanese street (machiya, konbini, ramen shop, utility poles, Fuji) =====
  const STR = { GY: 82, P1: 69, P2: 171 };
  const paintJapaneseStreet = () => {
    wins.length = 0; const { GY, P1, P2 } = STR; const xa = -ox; const xb = bw - ox; const yb = bh - oy;
    // ---- far layer: low hills, Mt. Fuji, far town ----
    const fuji = (x) => Math.round(34 + Math.max(0, Math.abs(x - 150) - 5) * 0.5 + (noiseB(x * 0.3, 3) - 0.5) * 1.2);
    for (let x = xa; x < xb; x++) { const top = fuji(x); if (top < 72) for (let y = top; y < 76; y++) { const sn = y < top + 8 + (noiseA(x * 0.25, 1) * 4) - (x > 150 ? 2 : 0); put(x, y, sn ? (x <= 150 ? M.SNOW : M.SNOW_SH) : (x <= 150 ? M.HILL_FAR : M.HILL_NEAR)); } }
    for (let x = xa; x < xb; x++) { const top = Math.round(60 + noiseA(x * 0.04 + 5, 2) * 7); for (let y = top; y < 76; y++) put(x, y, dth(x, y, 0.3) && y > top ? M.HILL_FAR : M.HILL_NEAR); }
    for (let x = xa; x < xb; x += 5 + ((hash2(x, 2) * 5) | 0)) { const w = 4 + ((hash2(x, 3) * 4) | 0); const hh = 4 + ((hash2(x, 4) * 8) | 0); rect(x, 70 - hh, w, hh + 6, M.CONCRETE_SH); if (hash2(x, 6) < 0.55) addWin(x + 1, 72 - hh, 1, 1, { tiny: true }); }
    // ---- A: machiya (left) ----
    const AX0 = 6; const AX1 = 58;
    rect(AX0, 40, AX1 - AX0, GY - 40, M.PLASTER); rect(AX1 - 4, 40, 4, GY - 40, M.PLASTER_SH);
    for (let y = 41; y < 58; y++) for (let x = AX0; x < AX1; x++) if (y < 44 && dth(x, y, (44 - y) * 0.3)) put(x, y, M.PLASTER_SH);
    // lattice windows on the second floor
    for (const wx of [12, 38]) { rect(wx - 1, 44, 17, 13, M.WOOD_DK); rect(wx, 45, 15, 11, M.GLASS_SKY); rect(wx, 45, 15, 1, M.GLASS_SKY_HI); for (let x = wx + 1; x < wx + 15; x += 2) rect(x, 45, 1, 11, M.WOOD_LT); rect(wx, 50, 15, 1, M.WOOD_DK); addWin(wx, 45, 15, 11, {}); }
    rect(AX0 - 1, 57, AX1 - AX0 + 2, 2, M.WOOD_DK);
    // hip roof (kawara) with ridge and end ornaments
    for (let y = 26; y < 41; y++) {
      const r0 = y - 26; const l = Math.round(15 - r0 * 0.9); const r = Math.round(49 + r0 * 0.9);
      for (let x = l; x <= r; x++) { const even = r0 % 2 === 0; let m = even ? M.ROOF_LT : M.ROOF; if (even && (x + ((r0 >> 1) & 1) * 2) % 4 === 0) m = M.ROOF; if (even && x - l < 6 + r0 && dth(x, y, 0.45)) m = M.ROOF_HI; put(x, y, m); }
    }
    rect(14, 25, 36, 1, M.ROOF_HI); rect(12, 23, 3, 3, M.ROOF_LT); rect(49, 23, 3, 3, M.ROOF_LT); put(13, 22, M.ROOF_HI); put(50, 22, M.ROOF_HI); rect(2, 41, 60, 1, M.WOOD_DK);
    // lower eave
    for (let y = 59; y < 63; y++) { const r0 = y - 59; for (let x = AX0 - 3 - r0; x < AX1 + 3 + r0; x++) put(x, y, r0 === 3 ? M.ROOF : (r0 % 2 === 0 ? M.ROOF_LT : M.ROOF)); } rect(AX0 - 6, 63, AX1 - AX0 + 12, 1, M.WOOD_DK);
    // ground floor: wooden lattice, sliding door, noren, lantern
    rect(AX0, 64, AX1 - AX0, GY - 64, M.WOOD); for (let x = AX0; x < AX1; x += 3) rect(x, 64, 1, GY - 64, M.WOOD_LT); for (let y = 64; y < GY; y += 9) rect(AX0, y, AX1 - AX0, 1, M.WOOD_DK);
    rect(20, 66, 24, 16, M.WOOD_DK); rect(21, 67, 22, 15, M.GLASS_SKY); for (let x = 21; x < 43; x += 5) rect(x, 67, 1, 15, M.WOOD_DK); rect(21, 74, 22, 1, M.WOOD_DK); addWin(21, 67, 22, 7, { mull: 1 });
    rect(19, 63, 26, 2, M.WOOD_DK); for (let x = 21; x < 43; x += 6) { rect(x, 65, 5, 9, M.NOREN); rect(x + 1, 67, 3, 1, M.CLOUD); rect(x + 2, 66, 1, 4, M.CLOUD); }
    rect(11, 66, 1, 4, M.WOOD_DK); rect(8, 70, 7, 8, M.LANTERN); rect(8, 70, 7, 1, M.WOOD_DK); rect(8, 77, 7, 1, M.WOOD_DK); rect(10, 72, 3, 3, M.LANTERN_HI);
    rect(AX1 - 12, 74, 8, 8, M.BRICK); rect(AX1 - 13, 73, 10, 1, M.BRICK_LT); for (let i = 0; i < 4; i++) { put(AX1 - 11 + i * 2, 72, M.LEAF2); put(AX1 - 12 + i * 2, 71, M.LEAF1); }
    // ---- B: narrow alley with vending machines ----
    rect(58, 30, 20, GY - 30, M.ASPHALT_DK); for (let y = 30; y < GY; y++) for (let x = 58; x < 78; x++) if (dth(x, y, 0.1 + (y - 30) * 0.006)) put(x, y, M.CONCRETE_SH);
    const vend = (x0) => { rect(x0, 62, 8, 20, M.CONCRETE_SH); rect(x0 + 1, 63, 6, 11, M.GLASS); for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) put(x0 + 1 + c * 2, 64 + r * 3, [M.LANTERN, M.SOFA_LT, M.CLOUD, M.BOOK_DK][(r + c * 2) % 4]); rect(x0 + 1, 76, 6, 2, M.ROOF); rect(x0 + 2, 79, 4, 2, M.WOOD_DK); };
    vend(60); vend(69);
    // ---- C: modern apartment + konbini ----
    const CX0 = 78; const CX1 = 124; const CT = 20;
    rect(CX0, CT, CX1 - CX0, GY - CT, M.CONCRETE); rect(CX1 - 4, CT, 4, GY - CT, M.CONCRETE_SH);
    rect(CX0 - 1, CT - 2, CX1 - CX0 + 2, 3, M.CONCRETE_SH); rect(CX0 - 1, CT - 2, CX1 - CX0 + 2, 1, M.PLASTER);
    for (const fy of [28, 44, 60]) { rect(CX0, fy, CX1 - CX0, 1, M.CONCRETE_SH); rect(CX0, fy + 1, CX1 - CX0, 1, M.PLASTER); }
    for (const fy of [31, 47]) for (const wx of [82, 97, 112]) {
      rect(wx - 1, fy, 12, 9, M.CONCRETE_SH); rect(wx, fy + 1, 10, 7, M.GLASS_SKY); rect(wx, fy + 1, 10, 1, M.GLASS_SKY_HI); rect(wx + 4, fy + 1, 1, 7, M.CONCRETE_SH); addWin(wx, fy + 1, 10, 7, { mull: 1 });
      rect(wx - 2, fy + 9, 14, 1, M.WOOD_DK); for (let x = wx - 2; x < wx + 12; x += 2) put(x, fy + 8, M.WOOD_DK);
      if (hash2(wx, fy) < 0.55) { rect(wx + 1, fy + 5, 1, 4, M.CLOUD); rect(wx + 3, fy + 4, 1, 5, M.LANTERN); rect(wx + 5, fy + 5, 1, 4, M.SOFA_LT); put(wx, fy + 4, M.WOOD_DK); rect(wx, fy + 4, 7, 1, M.WOOD_DK); }
    }
    rect(CX0 + 3, 52, 6, 3, M.CONCRETE_SH); rect(CX0 + 3, 52, 6, 1, M.PLASTER);
    // roof-top water tank + antenna
    rect(104, 11, 10, 9, M.CONCRETE_SH); rect(103, 10, 12, 2, M.CONCRETE); rect(106, 18, 1, 2, M.WOOD_DK); rect(111, 18, 1, 2, M.WOOD_DK); line(88, CT - 3, 88, 8, M.WOOD_DK); rect(85, 11, 7, 1, M.WOOD_DK); rect(86, 14, 5, 1, M.WOOD_DK);
    // konbini storefront
    rect(CX0 + 2, 62, CX1 - CX0 - 4, 20, M.CONCRETE_SH); rect(CX0 + 4, 66, 34, 15, M.GLASS_SKY); rect(CX0 + 4, 66, 34, 1, M.GLASS_SKY_HI);
    for (let x = CX0 + 6; x < CX0 + 36; x += 5) { rect(x, 71, 4, 1, M.WOOD_LT); rect(x, 75, 4, 1, M.WOOD_LT); put(x + 1, 69, M.LANTERN); put(x + 2, 73, M.SOFA_LT); put(x, 77, M.CLOUD); }
    rect(CX0 + 22, 66, 1, 15, M.CONCRETE_SH); rect(CX0 + 4, 80, 34, 1, M.CONCRETE_SH);
    rect(CX0 + 2, 61, CX1 - CX0 - 4, 5, M.LANTERN); rect(CX0 + 2, 61, CX1 - CX0 - 4, 1, M.WOOD_DK); for (let x = CX0 + 5; x < CX1 - 7; x += 4) { rect(x, 62, 2, 3, M.NOREN); put(x + 2, 63, M.CLOUD); }
    addWin(CX0 + 4, 67, 34, 14, { always: true, mull: 1 });
    rect(CX0 + 42, 66, 2, 14, M.WOOD_DK); rect(CX0 + 40, 74, 6, 6, M.LANTERN); // standing shop sign
    // ---- D: ramen-ya (right) ----
    const DX0 = 126; const DX1 = xb;
    rect(DX0, 30, 56, 14, M.PLASTER); rect(DX0 + 52, 30, 4, 14, M.PLASTER_SH);
    rect(DX0 + 6, 33, 14, 9, M.WOOD_DK); rect(DX0 + 7, 34, 12, 7, M.GLASS_SKY); rect(DX0 + 13, 34, 1, 7, M.WOOD_DK); addWin(DX0 + 7, 34, 12, 7, { mull: 1 });
    rect(DX0 + 36, 33, 14, 9, M.WOOD_DK); rect(DX0 + 37, 34, 12, 7, M.GLASS_SKY); rect(DX0 + 43, 34, 1, 7, M.WOOD_DK); addWin(DX0 + 37, 34, 12, 7, { mull: 1 });
    for (let y = 22; y < 31; y++) { const r0 = y - 22; for (let x = DX0 - 3 + r0 * 1; x < DX0 + 59 - r0; x++) { const even = r0 % 2 === 0; let m = even ? M.ROOF_LT : M.ROOF; if (even && (x + ((r0 >> 1) & 1) * 2) % 4 === 0) m = M.ROOF; put(x, y, m); } }
    rect(DX0 + 6, 21, 44, 1, M.ROOF_HI);
    rect(DX0 - 4, 44, 66, 8, M.ROOF); for (let x = DX0 - 4; x < DX0 + 62; x += 4) { put(x, 45, M.ROOF_LT); put(x + 2, 47, M.ROOF_LT); put(x, 49, M.ROOF_LT); } rect(DX0 - 4, 52, 66, 1, M.WOOD_DK);
    rect(DX0, 53, 56, GY - 53, M.WOOD); rect(DX0 + 52, 53, 4, GY - 53, M.WOOD_DK); for (let x = DX0; x < DX0 + 56; x += 4) rect(x, 53, 1, GY - 53, M.WOOD_LT);
    rect(DX0 + 22, 56, 20, 26, M.WOOD_DK); rect(DX0 + 23, 57, 18, 25, M.GLASS_SKY); rect(DX0 + 32, 57, 1, 25, M.WOOD_DK); rect(DX0 + 23, 66, 18, 1, M.WOOD_DK); addWin(DX0 + 23, 57, 18, 9, { mull: 1 });
    rect(DX0 + 4, 58, 14, 14, M.WOOD_DK); rect(DX0 + 5, 59, 12, 12, M.GLASS_SKY); rect(DX0 + 5, 59, 12, 1, M.GLASS_SKY_HI); addWin(DX0 + 5, 59, 12, 12, { mull: 1 }); rect(DX0 + 4, 72, 14, 2, M.WOOD_DK);
    rect(DX0 + 20, 53, 24, 3, M.NOREN); for (let x = DX0 + 22; x < DX0 + 43; x += 6) { rect(x, 56, 5, 9, M.NOREN); rect(x + 2, 58, 1, 5, M.CLOUD); rect(x + 1, 60, 3, 1, M.CLOUD); }
    rect(DX0 + 45, 62, 6, 12, M.WOOD_DK); rect(DX0 + 46, 63, 4, 10, M.LANTERN); put(DX0 + 47, 65, M.NOREN); put(DX0 + 48, 67, M.NOREN); put(DX0 + 47, 69, M.NOREN);
    rect(DX0 - 2, 56, 1, 4, M.WOOD_DK); rect(DX0 - 5, 60, 7, 9, M.LANTERN); rect(DX0 - 5, 60, 7, 1, M.WOOD_DK); rect(DX0 - 5, 68, 7, 1, M.WOOD_DK); rect(DX0 - 3, 62, 3, 4, M.LANTERN_HI); put(DX0 - 2, 63, M.NOREN);
    rect(DX0 + 40, 20, 3, 3, M.CONCRETE_SH); rect(DX0 + 39, 19, 5, 1, M.CONCRETE);
    // ---- ground: sidewalk, curb, road ----
    for (let y = GY; y < yb; y++) for (let x = xa; x < xb; x++) {
      let m;
      if (y < GY + 7) { m = ((x + (y & 1) * 3) % 6 === 0 && y !== GY) ? M.STONE : (y === GY ? M.STONE : M.STONE_LT); if (y > GY + 1 && dth(x, y, 0.1)) m = M.STONE; }
      else if (y < GY + 9) m = y === GY + 7 ? M.STONE_LT : M.STONE;
      else { const n = noiseA(x * 0.05 + 2, y * 0.3) + noiseB(x * 0.35, y * 0.5) * 0.3; m = M.ASPHALT; if (n > 0.95 && dth(x, y, 0.6)) m = M.ASPHALT_LT; else if (n < 0.35 && dth(x, y, 0.4)) m = M.ASPHALT_DK; }
      put(x, y, m);
    }
    for (let x = xa; x < xb; x += 24) rect(x, 101, 12, 1, M.LINE); for (let x = xa + 4; x < xb; x += 24) rect(x, 102, 8, 1, M.LINE);
    disc(146, 103, 4, M.ASPHALT_DK); disc(146, 103, 3, M.ASPHALT_LT); for (let x = 143; x < 150; x += 2) put(x, 103, M.ASPHALT_DK); rect(144, 102, 5, 1, M.ASPHALT_DK);
    for (let x = 156; x < 188; x += 7) { rect(x, 92, 4, 1, M.LINE); rect(x, 94, 4, 1, M.LINE); }
    for (let i = 0; i < 6; i++) { const x = xa + ((hash2(i, 41) * bw) | 0); const y = 106 + ((hash2(i, 42) * 8) | 0); rect(x, y, 8, 2, M.ASPHALT_LT); rect(x + 1, y + 2, 6, 1, M.ASPHALT_DK); }
    rect(30, 107, 14, 1, M.LINE); rect(30, 109, 14, 1, M.LINE); rect(76, 108, 14, 1, M.LINE); rect(76, 110, 14, 1, M.LINE);
    // parked kei van
    { const x0 = 90; const y0 = 91;
      rect(x0 + 1, y0 + 13, 31, 1, M.ASPHALT_DK);
      rect(x0 + 2, y0 + 3, 29, 8, M.WALL); rect(x0 + 27, y0 + 3, 4, 8, M.WALL_SH); rect(x0 + 5, y0, 22, 4, M.WALL); rect(x0 + 5, y0, 22, 1, M.PLASTER);
      rect(x0 + 6, y0 + 1, 8, 3, M.GLASS_SKY); put(x0 + 6, y0 + 1, M.GLASS_SKY_HI); put(x0 + 7, y0 + 1, M.GLASS_SKY_HI); rect(x0 + 16, y0 + 1, 9, 3, M.GLASS_SKY); rect(x0 + 15, y0 + 1, 1, 3, M.WALL_SH);
      rect(x0 + 2, y0 + 8, 29, 1, M.BAND); rect(x0 + 2, y0 + 10, 29, 1, M.WALL_SH); rect(x0, y0 + 9, 3, 2, M.STONE); put(x0 + 2, y0 + 5, M.LANTERN); put(x0 + 2, y0 + 6, M.LANTERN); put(x0 + 30, y0 + 5, M.BRICK_LT);
      for (const wx of [x0 + 8, x0 + 24]) { disc(wx, y0 + 11, 3, M.ROOF); disc(wx, y0 + 11, 1, M.STONE_LT); }
      rect(x0 + 18, y0 + 4, 1, 5, M.WALL_SH); put(x0 + 17, y0 + 6, M.STONE_LT); }
    // ---- utility poles + street lamp ----
    for (const px0 of [P1, P2]) {
      rect(px0, 10, 2, GY + 6 - 10, M.WOOD_DK); rect(px0, 10, 1, GY + 6 - 10, M.WOOD); rect(px0 - 7, 14, 16, 2, M.WOOD_DK); rect(px0 - 5, 21, 12, 2, M.WOOD_DK);
      for (const dx of [-6, -2, 3, 7]) { put(px0 + dx, 13, M.STONE_LT); } for (const dx of [-4, 5]) put(px0 + dx, 20, M.STONE_LT);
      rect(px0 + 2, 28, 5, 8, M.CONCRETE_SH); rect(px0 + 2, 28, 5, 1, M.CONCRETE); rect(px0 + 2, 36, 5, 1, M.WOOD_DK);
      for (let y = 44; y < GY; y += 7) rect(px0 - 1, y, 4, 1, M.WOOD_LT);
    }
    rect(P2 - 12, 31, 12, 1, M.WOOD_DK); rect(P2 - 15, 32, 5, 2, M.CONCRETE_SH); rect(P2 - 14, 34, 3, 1, M.LANTERN);
    const wire = (xs, ys, xe, ye, sag) => { for (let x = xs; x <= xe; x++) { const u = (x - xs) / (xe - xs); put(x, Math.round(mix(ys, ye, u) + sag * 4 * u * (1 - u)), M.NOREN); } };
    for (const [dx0, y0] of [[-6, 13], [-2, 13], [3, 13], [7, 13], [-4, 20], [5, 20]]) { wire(xa, y0 + 1, P1 + dx0, y0, 3); wire(P1 + dx0, y0, P2 + dx0, y0, 7); wire(P2 + dx0, y0, xb, y0 + 2, 3); }
    // ---- potted plants, signboard, bicycle ----
    rect(100, 78, 6, 4, M.BRICK); rect(99, 77, 8, 1, M.BRICK_LT); put(101, 75, M.LEAF2); put(103, 74, M.LEAF3); put(104, 76, M.LEAF2); put(102, 76, M.LEAF1);
    for (const bx of [53, 82]) { /* bike wheels */ }
    const bike = (bx) => { for (const wx of [bx, bx + 11]) for (let a = 0; a < 16; a++) put(Math.round(wx + 3.5 * Math.cos(a * 0.3927)), Math.round(GY + 4 + 3.5 * Math.sin(a * 0.3927)), M.ROOF); line(bx, GY + 4, bx + 5, GY - 1, M.WOOD_DK); line(bx + 5, GY - 1, bx + 11, GY + 4, M.WOOD_DK); line(bx + 5, GY - 1, bx + 4, GY + 4, M.WOOD_DK); line(bx + 4, GY + 4, bx, GY + 4, M.WOOD_DK); rect(bx + 4, GY - 3, 3, 1, M.WOOD_DK); rect(bx + 10, GY - 3, 3, 1, M.WOOD_DK); line(bx + 11, GY + 4, bx + 10, GY - 3, M.WOOD_DK); rect(bx + 11, GY - 1, 4, 3, M.ROOF_LT); };
    bike(4);
  };
  const catSit = makeSprite(['C.C...', 'CCCC..', 'CCCCC.', '.CCCCC', '.CCCCC', '.CC.CC']);
  const catSleep = makeSprite(['......', '......', '.CCCC.', 'CCCCCC', 'CCCCCC']);
  const walkerP = { x: 24, face: 1, step: 0, wait: 2.5, goal: 150 };
  const liveStreet = (h, dt) => {
    const { GY, P1, P2 } = STR; const t = anim; const lamp = lampAmt(h); const xa = -ox; const xb = bw - ox;
    // windows light up one by one; shop windows (always) follow the lamp curve
    drawWins(h, winFrac(h), 0.9);
    // ramen steam
    if (!calm) { fx.t += dt * (lamp > 0.3 ? 3 : 1.2); while (fx.t >= 1) { fx.t -= 1; fx.smoke.push({ x: 167 + Math.random() * 2, y: 18, t: 0, seed: Math.random() * 10 }); } }
    for (let i = fx.smoke.length - 1; i >= 0; i--) { const s = fx.smoke[i]; s.t += dt; s.y -= dt * (6 - s.t); s.x += dt * (1.6 + Math.sin(s.t * 1.9 + s.seed) * 2.2); if (s.t > 4.2 || s.y < -4) { fx.smoke.splice(i, 1); continue; } const size = 1 + Math.floor(s.t * 0.8); for (let dy = 0; dy < size; dy++) for (let dx = 0; dx < size; dx++) { const x = Math.round(s.x) + dx; const y = Math.round(s.y) + dy; if (bayerAt(x, y) < 15 - s.t * 3) put(x, y, s.t > 2.3 ? M.SMOKE_DK : M.SMOKE); } }
    // street lamp, lanterns and light pools
    const lampOn = lamp > 0.05;
    if (lampOn) {
      rect(P2 - 14, 34, 3, 1, M.LANTERN_HI); emit(P2 - 13, 34, 190 * lamp, 2); pool(P2 - 13, 92, 20, 8, lamp * 0.8);
      pool(100, 90, 34, 9, lamp * 0.95); pool(100, 80, 26, 12, lamp * 0.5); pool(30, 84, 24, 9, lamp * 0.7); pool(160, 88, 26, 9, lamp * 0.8); pool(70, 86, 10, 8, lamp * 0.6);
      for (const [lx, ly, lw, lh] of [[8, 70, 7, 8], [121, 60, 7, 9], [171, 62, 6, 12]]) for (let j = 1; j < lh - 1; j++) for (let i = 1; i < lw - 1; i += 2) emit(lx + i, ly + j, 130 * lamp, 2);
      homeLight(100, 74, 26000 * lamp);
    }
    // vending machines glow
    if (lampOn) for (const vx of [60, 69]) { rect(vx + 1, 63, 6, 11, M.LIT); for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) put(vx + 1 + c * 2, 64 + r * 3, [M.LANTERN_HI, M.LIT_HI, M.CLOUD, M.LIT_DK][(r + c * 2) % 4]); for (let j = 0; j < 11; j += 2) emit(vx + 3, 63 + j, 90 * lamp, 2); }
    // cat on the curb (sleeps at night)
    const asleep = h >= 22.5 || h < 6.5; const cx0 = 112; const cy0 = GY - 1;
    if (asleep) blit(catSleep, cx0, cy0 - 4); else { blit(catSit, cx0, cy0 - 5); const tail = calm ? 0 : Math.round(Math.sin(t * 2.4)); put(cx0 + 6, cy0 - 1 + tail, M.CAT); put(cx0 + 7, cy0 - 2 + tail, M.CAT_DK); }
    // passer-by
    const W = walkerP; const away = h >= 23.4 || h < 6.4;
    if (calm) { W.x = 40; }
    else if (!away) {
      if (W.wait > 0) { W.wait -= dt; W.step = 0; }
      else { const d = W.goal - W.x; if (Math.abs(d) < 0.8) { W.wait = 1.8 + Math.random() * 2.5; W.goal = [18, 46, 96, 122, 150, 184][(Math.random() * 6) | 0]; } else { const mv = Math.min(Math.abs(d), 12 * dt); W.x += Math.sign(d) * mv; W.face = Math.sign(d); W.step += mv * 0.28; } }
    }
    if (!away || calm) { const moving = !calm && W.wait <= 0; blit(moving ? SPR.walk[Math.floor(W.step) % 4] : (!calm && Math.sin(t * 0.8) > 0.93 ? SPR.blink : SPR.stand), Math.round(W.x) - 3, GY + 4 - 12, W.face < 0); }
  };

  // ===== Scene: apartment (city window, sofa, cat on the bench, lamps) =====
  const APT = { FL: 80, WX0: 17, WX1: 73, WY0: 12, WY1: 61 };
  const roomLamp = (h) => (h >= 12 ? smoothstep(17.6, 19.2, h) * (1 - smoothstep(23.2, 23.5, h)) : smoothstep(5.2, 5.6, h) * (1 - smoothstep(6.8, 7.4, h)));
  const catBench = makeSprite(['..C.C...', '.CCCCC..', 'CCCCCCC.', 'CCCCCCCC', 'QQQQQQQQ']);
  const catBenchB = makeSprite(['..C.C...', '.CCCCC..', 'CCCCCCC.', 'CCCCCCCC', 'CQQQQQQC']);
  const paintApartment = () => {
    wins.length = 0; const { FL, WX0, WX1, WY0, WY1 } = APT; const xa = -ox; const xb = bw - ox; const yb = bh - oy;
    // ---- walls: soft vertical stripes, shadow under the ceiling, wainscot ----
    for (let y = -oy; y < FL; y++) for (let x = xa; x < xb; x++) {
      let m = M.WALL; if ((x + 3) % 12 === 0) m = M.WALL_SH; if (y < 6 && dth(x, y, (6 - y) * 0.16)) m = M.WALL_SH; if (y > 66 && y < FL - 2) m = M.PLASTER; if (y === 66) m = M.WALL_SH; if (y > 66 && (x + 3) % 12 === 0) m = M.PLASTER_SH; put(x, y, m);
    }
    for (let x = xa; x < xb; x++) { put(x, FL - 2, M.WOOD_LT); put(x, FL - 1, M.WOOD_DK); }
    // ---- floor planks (pale oak: tan by day, amber at golden hour) ----
    for (let y = FL; y < yb; y++) for (let x = xa; x < xb; x++) {
      const row = Math.floor((y - FL) / 5); const seam = (y - FL) % 5 === 0; const vs = (x + Math.floor((((Math.sin(row * 12.9898) * 43758.5453) % 1) + 1) % 1 * 38)) % 38 === 0;
      let m = M.PLANK; if (seam || vs) m = M.PATH_DK; else if (((x * 3 + row * 11) % 19) < 2) m = M.SAND_LT; else if (y < FL + 4 && dth(x, y, 0.5)) m = M.PATH_DK; put(x, y, m);
    }
    // ---- window: sky shows through the glass; skyline layers on top ----
    rect(WX0 - 3, WY0 - 3, WX1 - WX0 + 6, WY1 - WY0 + 6, M.WOOD_DK); rect(WX0, WY0, WX1 - WX0, WY1 - WY0, 0);
    for (let x = WX0; x < WX1; x += 4 + ((hash2(x, 21) * 4) | 0)) { const w = 4 + ((hash2(x, 22) * 4) | 0); const hh = 7 + ((hash2(x, 23) * 12) | 0); rect(x, WY1 - hh, Math.min(w, WX1 - x), hh, M.HILL_FAR); }
    for (let x = WX0 + 1; x < WX1; ) { const w = 7 + ((hash2(x, 24) * 5) | 0); const hh = 12 + ((hash2(x, 25) * 17) | 0); const ww = Math.min(w, WX1 - x); rect(x, WY1 - hh, ww, hh, M.CONCRETE_SH); rect(x, WY1 - hh, ww, 1, M.CONCRETE); for (let wy = WY1 - hh + 3; wy < WY1 - 2; wy += 4) for (let wx = x + 2; wx < x + ww - 1; wx += 3) { put(wx, wy, M.GLASS); if (hash2(wx * 3, wy * 5) < 0.75) addWin(wx, wy, 1, 1, { tiny: true }); } x += ww + 1; }
    for (let y = 20; y < WY1; y++) { put(63, y, M.HILL_NEAR); if (y % 6 === 0 && y > 26) { rect(63 - Math.floor((y - 20) / 6), y, 1 + 2 * Math.floor((y - 20) / 6) + 1, 1, M.HILL_NEAR); } }
    rect(WX0 + 17, WY0, 2, WY1 - WY0, M.WOOD_DK); rect(WX0 + 37, WY0, 2, WY1 - WY0, M.WOOD_DK); rect(WX0, WY0 + 20, WX1 - WX0, 2, M.WOOD_DK); rect(WX0, WY0, WX1 - WX0, 1, M.WOOD_LT);
    rect(WX0 - 5, WY1 + 2, WX1 - WX0 + 10, 3, M.WOOD_LT); rect(WX0 - 5, WY1 + 5, WX1 - WX0 + 10, 1, M.WOOD_DK);
    // curtains with folds and tie-backs
    for (const cx of [5, 76]) { for (let y = 8; y < 68; y++) for (let x = cx; x < cx + 8; x++) put(x, y, (x - cx) % 3 === 1 ? M.SHIRT_DK : M.SHIRT); rect(cx, 44, 8, 2, M.STONE_LT); rect(cx - 1, 7, 10, 2, M.WOOD_DK); for (let x = cx; x < cx + 8; x += 2) put(x, 67, M.SHIRT_DK); }
    // window bench + cushions
    rect(16, 70, 62, 3, M.WOOD_LT); rect(16, 73, 62, 8, M.WOOD); rect(16, 73, 62, 1, M.WOOD_DK); rect(16, 80, 62, 1, M.WOOD_DK); for (const dx of [22, 44, 66]) { rect(dx, 75, 8, 4, M.WOOD_DK); rect(dx + 3, 76, 2, 1, M.WOOD_LT); } rect(18, 81, 3, 4, M.WOOD_DK); rect(73, 81, 3, 4, M.WOOD_DK);
    rect(20, 65, 12, 5, M.SOFA_LT); rect(20, 65, 12, 1, M.SOFA); rect(21, 66, 10, 1, M.SOFA_LT); rect(22, 69, 8, 1, M.SOFA_DK);
    rect(62, 64, 12, 6, M.SOFA); rect(62, 64, 12, 1, M.SOFA_LT); rect(62, 69, 12, 1, M.SOFA_DK);
    paintBush(41, 62, 4, 3, 1202); rect(37, 66, 9, 4, M.BRICK); rect(36, 65, 11, 1, M.BRICK_LT);
    // ---- plant between window and sofa ----
    paintBush(91, 64, 7, 9, 1201); rect(86, 76, 11, 9, M.BRICK); rect(85, 75, 13, 2, M.BRICK_LT); rect(86, 84, 11, 1, M.WOOD_DK); line(91, 76, 91, 68, M.STEM);
    // ---- pendant, frames, clock, shelf ----
    rect(130, -oy, 1, 16 + oy, M.WOOD_DK); for (let y = 16; y < 23; y++) { const hw = 2 + Math.round((y - 16) * 0.9); for (let x = 130 - hw; x <= 130 + hw; x++) put(x, y, y === 16 ? M.WOOD_DK : M.LANTERN); } rect(128, 22, 5, 1, M.WOOD_DK);
    rect(106, 22, 17, 15, M.WOOD_DK); rect(108, 24, 13, 11, M.CLOUD_SH); for (let y = 0; y < 6; y++) for (let x = -y; x <= y; x++) put(114 + x, 28 + y, y < 2 ? M.SNOW : M.HILL_FAR); rect(108, 31, 13, 4, M.HILL_NEAR); disc(118, 26, 1, M.LANTERN); put(114, 28, M.SNOW);
    rect(137, 28, 11, 9, M.WOOD_DK); rect(139, 30, 7, 5, M.CLOUD); rect(140, 33, 5, 2, M.LEAF1); put(142, 31, M.LEAF2);
    disc(158, 28, 6, M.WOOD_DK); disc(158, 28, 5, M.WALL); put(158, 24, M.WOOD_DK); put(158, 32, M.WOOD_DK); put(154, 28, M.WOOD_DK); put(162, 28, M.WOOD_DK); line(158, 28, 158, 25, M.WOOD_DK); line(158, 28, 161, 29, M.WOOD_DK);
    rect(104, 44, 58, 2, M.WOOD_DK); rect(104, 43, 58, 1, M.WOOD_LT);
    for (let x = 108; x < 124; x += 3) { const hh = 6 + ((hash2(x, 71) * 4) | 0); rect(x, 43 - hh, 2, hh, [M.BOOK, M.BOOK_DK, M.LEAF1, M.WOOD_LT, M.ROOF_LT][(x / 3) % 5 | 0]); }
    rect(138, 36, 7, 7, M.BRICK); rect(137, 35, 9, 1, M.BRICK_LT); paintBush(141, 33, 4, 3, 1203);
    rect(150, 38, 8, 5, M.BOOK_DK); rect(151, 39, 6, 1, M.BOOK);
    // ---- sofa ----
    rect(103, 54, 68, 16, M.SOFA); rect(103, 54, 68, 1, M.SOFA_LT); rect(103, 55, 68, 1, M.SOFA_LT); for (let x = 103; x < 171; x += 11) rect(x, 56, 1, 13, M.SOFA_DK);
    rect(103, 69, 68, 12, M.SOFA_LT); rect(103, 69, 68, 1, M.SOFA); rect(103, 79, 68, 2, M.SOFA_DK); for (let x = 103; x < 171; x += 22) rect(x + 22, 70, 1, 9, M.SOFA);
    rect(97, 58, 9, 24, M.SOFA); rect(97, 58, 9, 2, M.SOFA_LT); rect(98, 58, 1, 22, M.SOFA_LT); rect(97, 80, 9, 2, M.SOFA_DK); rect(168, 58, 9, 24, M.SOFA); rect(168, 58, 9, 2, M.SOFA_LT); rect(168, 80, 9, 2, M.SOFA_DK); rect(175, 60, 2, 22, M.SOFA_DK);
    rect(100, 82, 2, 3, M.WOOD_DK); rect(172, 82, 2, 3, M.WOOD_DK);
    rect(108, 58, 12, 11, M.SHIRT); rect(108, 58, 12, 1, M.SHIRT); rect(108, 68, 12, 1, M.SHIRT_DK); put(109, 59, M.LANTERN_HI); put(114, 63, M.SHIRT_DK); put(113, 62, M.SHIRT_DK);
    rect(151, 58, 12, 11, M.CLOUD_SH); rect(151, 58, 12, 1, M.CLOUD); rect(151, 68, 12, 1, M.U2 !== undefined ? M.STAR_DIM : M.CLOUD_SH); for (let y = 60; y < 68; y += 3) rect(152, y, 10, 1, M.STAR_DIM);
    // ---- rug and coffee table ----
    for (let y = 87; y < 109; y++) { const t = (y - 87) / 21; const l = Math.round(98 - t * 6); const r = Math.round(180 + t * 6); for (let x = l; x <= r; x++) { const edge = x < l + 2 || x > r - 2 || y < 89 || y > 106; put(x, y, edge ? M.RUG_LT : (((x + y) % 8 === 0) || ((x - y + 400) % 8 === 0)) ? M.RUG_LT : M.RUG); } }
    for (let x = 102; x < 176; x += 4) { put(x, 87, M.RUG); put(x, 108, M.RUG); }
    rect(110, 93, 44, 4, M.WOOD_LT); rect(110, 97, 44, 1, M.WOOD_DK); rect(113, 98, 3, 8, M.WOOD_DK); rect(148, 98, 3, 8, M.WOOD_DK); rect(112, 108, 40, 1, M.RUG);
    rect(137, 90, 10, 2, M.BOOK_DK); rect(138, 88, 8, 2, M.BOOK); rect(139, 87, 6, 1, M.BOOK_DK); put(121, 91, M.CLOUD); rect(120, 91, 4, 2, M.CLOUD); put(124, 92, M.CLOUD); rect(120, 92, 4, 1, M.CLOUD_SH);
    // ---- floor lamp ----
    rect(186, 46, 2, 40, M.WOOD_DK); rect(182, 84, 10, 2, M.WOOD_DK); for (let y = 36; y < 46; y++) { const hw = 3 + Math.round((y - 36) * 0.5); for (let x = 187 - hw; x <= 187 + hw; x++) put(x, y, M.LANTERN); } rect(183, 36, 8, 1, M.WOOD_DK); rect(182, 45, 10, 1, M.WOOD_DK);
    // ---- baseboard heater + wall socket + small details ----
    rect(180, 66, 2, 2, M.WOOD_DK);
  };
  const aptP = { blink: 2, stretch: 0, tc: 0, mug: [], ac: 3 };
  const liveApartment = (h, dt) => {
    const { FL, WX0, WX1, WY0, WY1 } = APT; const t = anim; const room = roomLamp(h); const night = nightF(h); const xa = -ox; const xb = bw - ox;
    // window: lit city windows, tower beacon, a plane
    drawWins(h, clamp(winFrac(h) * 1.25 + (night > 0.5 ? 0.2 : 0)));
    if (night > 0.35) { const blink = calm ? true : Math.sin(t * 2.2) > 0; if (blink) { put(63, 19, M.LANTERN_HI); emit(63, 19, 150, 2); } else put(63, 19, M.LANTERN); const px0 = Math.round(WX0 + ((t * 4) % 120) - 20); if (!calm && px0 > WX0 && px0 < WX1 - 1 && Math.floor(t * 3) % 2 === 0) { put(px0, WY0 + 8, M.LIT_HI); } }
    // sunbeam from the window across the floor
    const sp = sunPos(h);
    if (sp && sp.y < 62 && h > 6.8 && h < 17.4) {
      const skew = (sp.x - 96) * 0.55; const k0 = clamp(1 - sp.y / 62, 0.35, 1);
      for (let y = FL + 2; y < 112; y++) { const u = (y - FL) / 30; for (let x = Math.round(WX0 + 4 + skew * u); x < Math.round(WX1 - 4 + skew * u); x++) { if (x < 12) continue; const m = get(x, y); if ((m === M.PLANK || m === M.SAND_LT || m === M.PATH_DK) && dth(x, y, 0.8 * k0 * (1 - u * 0.35))) put(x, y, M.WALL); } }
    }
    // lamps
    const floorLamp = room; const pend = room * (h >= 12 || h < 7 ? 1 : 0);
    if (floorLamp > 0.05) {
      for (let y = 37; y < 45; y++) { const hw = 3 + Math.round((y - 36) * 0.5); for (let x = 187 - hw + 1; x <= 187 + hw - 1; x++) put(x, y, y < 40 ? M.LANTERN_HI : M.LANTERN); }
      for (let y = 37; y < 45; y += 2) for (let x = 183; x < 192; x += 2) emit(x, y, 210 * floorLamp, 0);
      pool(187, 60, 21, 20, floorLamp * 0.75); pool(182, 90, 20, 8, floorLamp * 0.6); homeLight(187, 42, 14000 * floorLamp);
    }
    if (pend > 0.05) { for (let y = 17; y < 23; y++) { const hw = 2 + Math.round((y - 16) * 0.9); for (let x = 130 - hw + 1; x <= 130 + hw - 1; x++) put(x, y, M.LANTERN_HI); } for (let y = 17; y < 22; y += 2) for (let x = 127; x < 134; x += 2) emit(x, y, 190 * pend, 0); pool(130, 24, 26, 17, pend * 0.65); pool(132, 92, 24, 9, pend * 0.7); homeLight(130, 20, 11000 * pend); }
    // cat on the window bench (breathes; sleeps through the night)
    const cb = calm ? false : Math.sin(t * 1.3) > 0.2; blit(cb ? catBenchB : catBench, 46, 65); if (!calm && Math.sin(t * 0.5) > 0.55) put(54, 66 + (Math.sin(t * 3) > 0 ? 1 : 0), M.CAT_DK);
    if (night > 0.2 || (h > 9 && h < 14)) { /* zzz */ }
    // mug steam
    if (!calm) { aptP.tc += dt * 2.2; while (aptP.tc >= 1) { aptP.tc -= 1; aptP.mug.push({ x: 122 + Math.random() * 1.5, y: 90, t: 0, seed: Math.random() * 7 }); } }
    for (let i = aptP.mug.length - 1; i >= 0; i--) { const s = aptP.mug[i]; s.t += dt; s.y -= dt * 4.5; s.x += Math.sin(s.t * 3 + s.seed) * dt * 3; if (s.t > 1.7) { aptP.mug.splice(i, 1); continue; } if (bayerAt(Math.round(s.x), Math.round(s.y)) < 15 - s.t * 7) put(Math.round(s.x), Math.round(s.y), M.SMOKE); }
    // reader on the sofa (away while asleep)
    const present = !(h >= 23.4 || h < 6.4);
    if (present) {
      aptP.blink -= calm ? 0 : dt; const c = calm ? 0 : (t % 6.2) / 6.2; let spr = SPR.bust;
      if (c > 0.16 && c < 0.24) spr = SPR.bustHalf; else if (c >= 0.24 && c < 0.46) spr = SPR.bustUp; else if (c >= 0.46 && c < 0.54) spr = SPR.bustHalf; else if (!calm && Math.sin(t * 0.7) > 0.93) spr = SPR.bustBlink;
      blit(spr, 131, 49); rect(122, 57, 26, 12, M.SHIRT_DK); rect(122, 57, 26, 1, M.SHIRT); for (let x = 124; x < 146; x += 5) put(x, 62, M.SHIRT); rect(131, 57 + (spr === SPR.bustUp ? 2 : 0), 8, 5, M.BOOK); rect(135, 57 + (spr === SPR.bustUp ? 2 : 0), 1, 5, M.BOOK_DK);
      if (room > 0.3 && spr !== SPR.bustUp) { for (let x = 132; x < 139; x += 2) emit(x, 59, 40 * room, 2); }
    }
  };

  const scenePlugins = typeof window !== 'undefined' ? window.PixelDaylightSwitchScenePlugins : null;
  const pluginScene = scenePlugins && typeof scenePlugins.getScene === 'function' ? scenePlugins.getScene(dataset.scene) : null;
  const builtInScene = ['countryside', 'japanese-street', 'apartment', 'seaside', 'mountain-cabin'].includes(dataset.scene);
  const scene = builtInScene ? dataset.scene : (pluginScene ? dataset.scene : 'countryside');
  const LIVE = { seaside: liveSeaside, 'mountain-cabin': liveCabin, 'japanese-street': liveStreet, apartment: liveApartment };
  const drawSceneLive = (h, dt) => { const fn = LIVE[scene]; if (fn) fn(h, dt); };
  const parsePluginColor = (value) => {
    const hex = value.slice(1);
    const full = hex.length === 3 ? hex.split('').map((v) => v + v).join('') : hex;
    return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)];
  };
  const pluginPaletteRgb = pluginScene ? Object.fromEntries(Object.entries(pluginScene.palettes).map(([name, palette]) => {
    const colors = new Array(128);
    Object.keys(palette).forEach((symbol) => { colors[symbol.charCodeAt(0)] = parsePluginColor(palette[symbol]); });
    return [name, colors];
  })) : null;
  let pluginAnimClock = 0;
  const renderPluginWorld = (hour) => {
    const stops = pluginScene.timeCycle;
    let left = stops[0]; let right = stops[stops.length - 1]; let sampleHour = hour;
    if (hour < stops[0].at) sampleHour += 24;
    for (let i = 0; i < stops.length - 1; i++) {
      const a = stops[i]; const b = stops[i + 1];
      if (sampleHour >= a.at && sampleHour <= b.at) { left = a; right = b; break; }
    }
    if (sampleHour > stops[stops.length - 1].at) { left = stops[stops.length - 1]; right = stops[0]; right = { at: right.at + 24, palette: right.palette }; }
    const span = Math.max(0.0001, right.at - left.at);
    const t = clamp((sampleHour - left.at) / span);
    const aPalette = pluginPaletteRgb[left.palette];
    const bPalette = pluginPaletteRgb[right.palette];
    const width = pluginScene.canvas.width; const height = pluginScene.canvas.height;
    let scenePixels = pluginScene.pixels;
    if (pluginScene.schemaVersion === 2 && Array.isArray(pluginScene.layers)) {
      const composed = pluginScene.pixels.map(row => row.split(''));
      for (const layer of pluginScene.layers) {
        const asset = pluginScene.assets[layer.asset];
        const motion = layer.animation;
        let dx = 0, dy = 0;
        if (motion) {
          const offset = Math.sin(pluginAnimClock * motion.speed + (motion.phase || 0)) * motion.distance;
          if (motion.type === 'drift' && motion.axis === 'x') dx = Math.round(offset);
          else if (motion.type === 'drift' && motion.axis === 'y') dy = Math.round(offset);
          else if (motion.type === 'bob' && motion.axis === 'x') dx = Math.round(offset);
          else if (motion.type === 'bob' && motion.axis === 'y') dy = Math.round(offset);
        }
        const originX = layer.x + dx, originY = layer.y + dy;
        for (let sy = 0; sy < asset.height; sy++) {
          const targetY = originY + sy;
          if (targetY < 0 || targetY >= height) continue;
          const row = asset.pixels[sy];
          for (let sx = 0; sx < asset.width; sx++) {
            const targetX = originX + sx;
            if (targetX < 0 || targetX >= width) continue;
            const symbol = row[sx];
            if (symbol !== '.') composed[targetY][targetX] = symbol;
          }
        }
      }
      scenePixels = composed.map(row => row.join(''));
    }
    const scale = Math.min(bw / width, bh / height);
    const drawW = Math.max(1, Math.round(width * scale)); const drawH = Math.max(1, Math.round(height * scale));
    const offsetX = Math.floor((bw - drawW) / 2); const offsetY = Math.floor((bh - drawH) / 2);
    const background = scenePixels[0].charCodeAt(0);
    for (let py = 0; py < bh; py++) {
      const insideY = py >= offsetY && py < offsetY + drawH;
      const sy = insideY ? clamp(Math.floor(((py - offsetY) / drawH) * height), 0, height - 1) : 0;
      const row = scenePixels[sy];
      for (let px = 0; px < bw; px++) {
        const inside = insideY && px >= offsetX && px < offsetX + drawW;
        const sx = inside ? clamp(Math.floor(((px - offsetX) / drawW) * width), 0, width - 1) : 0;
        const symbol = inside ? row.charCodeAt(sx) : background;
        const ca = aPalette[symbol]; const cb = bPalette[symbol];
        const r = Math.round(mix(ca[0], cb[0], t));
        const g = Math.round(mix(ca[1], cb[1], t));
        const b = Math.round(mix(ca[2], cb[2], t));
        pixels[py * bw + px] = (255 << 24) | (b << 16) | (g << 8) | r;
      }
    }
  };


  const buildBase = () => {
    if (pluginScene) { matBuf.fill(0); baseBuf.set(matBuf); skyKeys = []; return; }
    matBuf.fill(0); if (scene === 'countryside') { paintGround(); paintFence(); paintBush(22, 78, 16, 8, 61); paintBush(176, 80, 14, 7, 62); paintBush(-6, 81, 11, 6, 63); paintBush(204, 81, 10, 5, 64); paintTrunk(); paintHouse(); paintFlowers(96, 126, 85, 92, 26, 91); paintFlowers(14, 38, 86, 96, 16, 92); paintFlowers(150, 205, 90, 106, 24, 93); paintFlowers(-14, 14, 88, 104, 12, 95); paintFlowers(40, 62, 90, 104, 12, 94); buildCanopy(); } else { canopy = []; if (scene === 'japanese-street') paintJapaneseStreet(); else if (scene === 'apartment') paintApartment(); else if (scene === 'seaside') paintSeaside(); else paintMountainCabin(); } baseBuf.set(matBuf);
    const r = seeded(808); stars = [];
    for (let i = 0; i < 95; i++) { stars.push({ x: Math.floor(r() * (CORE_W + 40)) - 20, y: Math.floor(r() * 66), seed: r(), big: r() < 0.14 }); }
    skyKeys = KEYS.map(([, , stops]) => { const sky = new Uint8Array(bw * bh); const n = stops.length - 1; for (let py = 0; py < bh; py++) { const pos = clamp((py - oy) / HORIZON) * n; const a = Math.min(Math.floor(pos), n); const b = Math.min(a + 1, n); const f = smoothstep(0.3, 0.7, pos - a) * 4; for (let px = 0; px < bw; px++) { const cell = ((py & 1) << 1) | (px & 1); sky[py * bw + px] = f > [0, 2, 3, 1][cell] ? stops[b] : stops[a]; } } return sky; });
  };
  const res = { x: 73, inside: false, face: 1, step: 0, doorOpen: 0, startle: 0, hop: 0, blink: 0, nextBlink: 2, page: 0, nextPage: 4, pageT: 0, hurry: 0 };
  const clouds = [
    { x: 8, y: 13, w: 30, h: 9, seed: 1, speed: 0.55 },
    { x: 88, y: 24, w: 22, h: 7, seed: 2, speed: 0.8 },
    { x: 150, y: 9, w: 34, h: 10, seed: 3, speed: 0.42 },
    { x: 214, y: 30, w: 18, h: 5, seed: 4, speed: 1.05 },
  ].map((cloud) => { const r = seeded(cloud.seed * 977); const blobs = Array.from({ length: 6 }, (_, i) => [cloud.w * ((i + 0.5) / 6) + (r() - 0.5) * 3, cloud.h * (0.45 + (r() - 0.5) * 0.35), cloud.h * (0.3 + r() * 0.32)]); const list = []; for (let y = 0; y < cloud.h + 3; y++) { for (let x = -2; x < cloud.w + 3; x++) { let inside = false; for (const [bx, by, br] of blobs) if (Math.hypot(x - bx, (y - by) * 1.25) < br) inside = true; if (!inside) continue; list.push(x, y, y > cloud.h * 0.62 ? 1 : 0); } } return { ...cloud, list }; });
  const smoke = []; const zees = []; const leaves = []; const birds = { t: -1, next: 8, y: 20, dir: 1 }; const shoot = { t: -1, next: 14 };
  const flies = Array.from({ length: 8 }, (_, i) => ({ seed: i * 7.3 + 1, x: 150 + (i - 3) * 9, y: 88 + (i % 3) * 6 })); const butterfly = { x: 108, y: 84 };
  const snowflakes = Array.from({ length: 34 }, (_, i) => { const r = seeded(9100 + i); return { x: r() * CORE_W, y: r() * CORE_H, speed: 8 + r() * 12, drift: (r() - 0.5) * 5, phase: r() * Math.PI * 2 }; });
  let anim = 0; let smokeAcc = 0; let zeeAcc = 0; let lampFlick = 1; let windowL = 0; let lanternL = 0; let shutter = 0;
  const hourOf = (clock) => ((clock % 24) + 24) % 24;
  const planFor = (h) => { if (h >= 9.6 && h < 11) return { outside: true, x: 104, act: 'tend' }; if (h >= 11 && h < 16.2) return { outside: true, x: 131, act: 'read' }; if (h >= 16.2 && h < 17.2) return { outside: true, x: 88, act: 'stroll' }; return { outside: false, x: 73, act: 'in' }; };
  const stepResident = (dt, h, speedHint) => {
    const plan = planFor(h); const want = plan.outside ? plan.x : 73;
    if (calm) { res.inside = !plan.outside; res.x = want; return plan; }
    res.startle = Math.max(0, res.startle - dt); res.hop = res.startle > 0.55 ? Math.sin(((0.9 - res.startle) / 0.35) * Math.PI) * 3 : 0; res.doorOpen = Math.max(0, res.doorOpen - dt);
    if (res.startle > 0) return plan;
    if (res.inside && plan.outside) { res.inside = false; res.x = 73; res.doorOpen = 0.5; }
    if (!res.inside) { const delta = want - res.x; if (Math.abs(delta) > 0.5) { const speed = 17 + clamp(speedHint, 0, 1) * 72 + (Math.abs(delta) > 34 ? 8 : 0); const move = Math.min(Math.abs(delta), speed * dt); res.x += Math.sign(delta) * move; res.face = Math.sign(delta); res.step += move * 0.28; res.hurry = speedHint; } else { res.x = want; res.step = 0; if (!plan.outside) { res.inside = true; res.doorOpen = 0.45; } } }
    res.nextBlink -= dt; if (res.nextBlink <= 0) { res.blink = 0.13; res.nextBlink = 1.8 + Math.random() * 3.4; } res.blink = Math.max(0, res.blink - dt);
    res.nextPage -= dt; if (res.nextPage <= 0) { res.pageT = 0.42; res.nextPage = 3.6 + Math.random() * 3.2; } res.pageT = Math.max(0, res.pageT - dt);
    return plan;
  };
  const drawSky = (h) => {
    const dark = smoothstep(18.2, 20.2, h) + (1 - smoothstep(4.6, 6.2, h)); const night = clamp(dark);
    if (night > 0.02) { for (const s of stars) { if (s.seed > night * 1.05) continue; const twinkle = calm ? 1 : Math.sin(anim * (1.3 + s.seed * 4.4) + s.seed * 40); if (twinkle < -0.72) continue; const m = twinkle < 0.1 && !s.big ? M.STAR_DIM : M.STAR; putSky(s.x, s.y, m); if (s.big && twinkle > 0.55) { putSky(s.x - 1, s.y, M.STAR_DIM); putSky(s.x + 1, s.y, M.STAR_DIM); putSky(s.x, s.y - 1, M.STAR_DIM); putSky(s.x, s.y + 1, M.STAR_DIM); } } if (!calm && night > 0.9) { if (shoot.t >= 0) { const f = shoot.t / 0.55; for (let i = 0; i < 7; i++) { const u = f * 42 - i * 2; if (u > 0 && u < 42) putSky(Math.round(shoot.x + u), Math.round(shoot.y + u * 0.45), i < 2 ? M.STAR : M.STAR_DIM); } } } }
    if (h > 5.2 && h < 19) { const a = ((h - 6) / 12) * Math.PI; const sx = Math.round(96 - Math.cos(a) * 102); const sy = Math.round(HORIZON - 2 - Math.sin(a) * 70); const low = 1 - clamp(Math.sin(a) * 1.6); const R = 5 + Math.round(low * 2); for (let dy = -R - 5; dy <= R + 5; dy++) { for (let dx = -R - 5; dx <= R + 5; dx++) { const d = Math.hypot(dx, dy); const x = sx + dx; const y = sy + dy; if (d <= R - 1) { putSky(x, y, M.SUN); emit(x, y, 26 + low * 90, 1); } else if (d <= R) { putSky(x, y, M.SUN_RIM); } else if (d <= R + 4 && bayerAt(x, y) < (R + 4.6 - d) * 2.2) { putSky(x, y, M.SUN_RIM); } } } }
    const mh = h >= 17.6 ? h : h + 24;
    if (mh > 17.6 && mh < 30.4) { const a = ((mh - 18) / 12) * Math.PI; const mx = Math.round(96 - Math.cos(a) * 102); const my = Math.round(HORIZON - 2 - Math.sin(a) * 66); const R = 6; for (let dy = -R - 3; dy <= R + 3; dy++) { for (let dx = -R - 3; dx <= R + 3; dx++) { const d = Math.hypot(dx, dy); const x = mx + dx; const y = my + dy; if (d <= R) { const crater = (dx === -2 && dy === -2) || (dx === 2 && dy === 1) || (dx === -3 && dy === 2) || (dx === 1 && dy === -3) || (dx === 3 && dy === -1) || (dx === -1 && dy === 3); const shaded = dx * 0.7 + dy * 0.7 > R * 0.45; putSky(x, y, crater || shaded ? M.MOON_DK : M.MOON); emit(x, y, 12, 1); } else if (d <= R + 3 && bayerAt(x, y) < (R + 3.4 - d) * 1.6) { putSky(x, y, M.STAR_DIM); } } } }
    for (const cloud of clouds) { const span = CORE_W + 96; const cx = ((cloud.x + (calm ? 0 : anim * cloud.speed) + 48) % span) - 48; const x0 = Math.round(cx); for (let i = 0; i < cloud.list.length; i += 3) { const x = x0 + cloud.list[i]; const y = cloud.y + cloud.list[i + 1]; const under = cloud.list[i + 2]; if (under && bayerAt(x, y) > 11) continue; putSky(x, y, under ? M.CLOUD_SH : M.CLOUD); } }
    if (!calm && h > 7 && h < 18.5 && birds.t >= 0) { const flap = Math.floor(anim * 7) % 2; for (let i = 0; i < 4; i++) { const x = Math.round((birds.dir > 0 ? -12 + birds.t * 26 : CORE_W + 12 - birds.t * 26) - birds.dir * i * 6); const y = birds.y + (i % 2) * 3 + i; putSky(x, y, M.BIRD); putSky(x - 1, y - flap, M.BIRD); putSky(x + 1, y - flap, M.BIRD); } }
  };
  const drawShadows = (h) => {
    if (h < 6.2 || h > 18.6) return; const a = ((h - 6) / 12) * Math.PI; const dir = -Math.cos(a); const fade = smoothstep(6.2, 7.6, h) * (1 - smoothstep(17.4, 18.6, h)); const reach = 3 + Math.abs(dir) * 22;
    const mark = (x, y, strength) => { const px = x + ox; const py = y + oy; if (px < 0 || py < 0 || px >= bw || py >= bh) return; const i = py * bw + px; if (matBuf[i] !== 0 && strength * fade * 16 > bayerAt(x, y)) varBuf[i] = 1; };
    const tx = 146 + dir * reach * 0.8; for (let y = 87; y < 101; y++) { const t = (y - 87) / 14; const half = 25 * Math.sqrt(1 - Math.pow(t * 2 - 1, 2)) * (1 + Math.abs(dir) * 0.3); const cx = tx + (t - 0.5) * dir * 8; for (let x = Math.round(cx - half); x <= cx + half; x++) mark(x, y, 1 - Math.abs(x - cx) / (half + 1) * 0.4); }
    for (let y = 87; y < 94; y++) { const t = (y - 87) / 7; const shift = dir * reach * 0.8 * t; for (let x = Math.round(36 + Math.min(shift, 0)); x <= 86 + Math.max(shift, 0); x++) mark(x, y, 1 - t * 0.5); }
  };
  const drawWindow = (h) => {
    const WX = 46; const WY = 61; const WW = 14; const WH = 12; const lamp = h >= 19.6 && h < 22.9; const cook = h >= 17.2 && h < 19.6; const morning = h >= 7 && h < 9.6; const asleep = h >= 22.9 || h < 6.5;
    if (lamp || cook) {
      const flick = lamp ? lampFlick : 0.6 + 0.08 * Math.sin(anim * 9); const swing = lamp && !calm ? Math.round(Math.sin(anim * 0.9) * 0.7) : 0;
      for (let y = 0; y < WH; y++) { for (let x = 0; x < WW; x++) { let m; if (lamp) { const cone = Math.abs(x - (4.5 + swing)) - (y - 2) * 0.62; m = cone < 0 && y >= 3 ? M.LIT_HI : cone < 2.2 ? M.LIT : M.LIT_DK; } else { m = Math.hypot(x - 6.5, y - 8) < 5 && bayerAt(x, y) < 8 ? M.LIT : M.LIT_DK; } if (y >= WH - 1) m = M.LIT_DK; put(WX + x, WY + y, m); if (y < WH) emit(WX + x, WY + y, (m === M.LIT_HI ? 255 : m === M.LIT ? 210 : 130) * flick, 0); } }
      if (lamp) {
        const lx = WX + 4 + swing; put(lx, WY, M.SIL); put(lx, WY + 1, M.SIL); rect(lx - 2, WY + 2, 5, 1, M.SIL); rect(lx - 1, WY + 3, 3, 1, M.LIT_HI); rect(WX + 1, WY + 10, 9, 1, M.SIL); rect(WX + 2, WY + 11, 1, 1, M.SIL); rect(WX + 8, WY + 11, 1, 1, M.SIL);
        const pageUp = res.pageT > 0 && !calm; rect(WX + 4, WY + 9, 3, 1, M.SIL); if (pageUp) put(WX + 5, WY + 8, M.SIL);
        if (res.inside) { const startled = res.startle > 0; const look = startled || (!calm && Math.sin(anim * 0.46) > 0.72); const nod = !calm && !look && Math.sin(anim * 1.7) > 0.86 ? 1 : 0; const hy = WY + 3 + nod - (startled ? 1 : 0); const hx = WX + 8; rect(hx, hy + (look ? 0 : 1), 4, 3, M.SIL); put(hx + 1, hy + (look ? -1 : 0), M.SIL); put(hx + 2, hy + (look ? -1 : 0), M.SIL); if (!look) put(hx - 1, hy + 2, M.SIL); rect(WX + 8, WY + 7, 5, 3, M.SIL); rect(WX + 9, WY + 10, 4, 2, M.SIL); rect(WX + 6, WY + 8, 3, 1, M.SIL); }
      } else {
        const walk = calm ? 0 : Math.sin(anim * 0.8) * 3; if (res.inside) blit(SPR.sil, Math.round(WX + 3 + walk), WY + 5, false, M.SIL);
        if (!calm) { for (let i = 0; i < 3; i++) { const s = (anim * 0.9 + i * 0.33) % 1; put(WX + 11 + Math.round(Math.sin(s * 8 + i)), WY + 7 - Math.round(s * 6), M.LIT_HI); } }
        rect(WX + 10, WY + 8, 4, 1, M.SIL);
      }
    } else if (morning) {
      rect(WX, WY, WW, WH, M.ROOM); for (let y = 0; y < 2; y++) for (let x = 0; x < WW; x++) put(WX + x, WY + y, M.GLASS_HI);
      let bust = SPR.bust; if (!calm) { const c = (anim % 5.4) / 5.4; if (c > 0.16 && c < 0.24) bust = SPR.bustHalf; else if (c >= 0.24 && c < 0.5) bust = SPR.bustUp; else if (c >= 0.5 && c < 0.58) bust = SPR.bustHalf; else if (res.blink > 0) bust = SPR.blink; }
      const dy = res.startle > 0 ? -1 : 0; if (res.inside) blit(bust, WX + 3, WY + 4 + dy);
    } else {
      rect(WX, WY, WW, WH, M.GLASS); for (let i = 0; i < 6; i++) { put(WX + 2 + i, WY + 7 - i, M.GLASS_HI); if (i < 4) put(WX + 6 + i, WY + 8 - i, M.GLASS_HI); }
    }
    rect(WX + 6, WY, 2, 2, M.WOOD_DK); rect(WX, WY + 4, 1, 1, M.WOOD_DK); rect(WX + 13, WY + 4, 1, 1, M.WOOD_DK);
    const closed = asleep ? 1 : 0; shutter += calm ? closed - shutter : clamp(closed - shutter, -0.09, 0.09); const leaf = Math.round(shutter * 7);
    const drawLeaf = (x0, w) => { for (let i = 0; i < w; i++) { for (let y = 0; y < 14; y++) put(x0 + i, 60 + y, y % 2 === 0 ? M.WOOD : M.WOOD_LT); } };
    const open = 4 - Math.min(4, leaf); if (open > 0) { drawLeaf(44 - open, open); drawLeaf(62, open); } if (leaf > 0) { drawLeaf(46, leaf); drawLeaf(60 - leaf, leaf); }
    return { lamp, cook, asleep };
  };
  const drawDoor = () => { if (res.doorOpen > 0) { rect(68, 67, 10, 18, M.SIL); rect(68, 67, 2, 18, M.WOOD_LT); } };
  const drawResident = (plan, h) => {
    if (res.inside) return; const base = 89; const dy = -Math.round(res.hop); const startled = res.startle > 0; const moving = Math.abs((plan.outside ? plan.x : 73) - res.x) > 0.5;
    if (!moving && plan.act === 'read' && Math.abs(res.x - 131) < 1) { const up = startled; const spr = up ? SPR.seatUp : res.blink > 0 ? SPR.seatBlink : SPR.seat; const x = 131; const y = base - 10 + dy; blit(spr, x, y); const bx = x - 1; const by = y + 5; if (!up) { if (res.pageT > 0.28) { rect(bx, by, 4, 3, M.BOOK); rect(bx + 1, by - 1, 2, 1, M.BOOK_DK); } else if (res.pageT > 0.14) { rect(bx + 1, by - 2, 2, 5, M.BOOK); } else { rect(bx, by, 4, 3, M.BOOK); rect(bx + 3, by, 1, 3, M.BOOK_DK); put(bx + 1, by + 1, M.BOOK_DK); } } else { rect(bx, by + 1, 4, 2, M.BOOK_DK); } if (!calm && Math.sin(anim * 1.1) > 0.8) put(x + 1, y + 9, M.BOOT); if (startled) { rect(x + 5, y - 7, 1, 4, M.MARK); put(x + 5, y - 2, M.MARK); } return; }
    if (!moving && plan.act === 'tend') { const bob = !calm && Math.sin(anim * 2.2) > 0; blit(bob ? SPR.crouch : SPR.stand, Math.round(res.x) - 3, bob ? base - 10 : base - 12, false); return; }
    let spr = SPR.stand; if (startled) spr = SPR.up; else if (moving) spr = SPR.walk[Math.floor(res.step) % 4]; else if (res.blink > 0) spr = SPR.blink; blit(spr, Math.round(res.x) - 3, base - 12 + dy, res.face < 0);
    if (startled) { rect(Math.round(res.x), base - 19 + dy, 1, 4, M.MARK); put(Math.round(res.x), base - 14 + dy, M.MARK); }
  };
  const drawCanopy = () => { for (let i = 0; i < canopy.length; i += 3) { const y = canopy[i + 1]; const sway = calm ? 0 : Math.round(Math.sin(anim * 0.9 + y * 0.11) * (1.15 - (y - 10) * 0.012)); put(canopy[i] + sway, y, canopy[i + 2]); } };
  const drawParticles = (h, dt) => {
    const snowNight = clamp(smoothstep(18.2, 20.2, h) + (1 - smoothstep(4.6, 6.2, h)));
    if (scene !== 'countryside') { if (weather === 'snow') { const snowMat = snowNight > 0.55 ? M.STAR : M.CLOUD; for (const flake of snowflakes) { if (!calm) { flake.y += dt * flake.speed; flake.x += dt * (flake.drift + Math.sin(anim * 0.7 + flake.phase) * 1.4); if (flake.y > CORE_H + 1) { flake.y = -1; flake.x = (flake.x + CORE_W * 0.37) % CORE_W; } } put(Math.round(flake.x), Math.round(flake.y), snowMat); } } return; }
    const smoking = (h >= 17.2 && h < 19.8) || (h >= 7 && h < 8.2);
    if (!calm && smoking) { smokeAcc += dt * (h >= 17 ? 3.2 : 1.4); while (smokeAcc >= 1) { smokeAcc -= 1; smoke.push({ x: 72 + Math.random() * 2, y: 25, t: 0, seed: Math.random() * 10 }); } }
    for (let i = smoke.length - 1; i >= 0; i--) { const s = smoke[i]; s.t += dt; s.y -= dt * (7 - s.t * 0.8); s.x += dt * (2.2 + Math.sin(s.t * 1.7 + s.seed) * 2.6); if (s.t > 4.2 || s.y < -4) { smoke.splice(i, 1); continue; } const size = 1 + Math.floor(s.t * 0.75); const thin = s.t * 2.6; for (let dy = 0; dy < size; dy++) { for (let dx = 0; dx < size; dx++) { const x = Math.round(s.x) + dx; const y = Math.round(s.y) + dy; if (bayerAt(x, y) < 16 - thin * 1.3) put(x, y, s.t > 2.3 ? M.SMOKE_DK : M.SMOKE); } } }
    if (calm && smoking) { for (let i = 0; i < 5; i++) { const y = 24 - i * 4; const x = 72 + i * 2; rect(x, y, 1 + (i >> 1), 2, M.SMOKE); } }
    if (!calm && (h >= 23.4 || h < 6)) { zeeAcc += dt * 0.62; while (zeeAcc >= 1) { zeeAcc -= 1; zees.push({ x: 60, y: 58, t: 0 }); } }
    for (let i = zees.length - 1; i >= 0; i--) { const z = zees[i]; z.t += dt; z.y -= dt * 4; z.x += dt * (1.2 + Math.sin(z.t * 2) * 2); if (z.t > 3 || (h >= 6 && h < 23)) { zees.splice(i, 1); continue; } const x = Math.round(z.x); const y = Math.round(z.y); const big = z.t > 1.2; const n = big ? 3 : 2; rect(x, y, n, 1, M.ZZZ); put(x + n - 2, y + 1, M.ZZZ); if (big) put(x, y + 2, M.ZZZ); rect(x, y + (big ? 3 : 2), n, 1, M.ZZZ); }
    const night = clamp(smoothstep(19.4, 20.8, h) + (1 - smoothstep(3.6, 5, h)));
    if (night > 0.3 && !calm) { for (const f of flies) { const wx = f.x + Math.sin(anim * 0.33 + f.seed) * 14 + Math.sin(anim * 0.9 + f.seed * 2) * 3; const wy = f.y + Math.sin(anim * 0.47 + f.seed * 1.4) * 5; const pulse = Math.sin(anim * 1.4 + f.seed * 3); if (pulse < 0.1) continue; put(Math.round(wx), Math.round(wy), M.FIREFLY); emit(Math.round(wx), Math.round(wy), 170 * pulse); } }
    if (!calm && h > 8 && h < 17) { butterfly.x = 108 + Math.sin(anim * 0.31) * 15 + Math.sin(anim * 1.1) * 2; butterfly.y = 82 + Math.sin(anim * 0.72) * 5; const x = Math.round(butterfly.x); const y = Math.round(butterfly.y); put(x, y, M.WOOD_DK); if (Math.floor(anim * 6) % 2) { put(x - 1, y - 1, M.WING); put(x + 1, y - 1, M.WING); } else { put(x - 1, y, M.WING); put(x + 1, y, M.WING); } }
    if (!calm && h > 7 && h < 19 && Math.random() < dt * 0.18) leaves.push({ x: 124 + Math.random() * 44, y: 54 + Math.random() * 14, t: 0, seed: Math.random() * 6 });
    for (let i = leaves.length - 1; i >= 0; i--) { const l = leaves[i]; l.t += dt; l.y += dt * 9; l.x += Math.sin(l.t * 2.3 + l.seed) * dt * 11 - dt * 2; if (l.y > 96 || l.t > 8) { leaves.splice(i, 1); continue; } put(Math.round(l.x), Math.round(l.y), M.LEAF3); }
    if (weather === 'snow') {
      const snowMat = snowNight > 0.55 ? M.STAR : M.CLOUD;
      for (const flake of snowflakes) {
        if (!calm) { flake.y += dt * flake.speed; flake.x += dt * (flake.drift + Math.sin(anim * 0.7 + flake.phase) * 1.4); if (flake.y > CORE_H + 1) { flake.y = -1; flake.x = (flake.x + CORE_W * 0.37) % CORE_W; } if (flake.x < -1) flake.x += CORE_W + 2; else if (flake.x > CORE_W + 1) flake.x -= CORE_W + 2; }
        const px = Math.round(flake.x); const py = Math.round(flake.y); put(px, py, snowMat);
        if (snowNight > 0.72 && flake.phase > 2.5) put(px + 1, py, M.STAR_DIM);
      }
    }
  };
  const drawLights = (state, h) => {
    const targetWin = state.lamp ? 1 : state.cook ? 0.46 : 0; const targetLan = h >= 18.4 && h < 22.9 ? 1 : 0;
    windowL += (targetWin - windowL) * (calm ? 1 : 0.28); lanternL += (targetLan - lanternL) * (calm ? 1 : 0.28);
    if (lanternL > 0.02) { const flick = calm ? 1 : 0.94 + 0.06 * Math.sin(anim * 11) * Math.sin(anim * 3.7); rect(64, 64, 3, 1, M.WOOD_DK); rect(64, 65, 3, 3, M.LIT_HI); rect(64, 68, 3, 1, M.WOOD_DK); for (let y = 65; y < 68; y++) for (let x = 64; x < 67; x++) emit(x, y, 255 * lanternL * flick, 0); } else { rect(64, 64, 3, 1, M.WOOD_DK); rect(64, 65, 3, 3, M.GLASS); rect(64, 68, 3, 1, M.WOOD_DK); }
    const pool = (cx, cy, rx, ry, L) => { if (L <= 0.01) return; for (let y = Math.max(cy - ry, -oy); y <= cy + ry; y++) { for (let x = cx - rx; x <= cx + rx; x++) { const px = x + ox; const py = y + oy; if (px < 0 || py < 0 || px >= bw || py >= bh) continue; const i = py * bw + px; const m = matBuf[i]; if (m === 0 || m === M.SIL || m === M.LIT || m === M.LIT_HI || m === M.LIT_DK) continue; const d = Math.hypot((x - cx) / rx, (y - cy) / ry); const v = (1 - d) * L * 1.5; if (v * 16 > bayerAt(x, y)) varBuf[i] = 2; } } };
    pool(53, 92, 26, 12, windowL * 0.95); pool(53, 67, 17, 10, windowL * 0.36); pool(65, 69, 11, 13, lanternL * 0.5); pool(65, 90, 19, 7, lanternL * 0.6);
  };
  let keyA = 0; let keyB = 1; let keyP = 0;
  const pickKeys = (h) => { for (let i = 0; i < KEYS.length - 1; i++) { if (h >= KEYS[i][0] && h < KEYS[i + 1][0]) { keyA = i; keyB = i + 1; keyP = clamp(((h - KEYS[i][0]) / (KEYS[i + 1][0] - KEYS[i][0]) - 0.32) / 0.36); return; } } keyA = 0; keyB = 1; keyP = 0; };
  const renderWorld = (clock, dt, hurry) => {
    const h = hourOf(clock);
    if (pluginScene) { if (!calm) pluginAnimClock += dt; renderPluginWorld(h); return; }
    if (!calm) anim += dt; matBuf.set(baseBuf); varBuf.fill(0); emitList.length = 0;
    for (const c of sources) { c.w = 0; c.x = 0; c.y = 0; }
    lampFlick = calm ? 1 : 0.95 + 0.05 * Math.sin(anim * 13) * Math.sin(anim * 5.3);
    if (!calm) { birds.next -= dt; if (birds.t >= 0) { birds.t += dt; if (birds.t > 9) birds.t = -1; } else if (birds.next <= 0) { birds.t = 0; birds.next = 12 + Math.random() * 14; birds.y = 10 + Math.random() * 24; birds.dir = Math.random() < 0.5 ? 1 : -1; } shoot.next -= dt; if (shoot.t >= 0) { shoot.t += dt; if (shoot.t > 0.6) shoot.t = -1; } else if (shoot.next <= 0) { shoot.t = 0; shoot.next = 9 + Math.random() * 16; shoot.x = 10 + Math.random() * 130; shoot.y = 2 + Math.random() * 20; } }
    drawSky(h); if (scene === 'countryside') { const plan = stepResident(dt, h, hurry); drawShadows(h); const state = drawWindow(h); drawDoor(); drawLights(state, h); drawResident(plan, h); drawCanopy(); drawParticles(h, dt); } else { drawSceneLive(h, dt); drawParticles(h, dt); }
    pickKeys(h); const ta = table[keyA]; const tb = table[keyB]; const sa = skyKeys[keyA]; const sb = skyKeys[keyB]; const p = keyP * 16; const n = bw * bh;
    for (let i = 0; i < n; i++) { const m = matBuf[i]; const useB = thrA[i] < p; const idx = m === 0 ? (useB ? sb[i] : sa[i]) : (useB ? tb : ta)[varBuf[i] * NM + m]; pixels[i] = palette32[idx]; }
  };
  const GRID_W = 72; let GRID_H = 44; let glowRaw = new Float32Array(1); let glowNearBuf = new Float32Array(1); let glowFarBuf = new Float32Array(1); let glowTemp = new Float32Array(1);
  const boxBlur = (src, dst, w, h, r) => { const size = r * 2 + 1; for (let y = 0; y < h; y++) { const row = y * w * 4; for (let c = 0; c < 3; c++) { let sum = 0; for (let x = -r; x <= r; x++) sum += src[row + clamp(x, 0, w - 1) * 4 + c]; for (let x = 0; x < w; x++) { dst[row + x * 4 + c] = sum / size; sum += src[row + clamp(x + r + 1, 0, w - 1) * 4 + c] - src[row + clamp(x - r, 0, w - 1) * 4 + c]; } } } for (let x = 0; x < w; x++) { for (let c = 0; c < 3; c++) { let sum = 0; for (let y = -r; y <= r; y++) sum += dst[clamp(y, 0, h - 1) * w * 4 + x * 4 + c]; for (let y = 0; y < h; y++) { src[y * w * 4 + x * 4 + c] = sum / size; sum += dst[clamp(y + r + 1, 0, h - 1) * w * 4 + x * 4 + c] - dst[clamp(y - r, 0, h - 1) * w * 4 + x * 4 + c]; } } } };
  let gl = null;
  let webglContextError = '';
  try {
    gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'high-performance' });
    if (!gl) webglContextError = 'canvas.getContext("webgl2") returned null. WebGL2 may be unavailable, disabled, or blocked by the device WebView.';
  } catch (error) {
    webglContextError = error && (error.stack || error.message) || String(error);
    gl = null;
  }
  let program = null; const loc = {}; let vao = null; let quad = null; let texWorld = null; let texNear = null;
  const compile = (type, source) => {
    const label = type === gl.VERTEX_SHADER ? 'Vertex Shader' : 'Fragment Shader';
    const shader = gl.createShader(type);
    if (!shader) throw new Error(label + ': gl.createShader returned null');
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(shader) || 'No shader compiler log was provided.';
      gl.deleteShader(shader);
      throw new Error(label + ' compilation failed:\\n' + log);
    }
    return shader;
  };
  const setupGl = () => {
    if (!gl) {
      reportDiagnostic('WebGL2 Failed', webglContextError || 'WebGL2 context could not be created.');
      return false;
    }
    try {
      program = gl.createProgram();
      if (!program) throw new Error('gl.createProgram returned null');
      const v = compile(gl.VERTEX_SHADER, VERT);
      const f = compile(gl.FRAGMENT_SHADER, FRAG);
      gl.attachShader(program, v);
      gl.attachShader(program, f);
      gl.bindAttribLocation(program, 0, 'aPos');
      gl.linkProgram(program);
      gl.deleteShader(v);
      gl.deleteShader(f);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error('Shader program link failed:\\n' + (gl.getProgramInfoLog(program) || 'No program link log was provided.'));
      }
    } catch (error) {
      const detail = error && (error.stack || error.message) || String(error);
      console.warn('cannot create shader', error);
      reportDiagnostic('WebGL2 Failed', detail);
      return false;
    }
    gl.useProgram(program);
    for (const name of ['uWorld', 'uGlowNear', 'uRes', 'uPill', 'uOrigin', 'uWorldSize', 'uGlowSize', 'uLens', 'uBezel', 'uK', 'uNight', 'uLift', 'uSeam', 'uCalm', 'uRefraction', 'uDispersion', 'uShine', 'uShellDay', 'uShellNight', 'uInk', 'uLight', 'uHiNight', 'uLoNight', 'uSkyDay', 'uHomeCol', 'uSkyCol', 'uHomePos', 'uSkyPos']) { loc[name] = gl.getUniformLocation(program, name); }
    vao = gl.createVertexArray(); gl.bindVertexArray(vao); quad = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, quad); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    const makeTex = () => { const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); return t; };
    texWorld = makeTex(); texNear = makeTex(); gl.uniform1i(loc.uWorld, 0); gl.uniform1i(loc.uGlowNear, 1); gl.disable(gl.BLEND); return true;
  };
  let ready = setupGl(); let lost = !ready && !!gl && gl.isContextLost(); let ctx2d = null; let lowCanvas = null;
  const useCanvas2d = () => {
    const fresh = canvas.cloneNode(false);
    canvas.replaceWith(fresh);
    canvas = fresh;
    try { ctx2d = canvas.getContext('2d'); }
    catch (error) {
      reportDiagnostic('Canvas 2D Failed', error && (error.stack || error.message) || String(error));
      return;
    }
    if (!ctx2d) reportDiagnostic('Canvas 2D Failed', 'canvas.getContext("2d") returned null after WebGL2 initialization failed.');
  };
  if (!ready && !lost) useCanvas2d();
  const shape = { W: 1, H: 1, cssW: 1, cssH: 1, dpr: 1, pillW: 1, pillH: 1, bezel: 1, winW: 1, winH: 1, r0: 1, travel: 1, travelCss: 1, ox: 0, oy: 0 };
  let renderScale = 1; let fullK = 1; let thumbSeam = 1;
  const pickK = (winH) => { const whole = Math.max(1, Math.floor(winH / CORE_H)); return ((whole + 1) * CORE_H) / winH <= 1.12 ? whole + 1 : whole; };
  const measure = () => {
    const box = root.getBoundingClientRect(); const fullDpr = Math.min(2, devicePixelRatio || 1); const nextFullK = pickK((Math.round(box.height * fullDpr) / 1.32) * (1 - bezelRatio * 2));
    if (nextFullK !== fullK) { fullK = nextFullK; renderScale = 1; }
    const dpr = fullDpr * renderScale; const W = Math.max(2, Math.round(box.width * dpr)); const H = Math.max(2, Math.round(box.height * dpr)); const changed = W !== shape.W || H !== shape.H;
    shape.W = W; shape.H = H; shape.cssW = box.width; shape.cssH = box.height; shape.dpr = dpr;
    shape.pillH = H / 1.32; shape.pillW = shape.pillH * PILL_RATIO; shape.bezel = shape.pillH * bezelRatio;
    shape.winW = shape.pillW - shape.bezel * 2; shape.winH = shape.pillH - shape.bezel * 2;
    const gap = shape.pillH * 0.032; shape.r0 = shape.winH / 2 - gap; shape.travel = shape.winW - (shape.r0 + gap) * 2; shape.travelCss = shape.travel / dpr;
    canvas.style.width = `${W / dpr}px`; canvas.style.height = `${H / dpr}px`; const grid = Math.max(devicePixelRatio || 1, dpr); const fx = (box.left * grid) % 1; const fy = (box.top * grid) % 1; canvas.style.transform = `translate(${-fx / grid}px, ${-fy / grid}px)`;
    if (!changed) return false;
    canvas.width = W; canvas.height = H;
    k = Math.max(1, Math.round(fullK * renderScale)); const needW = Math.ceil(shape.winW / k) + MARGIN * 2; const needH = Math.ceil(shape.winH / k) + MARGIN * 2; bw = needW + (needW & 1); bh = needH + (needH & 1); ox = (bw - CORE_W) >> 1; oy = (bh - CORE_H) >> 1;
    matBuf = new Uint8Array(bw * bh); baseBuf = new Uint8Array(bw * bh); varBuf = new Uint8Array(bw * bh); pixels = new Uint32Array(bw * bh); pixelBytes = new Uint8Array(pixels.buffer); thrA = new Uint8Array(bw * bh);
    for (let y = 0; y < bh; y++) { for (let x = 0; x < bw; x++) { thrA[y * bw + x] = bayerAt(x + 1, y + 2); } }
    buildBase(); shape.ox = Math.floor(W / 2 - (bw * k) / 2); shape.oy = Math.floor(H / 2 + (bh * k) / 2); thumbSeam = Math.max(1, Math.round(k * 0.055));
    GRID_H = Math.max(8, Math.round((GRID_W * H) / W)); const size = GRID_W * GRID_H * 4; glowRaw = new Float32Array(size); glowNearBuf = new Float32Array(size); glowFarBuf = new Float32Array(size); glowTemp = new Float32Array(size);
    if (ready) { gl.viewport(0, 0, W, H); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texWorld); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, bw, bh, 0, gl.RGBA, gl.UNSIGNED_BYTE, null); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, texNear); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, GRID_W, GRID_H, 0, gl.RGBA, gl.FLOAT, null); } else { lowCanvas = offscreen(bw, bh); }
    return true;
  };
  const uploadWorld = () => {
    glowRaw.fill(0);
    for (let e = 0; e < emitList.length; e += 2) { const i = emitList[e]; const w = emitList[e + 1] / 255; const px = i % bw; const py = (i - px) / bw; const fx = ((shape.ox + (px + 0.5) * k) / shape.W) * GRID_W; const fy = ((shape.H - shape.oy + (py + 0.5) * k) / shape.H) * GRID_H; const gx = clamp(Math.floor(fx), 0, GRID_W - 1); const gy = clamp(Math.floor(fy), 0, GRID_H - 1); const c = pixels[i]; const at = (gy * GRID_W + gx) * 4; glowRaw[at] += (c & 255) * w * 0.0007; glowRaw[at + 1] += ((c >>> 8) & 255) * w * 0.0007; glowRaw[at + 2] += ((c >>> 16) & 255) * w * 0.0007; }
    glowNearBuf.set(glowRaw); boxBlur(glowNearBuf, glowTemp, GRID_W, GRID_H, 1); boxBlur(glowNearBuf, glowTemp, GRID_W, GRID_H, 1); glowFarBuf.set(glowRaw); boxBlur(glowFarBuf, glowTemp, GRID_W, GRID_H, 3); boxBlur(glowFarBuf, glowTemp, GRID_W, GRID_H, 3);
    for (let i = 0; i < glowNearBuf.length; i++) glowNearBuf[i] += glowFarBuf[i] * 0.55;
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texWorld); gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, bw, bh, gl.RGBA, gl.UNSIGNED_BYTE, pixelBytes); gl.generateMipmap(gl.TEXTURE_2D);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, texNear); gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, GRID_W, GRID_H, gl.RGBA, gl.FLOAT, glowNearBuf);
  };
  let x = 0; let velocity = 0; let target = 0; let moving = false; let checked = false; let stretch = 0; let stretchV = 0; let lift = 0; let liftTarget = 0; let hurry = 0;
  let branch = 'pm'; let amStart = CLOCK_NIGHT; let nightClock = CLOCK_NIGHT;
  const clockOf = () => { if (branch === 'am') return mix(36, amStart, x); if (x >= 1) return nightClock; return CLOCK_DAY + (CLOCK_NIGHT - CLOCK_DAY) * x; };
  const beginTravel = () => { if (x <= 0.0005) branch = 'pm'; else if (x >= 0.9995) { branch = 'am'; amStart = nightClock; } };
  const setStatus = (text) => { if (statusEl.textContent !== text) statusEl.textContent = text; };
  const locale = (() => { const el = root.closest('[lang]') || root.ownerDocument.documentElement; const value = (el.getAttribute('lang') || 'en').toLowerCase(); return value.startsWith('ja') ? 'ja' : value.startsWith('zh') ? 'zh-CN' : 'en'; })();
  const phaseNames = locale === 'ja' ? ['夜','夜明け','朝','昼','夕方'] : locale === 'zh-CN' ? ['夜晚','黎明','早晨','白天','傍晚'] : ['Night','Dawn','Morning','Day','Evening'];
  const phaseName = (h) => h < 5 || h >= 20 ? phaseNames[0] : h < 7 ? phaseNames[1] : h < 10 ? phaseNames[2] : h < 16.5 ? phaseNames[3] : phaseNames[4];
  const commit = (value) => {
    const night = value >= 1; x = night ? 1 : 0; velocity = 0; moving = false;
    if (night) { nightClock = branch === 'am' ? amStart : CLOCK_NIGHT; branch = 'pm'; } else { branch = 'pm'; }
    if (checked !== night) { checked = night; button.setAttribute('aria-checked', String(night)); root.dispatchEvent(new CustomEvent('daylight:change', { bubbles: true, composed: true, detail: { night } })); }
    setStatus(night ? (locale === 'ja' ? '夜' : locale === 'zh-CN' ? '夜晚' : 'Night') : (locale === 'ja' ? '昼' : locale === 'zh-CN' ? '白天' : 'Day'));
  };
  const drawGl = (night) => {
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.useProgram(program); gl.bindVertexArray(vao);
    gl.uniform2f(loc.uRes, shape.W, shape.H); gl.uniform2f(loc.uPill, shape.pillW / 2, shape.pillH / 2); gl.uniform2f(loc.uOrigin, shape.ox, shape.oy); gl.uniform2f(loc.uWorldSize, bw, bh); gl.uniform2f(loc.uGlowSize, GRID_W, GRID_H); gl.uniform1f(loc.uBezel, shape.bezel); gl.uniform1f(loc.uDispersion, dispersion); gl.uniform1f(loc.uShine, shine); gl.uniform1f(loc.uRefraction, refraction); gl.uniform1f(loc.uK, k); gl.uniform1f(loc.uNight, night); gl.uniform1f(loc.uLift, lift); gl.uniform1f(loc.uSeam, thumbSeam); gl.uniform1f(loc.uCalm, calm ? 1 : 0);
    const s = clamp(stretch, -0.5, 1.2); const r = shape.r0 * (1 + 0.012 * lift); const halfX = r * (1 + 0.2 * s); const halfY = r * (1 - 0.075 * s); const lim = shape.winW / 2 - (shape.winH / 2 - shape.r0) - halfX; const raw = (x - 0.5) * shape.travel; const cx = clamp(raw, -lim, lim);
    gl.uniform4f(loc.uLens, cx, 0, halfX, halfY); gl.uniform3fv(loc.uShellDay, unit(C3)); gl.uniform3fv(loc.uShellNight, unit(I1)); gl.uniform3fv(loc.uInk, unit(I0)); gl.uniform3fv(loc.uLight, unit(C3)); gl.uniform3fv(loc.uHiNight, unit(I3)); gl.uniform3fv(loc.uLoNight, unit(I0)); gl.uniform3fv(loc.uSkyDay, unit(U2));
    const homeW = sources[0].w; const home = unit(A2); const homeI = (homeW / 255 / 150) * 1.05; const hx = homeW > 0 ? shape.ox + (sources[0].x / homeW + 0.5) * k - shape.W / 2 : 0; const hy = homeW > 0 ? shape.oy - (sources[0].y / homeW + 0.5) * k - shape.H / 2 : 0;
    gl.uniform2f(loc.uHomePos, hx, hy); gl.uniform3f(loc.uHomeCol, home[0] * homeI, home[1] * homeI, home[2] * homeI);
    const skyW = sources[1].w; const skyU = unit(A3); const skyI = (skyW / 255 / 110) * 0.55; const sx = skyW > 0 ? shape.ox + (sources[1].x / skyW + 0.5) * k - shape.W / 2 : 0; const sy = skyW > 0 ? shape.oy - (sources[1].y / skyW + 0.5) * k - shape.H / 2 : 0;
    gl.uniform2f(loc.uSkyPos, sx, sy); gl.uniform3f(loc.uSkyCol, skyU[0] * skyI, skyU[1] * skyI, skyU[2] * skyI);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  const draw2d = (night) => {
    const g = ctx2d; const low = lowCanvas.getContext('2d'); low.putImageData(new ImageData(new Uint8ClampedArray(pixels.buffer), bw, bh), 0, 0); g.clearRect(0, 0, shape.W, shape.H);
    const px = (shape.W - shape.pillW) / 2; const py = (shape.H - shape.pillH) / 2;
    g.save(); g.beginPath(); g.roundRect(px, py, shape.pillW, shape.pillH, shape.pillH / 2); g.clip(); g.imageSmoothingEnabled = false; g.drawImage(lowCanvas, shape.ox, shape.H - shape.oy, bw * k, bh * k); g.restore();
    const cx = shape.W / 2 + (x - 0.5) * shape.travel; const light = unit(C3).map((v) => Math.round(v * 255)); g.fillStyle = `rgb(${light[0]} ${light[1]} ${light[2]} / 0.5)`; g.beginPath(); g.arc(cx, shape.H / 2, shape.r0, 0, Math.PI * 2); g.fill(); return night;
  };
  let raf = 0; let last = 0; let visible = true; let pageVisible = root.ownerDocument.visibilityState !== 'hidden'; let worldAcc = 1; let dirty = true; let slow = 0; let good = 0; let frames = 0; let lastWorldClock = -1; let lastNightText = ''; let drag = null;
  const nightAmount = (h) => clamp(smoothstep(17.4, 20.2, h) + (1 - smoothstep(4.8, 7.2, h)));
  const OVERLOAD_MS = 12; const COST_SAMPLES = 5; const onePixel = new Uint8Array(4); let costLeft = 0; let costs = []; let weighedOnce = false;
  const lowerResolution = () => { const next = (k - 1) / fullK; if (k < 2 || next < 0.5) { frames = -600; return; } renderScale = next; measure(); dirty = true; lastWorldClock = -1; frames = 0; };
  const adapt = (dt) => { ++frames; if (frames === 40 && !weighedOnce) { weighedOnce = true; costLeft = COST_SAMPLES; costs = []; } if (frames < 40) return; if (dt > 0.0225) slow++; else good++; if (slow + good < 50) return; const suspect = slow > 30; slow = 0; good = 0; if (suspect) { costLeft = COST_SAMPLES; costs = []; } };
  const weighCost = (startedAt) => { gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, onePixel); costs.push(performance.now() - startedAt); if (--costLeft > 0) return; const median = costs.sort((a, b) => a - b)[costs.length >> 1]; if (median > OVERLOAD_MS) lowerResolution(); else frames = -600; };
  const tick = (ms) => {
    raf = 0; if (lost) return; const t = ms / 1000; const dt = last ? Math.min(0.05, t - last) : 1 / 60; last = t;
    if (!calm && ready) adapt(dt);
    if (drag) { const before = x; x += (clamp(drag.want) - x) * (1 - Math.exp(-dt * 34)); velocity = (x - before) / Math.max(dt, 1 / 240); dirty = true; }
    else if (moving) { const omega = calm ? 16 : speed; const accel = omega * omega * (target - x) - 2 * omega * velocity; velocity += accel * dt; x += velocity * dt; dirty = true; if (Math.abs(target - x) < 0.0015 && Math.abs(velocity) < 0.03) { x = target; if (x <= 0 || x >= 1) { if (!calm) stretchV -= bounce; commit(x); } else { velocity = 0; moving = false; } } x = clamp(x); }
    else { velocity = 0; }
    if (!calm) { const goal = clamp(Math.abs(velocity) * 0.42); stretchV += (170 * (goal - stretch) - 11 * stretchV) * dt; stretch += stretchV * dt; lift += (liftTarget - lift) * (1 - Math.exp(-dt * 14)); if (Math.abs(stretch) > 0.002 || Math.abs(stretchV) > 0.01 || Math.abs(liftTarget - lift) > 0.002) dirty = true; }
    else { stretch = 0; stretchV = 0; lift = liftTarget; }
    if (!calm && x >= 1 && !moving && !drag && nightClock < CLOCK_SLEEP) { nightClock = Math.min(CLOCK_SLEEP, nightClock + (dt * timeSpeed * (CLOCK_SLEEP - CLOCK_NIGHT)) / NIGHT_CREEP); }
    const clock = clockOf(); hurry = Math.max(hurry - dt * 1.4, clamp(Math.abs(velocity) * 0.6));
    worldAcc += dt; const worldStep = calm ? Math.abs(clock - lastWorldClock) > 1e-4 || dirty : worldAcc >= 1 / WORLD_HZ - WORLD_SLACK;
    if (worldStep) { renderWorld(clock, Math.min(worldAcc, 0.1) * timeSpeed, hurry); worldAcc = 0; lastWorldClock = clock; if (ready) uploadWorld(); dirty = true; }
    if (dirty) { const night = nightAmount(hourOf(clock)); const nightText = night.toFixed(3); if (nightText !== lastNightText) { lastNightText = nightText; root.style.setProperty('--night', nightText); } if (ready) { const startedAt = costLeft > 0 ? performance.now() : 0; drawGl(night); if (startedAt) weighCost(startedAt); } else { draw2d(night); } dirty = false; }
    const idleCalm = calm && !moving && !drag; if (visible && pageVisible && !idleCalm) raf = requestAnimationFrame(tick);
  };
  function stopDrawing() { if (raf) cancelAnimationFrame(raf); raf = 0; }
  function wake() { if (!raf && visible && pageVisible && !lost) { last = 0; raf = requestAnimationFrame(tick); } }
  let startleCool = 0; const startle = () => { if (calm || performance.now() < startleCool) return; startleCool = performance.now() + 1500; res.startle = 0.9; };
  let suppressClick = 0;
  on(button, 'pointerdown', (event) => { if (event.button !== 0) return; beginTravel(); moving = false; drag = { id: event.pointerId, start: event.clientX, from: x, want: x, moved: false, lastX: event.clientX, lastT: performance.now(), speed: 0 }; liftTarget = 1; try { button.setPointerCapture(event.pointerId); } catch { } wake(); });
  on(button, 'pointermove', (event) => { if (!drag || event.pointerId !== drag.id) return; const dx = event.clientX - drag.start; if (Math.abs(dx) > 3) drag.moved = true; drag.want = drag.from + dx / Math.max(shape.travelCss, 1); const nowMs = performance.now(); const dtMs = Math.max(nowMs - drag.lastT, 4); const speed = (event.clientX - drag.lastX) / Math.max(shape.travelCss, 1) / (dtMs / 1000); drag.speed = drag.speed * 0.6 + speed * 0.4; drag.lastX = event.clientX; drag.lastT = nowMs; if (Math.abs(drag.speed) > 3.4) startle(); wake(); });
  const release = (event) => { if (!drag || event.pointerId !== drag.id) return; const wasMoved = drag.moved; const speed = drag.speed; drag = null; liftTarget = 0; if (wasMoved) { suppressClick = performance.now() + 300; target = x + speed * 0.09 >= 0.5 ? 1 : 0; velocity = clamp(speed * (1.6 - friction), -3, 3); moving = true; } wake(); };
  on(button, 'pointerup', release); on(button, 'pointercancel', release); on(button, 'lostpointercapture', release);
  const toggle = () => { beginTravel(); target = (moving ? target >= 0.5 : x >= 0.5) ? 0 : 1; moving = true; wake(); };
  on(button, 'click', () => { if (performance.now() < suppressClick) return; toggle(); });
  const STEP = 0.04;
  on(button, 'keydown', (event) => { let dir = 0; if (event.key === 'ArrowRight' || event.key === 'ArrowUp') dir = 1; else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') dir = -1; if (!dir) return; event.preventDefault(); beginTravel(); const from = moving ? target : x; target = clamp(from + dir * STEP); moving = true; setStatus(phaseName(hourOf(branch === 'am' ? mix(36, amStart, target) : CLOCK_DAY + (CLOCK_NIGHT - CLOCK_DAY) * target))); wake(); });
  const io = new IntersectionObserver((entries) => { visible = entries.some((e) => e.isIntersecting); if (visible) { dirty = true; wake(); } else { stopDrawing(); } });
  io.observe(root);
  on(root.ownerDocument, 'visibilitychange', () => { pageVisible = root.ownerDocument.visibilityState !== 'hidden'; if (pageVisible) { dirty = true; wake(); if (lost) waitForRestore(); } else { stopDrawing(); clearTimeout(restoreTimer); } });
  const ro = new ResizeObserver(() => { measure(); dirty = true; lastWorldClock = -1; wake(); }); ro.observe(root);
  const applyCalm = () => { calm = motionQuery.matches; dirty = true; lastWorldClock = -1; wake(); };
  on(motionQuery, 'change', applyCalm);
  on(schemeQuery, 'change', () => { readPalette(); dirty = true; lastWorldClock = -1; wake(); });
  const RESTORE_WAIT_MS = 3000; let restoreTimer = 0;
  const redrawAll = () => { shape.W = 0; measure(); dirty = true; lastWorldClock = -1; worldAcc = 1; wake(); };
  function waitForRestore() { clearTimeout(restoreTimer); restoreTimer = setTimeout(() => { if (!lost || !pageVisible) return; lost = false; useCanvas2d(); redrawAll(); }, RESTORE_WAIT_MS); }
  on(canvas, 'webglcontextlost', (event) => { event.preventDefault(); ready = false; lost = true; costLeft = 0; stopDrawing(); if (pageVisible) waitForRestore(); });
  on(canvas, 'webglcontextrestored', () => { if (ctx2d) return; clearTimeout(restoreTimer); lost = false; ready = setupGl(); if (!ready) useCanvas2d(); redrawAll(); });
  readPalette(); measure(); if (lost) waitForRestore(); res.x = 131; res.inside = false;
  renderWorld(clockOf(), 0, 0); if (ready) uploadWorld(); if (startNight) { commit(1); dirty = true; } wake();
  return () => { stopDrawing(); clearTimeout(restoreTimer); visible = false; io.disconnect(); ro.disconnect(); for (const off of cleanups) off(); if (gl && ready) { gl.deleteProgram(program); gl.deleteBuffer(quad); gl.deleteVertexArray(vao); gl.deleteTexture(texWorld); gl.deleteTexture(texNear);  } };
}
const SELECTOR = '[data-ld-part="toggle-daylight"]';
const STYLE_ID = 'ld-toggle-daylight-style';
const COMPONENT_CSS = `
[data-ld-part="toggle-daylight"] {
  --_bg: var(--ld-bg, #f5ecd9);
  --_surface: var(--ld-surface, #8c9a62);
  --_fg: var(--ld-fg, #1b2146);
  --_muted: var(--ld-muted, #7f97b3);
  --_accent: var(--ld-accent, #efa02c);
  --_radius: var(--ld-radius, 9999px);
  --_font: var(--ld-font, system-ui, sans-serif);
  --_space: var(--ld-space, 8px);
  --_shadow: var(--ld-shadow, 0 8px 24px rgb(27 33 70 / .2));
  --_motion: var(--ld-motion, 200ms);
  position: relative;
  display: block;
  box-sizing: border-box;
  width: min(100%, calc((100vh - 64px) * 1.6439));
  aspect-ratio: 1.6439;
  font-family: var(--_font);
  color: var(--_fg);
}
[data-ld-part="toggle-daylight"] .probe { display: none; }
[data-ld-part="toggle-daylight"] .vh {
  position: absolute;
  width: 1px; height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
[data-ld-part="toggle-daylight"] .scene {
  position: absolute; top: 0; left: 0;
  display: block; width: 100%; height: 100%;
  pointer-events: none;
  image-rendering: pixelated;
}
[data-ld-part="toggle-daylight"] .hit {
  position: absolute; top: 12.121%; left: 7.373%;
  width: 85.253%; height: 75.758%;
  margin: 0; padding: 0; border: 0;
  border-radius: var(--_radius);
  background: transparent;
  cursor: grab; touch-action: pan-y;
  user-select: none; -webkit-user-select: none; -webkit-tap-highlight-color: transparent;
}
[data-ld-part="toggle-daylight"] .hit:active { cursor: grabbing; }
[data-ld-part="toggle-daylight"] .hit:focus { outline: none; }
[data-ld-part="toggle-daylight"] .hit:focus-visible {
  outline: 2px solid var(--_accent);
  outline-offset: calc(var(--_space) * .5);
  transition: outline-offset var(--_motion) ease;
}
@media (prefers-reduced-motion: reduce) {
  [data-ld-part="toggle-daylight"] .hit:focus-visible { transition: none; }
}
`;
function injectStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = COMPONENT_CSS;
  document.head.insertBefore(style, document.head.firstChild);
}
function ensureMarkup(root) {
  const doc = root.ownerDocument;
  const make = (tag, className, attrs) => {
    const el = doc.createElement(tag);
    if (className) el.className = className;
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  };
  if (!root.querySelector('.scene')) root.appendChild(make('canvas', 'scene', { 'aria-hidden': 'true' }));
  if (!root.querySelector('.hit')) {
    const lang = ((root.closest('[lang]') || doc.documentElement).getAttribute('lang') || '').toLowerCase();
    const label = root.getAttribute('data-label') || (lang.indexOf('ja') === 0 ? '昼夜スイッチ' : lang.indexOf('zh') === 0 ? '昼夜开关' : 'Day/night switch');
    root.appendChild(make('button', 'hit', { type: 'button', role: 'switch', 'aria-checked': 'false', 'aria-label': label }));
  }
  if (!root.querySelector('[data-status]')) {
    root.appendChild(make('span', 'vh', { role: 'status', 'aria-live': 'polite', 'data-status': '' }));
  }
  if (!root.querySelector('.probe')) root.appendChild(make('span', 'probe', { 'aria-hidden': 'true' }));
}
const mounted = new WeakMap();
function mountOne(root) {
  if (!root) return null;
  if (mounted.has(root)) return mounted.get(root);
  try {
    injectStyle();
    ensureMarkup(root);
    const destroy = mount(root);
    mounted.set(root, destroy);
    return destroy;
  } catch (err) {
    console.error('[pixel-daylight-switch]', err);
    reportDiagnostic('App Initialization Failed', err && (err.stack || err.message) || String(err));
    return null;
  }
}
function unmountOne(root) {
  const destroy = mounted.get(root);
  if (destroy) { destroy(); mounted.delete(root); }
}
function mountAll() { document.querySelectorAll(SELECTOR).forEach(mountOne); }
const api = { mount: mountOne, unmount: unmountOne };
if (typeof window !== 'undefined' && window.PixelDaylightSwitchScenePlugins) {
  const sceneApi = window.PixelDaylightSwitchScenePlugins;
  api.registerScene = sceneApi.registerScene;
  api.validateScene = sceneApi.validateScene;
  api.getScene = sceneApi.getScene;
  api.listScenes = sceneApi.listScenes;
}
if (typeof document !== 'undefined' && !(typeof window !== 'undefined' && window.__PDS_DEFER_AUTO_MOUNT__)) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountAll, { once: true });
  else mountAll();
}
if (typeof window !== 'undefined') window.PixelDaylightSwitch = api;
if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();