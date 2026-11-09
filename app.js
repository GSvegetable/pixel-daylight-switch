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
const CHARS = { H: 'HAIR', S: 'SKIN', E: 'HAIR', T: 'SHIRT', D: 'SHIRT_DK', P: 'PANTS', B: 'BOOT', W: 'BOOK', K: 'BOOK_DK' };
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

  // Additional handcrafted pixel environments. Coordinates share the 192×112 world grid.
  const paintJapaneseStreet = () => {
    rect(0, 0, CORE_W, 74, 0);
    rect(0, 74, CORE_W, 8, M.STONE); rect(0, 82, CORE_W, 30, M.PATH_DK);
    for (let y=76;y<82;y+=2) rect(0,y,CORE_W,1,M.STONE_LT);
    // shopfronts and narrow Japanese buildings
    rect(0,24,53,51,M.WALL); rect(0,20,55,5,M.ROOF);
    rect(4,30,45,3,M.WOOD_DK); rect(5,34,43,23,M.GLASS);
    rect(4,58,46,17,M.WOOD_DK); rect(7,60,40,13,M.WOOD);
    for(let x=10;x<47;x+=8){rect(x,60,1,13,M.WOOD_DK);}
    rect(8,27,39,5,M.ROOF_HI); rect(8,36,39,2,M.WOOD_DK);
    // noren curtain
    for(let x=10;x<44;x+=7){rect(x,38,5,9,M.CLOUD);rect(x+1,45,3,2,M.CLOUD_SH);}
    rect(68,16,42,59,M.WALL_SH); rect(70,19,38,5,M.ROOF);
    for(let x=74;x<106;x+=12){rect(x,30,8,13,M.GLASS);rect(x+1,31,6,2,M.GLASS_HI);rect(x+3,30,1,13,M.WOOD_DK);}
    rect(72,51,34,22,M.WOOD_DK); rect(75,54,28,19,M.WOOD);
    rect(78,57,22,9,M.GLASS); rect(79,58,20,2,M.GLASS_HI);
    // right-side ramen shop
    rect(132,29,60,46,M.WALL); rect(130,24,62,6,M.ROOF);
    rect(135,34,54,4,M.WOOD_DK); rect(138,39,48,3,M.WOOD_LT);
    rect(139,44,44,19,M.GLASS); rect(141,46,40,14,M.WOOD_DK);
    rect(143,48,36,10,M.GLASS); rect(144,49,34,2,M.GLASS_HI);
    rect(135,63,54,12,M.WOOD_DK); rect(139,65,46,8,M.WOOD);
    // lanterns, signs, street poles and wires
    rect(15,18,2,8,M.WOOD_DK); rect(12,17,8,1,M.WOOD_DK); rect(13,18,6,6,M.LIT); rect(14,19,4,4,M.LIT_HI);
    rect(150,15,2,9,M.WOOD_DK); rect(146,14,10,1,M.WOOD_DK); rect(147,15,8,7,M.LIT); rect(148,16,6,4,M.LIT_HI);
    rect(117,10,2,70,M.WOOD_DK); rect(108,12,22,2,M.WOOD_DK); rect(111,14,1,5,M.WOOD_DK);
    for(let x=0;x<CORE_W;x+=2){ if(x%4===0) put(x,12+Math.round(Math.sin(x*.035)*2),M.WOOD_DK); }
    rect(118,78,2,8,M.WOOD_DK); rect(115,76,8,2,M.WOOD_LT);
    // road markings and drain
    for(let x=14;x<CORE_W;x+=36){rect(x,94,14,2,M.STONE_LT);rect(x+4,95,7,1,M.PATH);}
    rect(24,80,12,2,M.WOOD_DK); for(let x=26;x<35;x+=3) put(x,80,M.STONE_LT);
    // vending machine and bicycle silhouette
    rect(57,51,8,24,M.WOOD_DK); rect(58,52,6,18,M.CLOUD); rect(59,54,4,6,M.GLASS_HI); rect(59,63,4,2,M.LIT);
    for(let x of [84,101]){for(let a=0;a<360;a+=30){const rad=a*Math.PI/180;put(Math.round(x+4*Math.cos(rad)),Math.round(78+4*Math.sin(rad)),M.WOOD_DK);} }
    rect(88,75,10,1,M.WOOD_DK); rect(91,72,4,4,M.WOOD_DK); rect(95,72,4,1,M.WOOD_DK);
    // Second-floor balconies, tiled roof edges, shop sign typography and alley depth
    rect(2,13,49,5,M.WOOD_DK); rect(4,14,45,2,M.ROOF_LT);
    for(let x=6;x<49;x+=7){rect(x,8,4,5,M.WALL_SH);rect(x+1,9,2,3,M.GLASS);put(x+2,10,M.GLASS_HI);}
    rect(3,47,48,2,M.WOOD_DK); for(let x=5;x<50;x+=5) rect(x,48,1,5,M.WOOD_LT);
    rect(6,53,44,2,M.WOOD_DK); rect(10,24,34,7,M.WOOD_DK);
    for(let x=12;x<43;x+=4){put(x,26,M.LIT_HI);put(x+1,27,M.LIT);}
    // Ramen shop noren, menu board and noren tassels
    rect(143,30,43,7,M.WOOD_DK); rect(146,31,37,4,M.LIT_DK);
    for(let x=148;x<181;x+=6){rect(x,39,4,7,M.CLOUD);put(x+1,46,M.CLOUD_SH);}
    rect(184,38,5,18,M.WOOD_DK); for(let y=40;y<54;y+=3) put(186,y,M.LIT_HI);
    // Rooftop water tank, satellite dish and dense utility cables
    rect(82,7,13,7,M.STONE); rect(84,5,9,2,M.STONE_LT); rect(85,9,7,3,M.WOOD_DK);
    rect(101,9,2,5,M.WOOD_DK); rect(98,8,8,1,M.WOOD_DK); rect(100,6,4,2,M.STONE_LT);
    for(let x=0;x<CORE_W;x+=1){const sag=Math.round(10+Math.sin(x/CORE_W*Math.PI)*5);if(x%3===0)put(x,sag,M.WOOD_DK);if(x%11===0)put(x,sag+1,M.WOOD_DK);}
    // Street utility boxes, bollards, storm drain and manhole
    rect(4,76,8,8,M.WOOD_DK);rect(5,77,6,5,M.STONE);for(let y=78;y<82;y+=2)rect(6,y,4,1,M.WOOD_DK);
    for(let x=4;x<CORE_W;x+=48){rect(x,83,2,8,M.STONE);put(x,83,M.STONE_LT);}
    rect(148,91,16,5,M.WOOD_DK);rect(150,92,12,2,M.STONE);for(let x=151;x<162;x+=3)put(x,93,M.WOOD_DK);
    // More road perspective and wet-pavement glints
    for(let y=99;y<111;y+=4){for(let x=(y*3)%17;x<CORE_W;x+=29)rect(x,y,5+(y%3),1,M.STONE);}
    for(let x=18;x<CORE_W;x+=31){put(x,88,M.CLOUD_SH);put(x+1,89,M.CLOUD_SH);}
    // Planters and small street tree
    rect(26,69,13,5,M.WOOD_DK);rect(28,67,9,2,M.STONE);for(let x=29;x<37;x+=2){put(x,65-(x%3),M.LEAF2);put(x+1,67,M.LEAF1);}
    rect(187,64,5,11,M.WOOD_DK);rect(188,61,3,4,M.LEAF1);put(187,62,M.LEAF2);put(191,63,M.LEAF2);
  };
  const paintApartment = () => {
    rect(0,0,CORE_W,78,M.WALL); rect(0,78,CORE_W,34,M.PLANK);
    for(let y=4;y<76;y+=12) rect(0,y,CORE_W,1,M.WALL_SH);
    // large city window
    rect(12,12,68,52,M.WOOD_DK); rect(15,15,62,46,M.GLASS);
    rect(44,15,2,46,M.WOOD_DK); rect(15,37,62,2,M.WOOD_DK);
    // distant city skyline through glass
    rect(17,42,58,18,M.CLOUD_SH);
    rect(20,32,8,28,M.STONE); rect(31,25,10,35,M.STONE_LT); rect(49,35,9,25,M.STONE); rect(63,29,10,31,M.STONE_LT);
    for(let x=21;x<28;x+=3) for(let y=36;y<57;y+=6) put(x,y,M.LIT);
    for(let x=33;x<40;x+=3) for(let y=29;y<57;y+=6) put(x,y,M.LIT);
    for(let x=51;x<57;x+=3) for(let y=39;y<57;y+=6) put(x,y,M.LIT);
    for(let x=65;x<72;x+=3) for(let y=33;y<57;y+=6) put(x,y,M.LIT);
    // curtains
    rect(9,10,5,57,M.WOOD); rect(78,10,5,57,M.WOOD);
    for(let y=12;y<65;y+=4){put(10,y,M.WOOD_LT);put(80,y,M.WOOD_LT);}
    // sofa and coffee table
    rect(91,59,63,8,M.WOOD_DK); rect(94,54,57,12,M.SHIRT_DK); rect(97,51,50,10,M.SHIRT);
    rect(89,63,6,12,M.WOOD_DK); rect(151,63,6,12,M.WOOD_DK);
    rect(105,76,42,4,M.WOOD_DK); rect(108,80,3,8,M.WOOD); rect(141,80,3,8,M.WOOD);
    rect(112,72,27,4,M.WOOD_LT); rect(119,69,12,3,M.BOOK);
    // floor lamp, framed art and indoor plant
    rect(169,25,2,47,M.WOOD_DK); rect(164,21,12,5,M.LIT); rect(166,22,8,2,M.LIT_HI);
    rect(160,72,20,2,M.WOOD_DK); rect(162,68,16,4,M.WOOD);
    rect(23,69,19,2,M.WOOD_DK); rect(25,53,15,14,M.WOOD_DK); rect(27,55,11,10,M.CLOUD);
    rect(26,84,11,10,M.WOOD_DK); rect(24,92,15,3,M.WOOD);
    for(let i=0;i<5;i++){put(31+i*2,83-i*2,M.LEAF2);put(29-i,85-i*2,M.LEAF1);}
    // rug and small details
    rect(78,91,89,10,M.SHIRT_DK); rect(82,93,81,6,M.SHIRT);
    rect(12,103,168,1,M.WOOD_DK);
    // Architectural trim and ceiling coving
    rect(0,5,CORE_W,2,M.WOOD_DK);rect(0,7,CORE_W,1,M.WOOD_LT);
    rect(86,12,2,47,M.WOOD_DK);rect(88,12,1,47,M.WOOD_LT);
    // Gallery wall: framed print, clock and floating shelf
    rect(96,12,22,20,M.WOOD_DK);rect(98,14,18,16,M.CLOUD_SH);
    rect(100,16,14,12,M.HILL_FAR);rect(100,24,14,4,M.HILL_NEAR);
    rect(103,18,3,5,M.LEAF1);put(106,17,M.LEAF2);put(109,19,M.LEAF2);
    rect(126,16,12,12,M.WOOD_DK);rect(128,18,8,8,M.CLOUD);
    put(132,21,M.WOOD_DK);put(132,23,M.WOOD_DK);
    rect(94,34,48,2,M.WOOD_DK);rect(99,36,4,2,M.WOOD_LT);rect(132,36,7,2,M.WOOD_LT);
    // Media console and television
    rect(91,43,42,8,M.WOOD_DK);rect(94,45,36,5,M.WOOD);
    rect(103,29,25,14,M.WOOD_DK);rect(105,31,21,10,M.GLASS);rect(107,33,17,6,M.HILL_FAR);
    put(115,36,M.LIT_HI);rect(108,43,15,1,M.WOOD_LT);
    // Cushions, seams, throw blanket and side table on sofa
    rect(99,54,11,7,M.SHIRT_DK);rect(101,55,7,4,M.SHIRT);
    rect(134,54,12,7,M.SHIRT_DK);rect(136,55,8,4,M.SHIRT);
    for(let x=99;x<149;x+=7)put(x,64,M.SHIRT_DK);
    rect(154,60,12,12,M.WOOD_DK);rect(156,62,8,7,M.WOOD);
    rect(158,59,4,2,M.CLOUD);put(159,58,M.LIT_HI);
    // Bookshelf with books and a small speaker
    rect(4,28,19,45,M.WOOD_DK);rect(6,31,15,2,M.WOOD_LT);rect(6,48,15,2,M.WOOD_LT);
    for(let x=7;x<20;x+=4){rect(x,34,2,12,M.BOOK);rect(x+2,36,1,10,M.BOOK_DK);}
    rect(7,52,5,10,M.WOOD);rect(13,54,6,8,M.BOOK);
    rect(17,66,5,7,M.WOOD_DK);rect(18,67,3,4,M.GLASS);
    // Kitchen counter, backsplash and hanging pendant
    rect(4,78,53,3,M.WOOD_DK);rect(7,81,47,10,M.WOOD);
    rect(9,73,44,5,M.STONE);rect(12,74,12,3,M.CLOUD);
    rect(39,75,10,3,M.WOOD_DK);rect(42,71,4,4,M.GLASS);
    rect(34,10,2,9,M.WOOD_DK);rect(30,18,10,3,M.LIT);rect(32,19,6,2,M.LIT_HI);
    // Floorboards, rug border and woven rug pattern
    for(let y=84;y<111;y+=5)rect(0,y,CORE_W,1,M.WOOD_DK);
    for(let x=10;x<CORE_W;x+=24)rect(x,84,1,28,M.WOOD_DK);
    rect(78,89,89,2,M.WOOD_DK);rect(78,101,89,2,M.WOOD_DK);
    for(let x=86;x<161;x+=8){put(x,95,M.SHIRT_DK);put(x+3,97,M.SHIRT_DK);}
    // Plant leaves, pot highlights and lamp pull chain
    rect(26,94,11,2,M.BRICK);rect(28,96,7,3,M.BRICK_LT);
    for(let i=0;i<7;i++){put(30+i*2,82-i%3*2,M.LEAF3);put(28+i*2,86-i%4*2,M.LEAF2);}
    rect(170,27,1,28,M.WOOD_LT);put(171,55,M.WOOD_DK);
  };
  const paintSeaside = () => {
    // ocean band and distant islands
    rect(0,48,CORE_W,36,M.CLOUD); rect(0,82,CORE_W,30,M.PATH);
    for(let y=52;y<82;y+=5){for(let x=(y%2)*7;x<CORE_W;x+=24){rect(x,y,8+(x%3),1,M.CLOUD_SH);}}
    rect(0,46,48,5,M.HILL_FAR); rect(142,43,50,7,M.HILL_NEAR);
    // sandy beach and shoreline
    rect(0,83,CORE_W,29,M.PATH); for(let y=84;y<112;y+=5) for(let x=(y%3)*4;x<CORE_W;x+=19) put(x,y,M.STONE_LT);
    for(let x=0;x<CORE_W;x++){const shore=82+Math.round(Math.sin(x*.055)*2);put(x,shore,M.CLOUD_SH);if(x%3===0)put(x,shore+1,M.STONE_LT);}
    // lighthouse on rocky point
    rect(145,34,31,9,M.STONE); rect(151,16,18,27,M.WALL); rect(149,14,22,4,M.WOOD_DK);
    rect(153,19,14,3,M.WOOD_LT); rect(155,23,10,17,M.WALL_SH);
    rect(155,27,10,7,M.GLASS); rect(157,28,6,4,M.LIT_HI);
    rect(154,10,12,4,M.ROOF); rect(157,7,6,3,M.LIT); rect(159,3,2,4,M.LIT_HI);
    rect(144,41,34,3,M.STONE_LT); rect(148,44,28,2,M.STONE);
    // sailboat
    rect(49,56,2,18,M.WOOD_DK); rect(51,58,13,12,M.CLOUD); rect(39,70,31,3,M.WOOD_DK);
    rect(42,73,25,2,M.WOOD); rect(52,60,1,9,M.WOOD_DK);
    // beach umbrella, towel and rocks
    rect(25,77,2,18,M.WOOD_DK); rect(17,73,18,4,M.ROOF); rect(20,70,12,3,M.ROOF_LT);
    rect(8,96,28,5,M.SHIRT); rect(11,98,22,1,M.SHIRT_DK);
    paintBush(101,91,10,5,440); paintBush(186,87,12,6,441);
    rect(115,101,19,5,M.STONE); rect(117,99,15,2,M.STONE_LT);
    // small palm at edge
    for(let y=52;y<82;y++){const x=16+Math.round((y-52)*.18);put(x,y,M.BARK);}
    for(const [dx,dy] of [[-13,-4],[-9,-9],[-3,-12],[5,-11],[12,-6],[15,-1]]) for(let i=0;i<7;i++) put(16+dx+Math.round(i*dx*.08),52+dy+Math.round(i*.35),M.LEAF2);
    // Palm fronds with layered highlights and a textured trunk
    for(let y=55;y<82;y+=3){put(16+Math.round((y-52)*.18)-1,y,M.BARK_LT);put(16+Math.round((y-52)*.18)+1,y,M.BARK);}
    for(let x=0;x<CORE_W;x+=1){const wave=83+Math.round(Math.sin(x*.11)*2);if(x%2===0)put(x,wave,M.CLOUD);if(x%7===0)put(x,wave+2,M.CLOUD_SH);}
    // Multiple ocean bands, foam streaks and distant wave crests
    for(let y=53;y<80;y+=3){for(let x=(y*7)%21;x<CORE_W;x+=27){rect(x,y,5+(x%5),1,M.CLOUD_SH);if(y%2===0)put(x+2,y-1,M.CLOUD);}}
    for(let x=5;x<CORE_W;x+=17){put(x,61+(x%5),M.CLOUD);put(x+1,62+(x%5),M.CLOUD_SH);}
    // Lighthouse masonry bands, windows, balcony rail and lantern room
    for(let y=20;y<41;y+=5){rect(152,y,16,1,M.WOOD_LT);for(let x=153+(y%3);x<168;x+=6)put(x,y+1,M.STONE_LT);}
    rect(150,12,20,2,M.WOOD_DK);rect(152,9,16,3,M.GLASS);rect(154,10,12,1,M.LIT_HI);
    rect(149,7,22,2,M.WOOD_DK);rect(151,5,18,2,M.ROOF_LT);
    rect(150,17,20,1,M.WOOD_DK);for(let x=151;x<170;x+=3)put(x,16,M.WOOD_LT);
    rect(154,29,12,7,M.GLASS);rect(156,30,8,5,M.LIT);put(159,31,M.LIT_HI);
    rect(153,38,14,2,M.WOOD_DK);rect(155,40,10,3,M.STONE);
    // Rocky headland and a winding footpath to the lighthouse
    rect(137,43,43,4,M.STONE);rect(141,47,34,3,M.STONE_LT);
    for(let y=49;y<84;y+=3){const x=147-Math.floor((y-49)*.35);rect(x,y,26,2,y%2?M.STONE:M.HILL_NEAR);}
    for(let i=0;i<8;i++){put(139+i*4,47+i%3,M.CLOUD_SH);put(175-i*3,50+i%4,M.STONE_LT);}
    // Wooden pier, posts, rope and mooring rings
    rect(63,82,58,3,M.WOOD_DK);rect(66,83,52,1,M.WOOD_LT);
    for(let x=68;x<119;x+=8){rect(x,85,2,10,M.WOOD_DK);put(x,86,M.WOOD_LT);}
    rect(64,80,2,2,M.WOOD_DK);rect(118,80,2,2,M.WOOD_DK);
    // Boat cabin, rigging, mast flag and hull planks
    rect(43,68,26,2,M.WOOD_DK);rect(46,65,19,3,M.WOOD);rect(49,62,12,3,M.WOOD_DK);
    rect(51,58,2,13,M.WOOD_DK);rect(53,58,1,12,M.WOOD_LT);
    for(let x=45;x<67;x+=5)put(x,71,M.WOOD_LT);
    rect(53,55,7,2,M.CLOUD);put(60,55,M.ROOF);
    // Beach details: deck chair, shell, driftwood and dune grass
    rect(6,87,18,2,M.WOOD_DK);rect(8,89,2,7,M.WOOD_DK);rect(21,89,2,7,M.WOOD_DK);
    rect(9,88,12,3,M.SHIRT);rect(12,91,7,2,M.SHIRT_DK);
    put(42,98,M.CLOUD);put(43,97,M.CLOUD_SH);put(44,98,M.CLOUD);
    rect(128,102,15,2,M.WOOD_DK);put(130,100,M.WOOD_LT);put(137,99,M.WOOD_LT);
    for(let x=0;x<CORE_W;x+=13){put(x,87+(x%4),M.LEAF1);put(x+2,85+(x%5),M.LEAF2);}
    // Reflected sunlight on wet sand
    for(let y=88;y<109;y+=6){for(let x=(y*5)%23;x<CORE_W;x+=31)rect(x,y,7,1,M.LIT_DK);}
  };
  const paintMountainCabin = () => {
    rect(0,0,CORE_W,112,0);
    // layered mountain silhouettes
    for(let x=0;x<CORE_W;x++){
      const a=35+Math.round(Math.sin(x*.045)*9+Math.sin(x*.11)*4);
      const b=50+Math.round(Math.sin(x*.035+1.7)*8+Math.sin(x*.08)*3);
      for(let y=a;y<68;y++) put(x,y,M.HILL_FAR);
      for(let y=b;y<77;y++) put(x,y,M.HILL_NEAR);
    }
    // snow caps
    for(let x=0;x<CORE_W;x++){const peak=35+Math.round(Math.sin(x*.045)*9+Math.sin(x*.11)*4);if(x%2===0){put(x,peak,M.CLOUD);put(x,peak+1,M.CLOUD_SH);}}
    rect(0,77,CORE_W,35,M.GRASS_DK);
    for(let y=82;y<112;y+=7) for(let x=(y%2)*5;x<CORE_W;x+=18) put(x,y,M.STONE_LT);
    // pines
    const pine=(cx,base,h)=>{rect(cx-1,base-h,3,h,M.BARK);for(let j=0;j<4;j++){const yy=base-h+j*Math.floor(h/4);const w=3+j*3;for(let y=yy;y<yy+Math.floor(h/4)+2;y++)for(let x=cx-w;x<=cx+w;x++)if(Math.abs(x-cx)<=w-(y-yy)*.45)put(x,y,j%2?M.LEAF1:M.LEAF0);}};
    pine(18,91,37);pine(34,88,28);pine(178,94,42);pine(160,89,27);pine(116,86,22);
    // wooden cabin
    rect(66,55,62,35,M.WALL); for(let y=60;y<88;y+=5)rect(66,y,62,1,M.WOOD);
    for(let y=34;y<57;y++){const t=(y-34)/23;for(let x=Math.round(58+t*8);x<=136-Math.round(t*8);x++)put(x,y,M.ROOF);}
    rect(57,53,80,4,M.WOOD_DK); rect(88,67,17,23,M.WOOD_DK);rect(90,69,13,21,M.WOOD);
    rect(71,65,13,12,M.GLASS);rect(73,67,9,8,M.LIT);rect(77,65,2,12,M.WOOD_DK);
    rect(111,64,12,13,M.GLASS);rect(112,65,10,3,M.GLASS_HI);
    rect(87,90,20,3,M.STONE);rect(83,93,28,2,M.STONE_LT);
    // chimney and smoke
    rect(115,34,8,17,M.BRICK);rect(113,32,12,3,M.STONE_LT);
    // Jagged distant peaks with layered snow shelves and exposed rock
    for(let x=0;x<CORE_W;x+=1){const peak=35+Math.round(Math.sin(x*.045)*9+Math.sin(x*.11)*4);if(x%3===0){put(x,peak+3,M.CLOUD);put(x+1,peak+5,M.CLOUD_SH);}}
    for(let x=0;x<CORE_W;x+=17){const y=44+(x%5);rect(x,y,5,2,M.HILL_FAR);put(x+2,y-1,M.CLOUD);}
    // Pine boughs, trunks and snow caught on branches
    const snowPine=(cx,base,h)=>{for(let j=0;j<5;j++){const yy=base-h+j*Math.floor(h/5);const w=3+j*3;for(let x=cx-w;x<=cx+w;x++){if(Math.abs(x-cx)<=w){put(x,yy+1,M.LEAF2);if((x+yy)%3===0)put(x,yy+2,M.CLOUD_SH);}}}rect(cx,base-h,1,h,M.WOOD_DK);};
    snowPine(48,91,30);snowPine(145,92,34);snowPine(190,90,29);snowPine(8,94,26);
    // Cabin log courses, corner joinery and stone foundation
    for(let y=58;y<89;y+=4){rect(67,y,60,1,M.WOOD_DK);for(let x=70+(y%3);x<124;x+=13)put(x,y+1,M.WOOD_LT);}
    rect(63,87,68,5,M.STONE);for(let x=66;x<128;x+=8)put(x,89,M.STONE_LT);
    // Porch roof, posts, railings and steps
    rect(78,51,48,3,M.WOOD_DK);rect(82,48,40,3,M.ROOF_LT);
    rect(81,53,2,35,M.WOOD_DK);rect(123,53,2,35,M.WOOD_DK);
    rect(80,78,45,2,M.WOOD_LT);for(let x=84;x<123;x+=7)rect(x,72,1,8,M.WOOD_DK);
    rect(88,91,18,2,M.WOOD_DK);rect(86,93,23,2,M.STONE_LT);rect(83,95,29,2,M.STONE);
    // Window shutters, warm panes and window boxes
    rect(69,63,16,15,M.WOOD_DK);rect(71,65,12,11,M.GLASS);
    rect(73,67,8,7,M.LIT);rect(77,65,2,11,M.WOOD_DK);
    rect(67,62,3,17,M.WOOD);rect(84,62,3,17,M.WOOD);
    rect(69,79,16,2,M.WOOD_DK);for(let x=71;x<84;x+=3)put(x,78,M.LEAF2);
    rect(108,61,17,17,M.WOOD_DK);rect(110,63,13,13,M.GLASS);
    rect(112,65,9,9,M.LIT_DK);rect(116,64,2,12,M.WOOD_DK);
    // Firewood stack, lantern, mailbox and snow-covered stones
    rect(133,82,18,5,M.WOOD_DK);for(let y=83;y<87;y+=2)for(let x=135+(y%3);x<149;x+=6)rect(x,y,5,1,M.WOOD);
    rect(154,76,2,12,M.WOOD_DK);rect(151,74,8,3,M.LIT);put(155,75,M.LIT_HI);
    rect(55,84,7,5,M.WOOD_DK);rect(56,82,5,3,M.BRICK_LT);put(58,81,M.LIT_HI);
    // Snowdrifts, tracks and scattered blue-white snow sparkle
    for(let x=0;x<CORE_W;x+=1){const drift=96+Math.round(Math.sin(x*.07)*2+Math.sin(x*.19));if(x%2===0)put(x,drift,M.CLOUD);if(x%5===0)put(x,drift+1,M.CLOUD_SH);}
    for(let i=0;i<7;i++){rect(112+i*3,99+i%2*2,2,1,M.CLOUD_SH);put(114+i*3,97+i%3,M.CLOUD);}
    for(let x=3;x<CORE_W;x+=29){put(x,107,M.CLOUD);put(x+1,106,M.CLOUD_SH);}
  };
  const scene = ['countryside','japanese-street','apartment','seaside','mountain-cabin'].includes(dataset.scene) ? (dataset.scene || 'countryside') : 'countryside';
  let sceneAnim = 0;
  const drawSceneResident = (dt) => {
    if (!calm) sceneAnim += dt;
    if (scene === 'apartment') {
      const pose = Math.sin(sceneAnim * 0.6) > 0.85 ? SPR.seatBlink : SPR.seat;
      blit(pose, 128, 61);
      return;
    }
    const x = scene === 'japanese-street' ? 104 + Math.sin(sceneAnim * 0.18) * 20 : scene === 'seaside' ? 104 : 91;
    const y = scene === 'seaside' ? 82 : 88;
    const moving = !calm && scene !== 'seaside';
    const sprite = moving ? SPR.walk[Math.floor(sceneAnim * 3) % 4] : SPR.stand;
    blit(sprite, Math.round(x)-3, y-12, Math.sin(sceneAnim * 0.18) < 0);
  };

  const buildBase = () => {
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
    const h = hourOf(clock); if (!calm) anim += dt; matBuf.set(baseBuf); varBuf.fill(0); emitList.length = 0;
    for (const c of sources) { c.w = 0; c.x = 0; c.y = 0; }
    lampFlick = calm ? 1 : 0.95 + 0.05 * Math.sin(anim * 13) * Math.sin(anim * 5.3);
    if (!calm) { birds.next -= dt; if (birds.t >= 0) { birds.t += dt; if (birds.t > 9) birds.t = -1; } else if (birds.next <= 0) { birds.t = 0; birds.next = 12 + Math.random() * 14; birds.y = 10 + Math.random() * 24; birds.dir = Math.random() < 0.5 ? 1 : -1; } shoot.next -= dt; if (shoot.t >= 0) { shoot.t += dt; if (shoot.t > 0.6) shoot.t = -1; } else if (shoot.next <= 0) { shoot.t = 0; shoot.next = 9 + Math.random() * 16; shoot.x = 10 + Math.random() * 130; shoot.y = 2 + Math.random() * 20; } }
    drawSky(h); if (scene === 'countryside') { const plan = stepResident(dt, h, hurry); drawShadows(h); const state = drawWindow(h); drawDoor(); drawLights(state, h); drawResident(plan, h); drawCanopy(); drawParticles(h, dt); } else { drawSceneResident(dt); drawParticles(h, dt); }
    pickKeys(h); const ta = table[keyA]; const tb = table[keyB]; const sa = skyKeys[keyA]; const sb = skyKeys[keyB]; const p = keyP * 16; const n = bw * bh;
    for (let i = 0; i < n; i++) { const m = matBuf[i]; const useB = thrA[i] < p; const idx = m === 0 ? (useB ? sb[i] : sa[i]) : (useB ? tb : ta)[varBuf[i] * NM + m]; pixels[i] = palette32[idx]; }
  };
  const GRID_W = 72; let GRID_H = 44; let glowRaw = new Float32Array(1); let glowNearBuf = new Float32Array(1); let glowFarBuf = new Float32Array(1); let glowTemp = new Float32Array(1);
  const boxBlur = (src, dst, w, h, r) => { const size = r * 2 + 1; for (let y = 0; y < h; y++) { const row = y * w * 4; for (let c = 0; c < 3; c++) { let sum = 0; for (let x = -r; x <= r; x++) sum += src[row + clamp(x, 0, w - 1) * 4 + c]; for (let x = 0; x < w; x++) { dst[row + x * 4 + c] = sum / size; sum += src[row + clamp(x + r + 1, 0, w - 1) * 4 + c] - src[row + clamp(x - r, 0, w - 1) * 4 + c]; } } } for (let x = 0; x < w; x++) { for (let c = 0; c < 3; c++) { let sum = 0; for (let y = -r; y <= r; y++) sum += dst[clamp(y, 0, h - 1) * w * 4 + x * 4 + c]; for (let y = 0; y < h; y++) { src[y * w * 4 + x * 4 + c] = sum / size; sum += dst[clamp(y + r + 1, 0, h - 1) * w * 4 + x * 4 + c] - dst[clamp(y - r, 0, h - 1) * w * 4 + x * 4 + c]; } } } };
  let gl = null;
  try { gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'high-performance' }); } catch { gl = null; }
  let program = null; const loc = {}; let vao = null; let quad = null; let texWorld = null; let texNear = null;
  const compile = (type, source) => { const s = gl.createShader(type); gl.shaderSource(s, source); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader'); return s; };
  const setupGl = () => {
    if (!gl) return false;
    try { program = gl.createProgram(); const v = compile(gl.VERTEX_SHADER, VERT); const f = compile(gl.FRAGMENT_SHADER, FRAG); gl.attachShader(program, v); gl.attachShader(program, f); gl.bindAttribLocation(program, 0, 'aPos'); gl.linkProgram(program); gl.deleteShader(v); gl.deleteShader(f); if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'link'); } catch (error) { console.warn('cannot create shader', error); return false; }
    gl.useProgram(program);
    for (const name of ['uWorld', 'uGlowNear', 'uRes', 'uPill', 'uOrigin', 'uWorldSize', 'uGlowSize', 'uLens', 'uBezel', 'uK', 'uNight', 'uLift', 'uSeam', 'uCalm', 'uRefraction', 'uDispersion', 'uShine', 'uShellDay', 'uShellNight', 'uInk', 'uLight', 'uHiNight', 'uLoNight', 'uSkyDay', 'uHomeCol', 'uSkyCol', 'uHomePos', 'uSkyPos']) { loc[name] = gl.getUniformLocation(program, name); }
    vao = gl.createVertexArray(); gl.bindVertexArray(vao); quad = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, quad); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    const makeTex = () => { const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); return t; };
    texWorld = makeTex(); texNear = makeTex(); gl.uniform1i(loc.uWorld, 0); gl.uniform1i(loc.uGlowNear, 1); gl.disable(gl.BLEND); return true;
  };
  let ready = setupGl(); let lost = !ready && !!gl && gl.isContextLost(); let ctx2d = null; let lowCanvas = null;
  const useCanvas2d = () => { const fresh = canvas.cloneNode(false); canvas.replaceWith(fresh); canvas = fresh; ctx2d = canvas.getContext('2d'); };
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
  const phaseName = (h) => (h < 5 || h >= 20 ? '夜' : h < 7 ? '夜明け' : h < 10 ? '朝' : h < 16.5 ? '昼' : '夕方');
  const commit = (value) => {
    const night = value >= 1; x = night ? 1 : 0; velocity = 0; moving = false;
    if (night) { nightClock = branch === 'am' ? amStart : CLOCK_NIGHT; branch = 'pm'; } else { branch = 'pm'; }
    if (checked !== night) { checked = night; button.setAttribute('aria-checked', String(night)); root.dispatchEvent(new CustomEvent('daylight:change', { bubbles: true, composed: true, detail: { night } })); }
    setStatus(night ? '夜' : '昼');
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
  return () => { stopDrawing(); clearTimeout(restoreTimer); visible = false; io.disconnect(); ro.disconnect(); for (const off of cleanups) off(); if (gl && ready) { gl.deleteProgram(program); gl.deleteBuffer(quad); gl.deleteVertexArray(vao); gl.deleteTexture(texWorld); gl.deleteTexture(texNear); const lose = gl.getExtension('WEBGL_lose_context'); if (lose) lose.loseContext(); } };
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
    const label = root.getAttribute('data-label') || (lang.indexOf('zh') === 0 ? '昼夜开关' : 'Day/night switch');
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
    return null;
  }
}
function unmountOne(root) {
  const destroy = mounted.get(root);
  if (destroy) { destroy(); mounted.delete(root); }
}
function mountAll() { document.querySelectorAll(SELECTOR).forEach(mountOne); }
const api = { mount: mountOne, unmount: unmountOne };
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountAll, { once: true });
  else mountAll();
}
if (typeof window !== 'undefined') window.PixelDaylightSwitch = api;
if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
