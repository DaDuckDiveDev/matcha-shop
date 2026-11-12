// 一服 The bowl. A chawan seen from above, filled with matcha you can whisk.
//
// The liquid is a real fluid simulation (incompressible Navier–Stokes on the
// GPU, WebGL2): moving a finger or the cursor through it pushes the tea and
// raises foam, the way a bamboo chasen does. The ceramic, the light and the
// foam are all drawn in one fragment shader, so there is no image to load.
//
// createBowl(canvas, options) returns null when WebGL2 or float render
// targets are missing; the caller then leaves the CSS fallback in place.

const SIM = 128;          // velocity grid
const PRESSURE_ITER = 16;
const R_LIQ = 0.80;       // radius of the tea surface, in bowl units (rim = 1)

const VERT = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aPos;
uniform vec2 uTexel;
out vec2 vUv; out vec2 vL; out vec2 vR; out vec2 vT; out vec2 vB;
void main() {
  vUv = aPos * 0.5 + 0.5;
  vL = vUv - vec2(uTexel.x, 0.0); vR = vUv + vec2(uTexel.x, 0.0);
  vT = vUv + vec2(0.0, uTexel.y); vB = vUv - vec2(0.0, uTexel.y);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const HEAD = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB;
out vec4 o;
float wall(vec2 uv) { return length(uv - 0.5) * 2.0; }
float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p) { float a = 0.5, s = 0.0; for (int i = 0; i < 5; i++) { s += a * noise(p); p = p * 2.03 + 17.1; a *= 0.5; } return s; }
`;

const FRAG = {
  splat: `${HEAD}
uniform sampler2D uTarget; uniform vec2 uPoint; uniform vec3 uColor; uniform float uRadius;
void main() {
  vec2 p = vUv - uPoint;
  o = vec4(texture(uTarget, vUv).xyz + uColor * exp(-dot(p, p) / uRadius), 1.0);
}`,
  advect: `${HEAD}
uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 uVelTexel;
uniform float uDt; uniform float uDissipation; uniform float uMode; // 0 velocity, 1 dye
uniform float uBase; uniform float uSeed;
void main() {
  vec2 coord = vUv - uDt * texture(uVelocity, vUv).xy * uVelTexel;
  vec4 r = texture(uSource, coord);
  if (uMode < 0.5) {
    r.xy /= 1.0 + uDissipation * uDt;
    r.xy *= 1.0 - smoothstep(0.88, 1.0, wall(vUv));
  } else {
    // foam settles towards the level the whisking has earned; the marbling
    // slowly finds its grain again, the way bubbles regroup in a still bowl
    float grain = fbm(vUv * 5.0 + uSeed);
    float veins = fbm(vUv * 3.2 + uSeed * 1.7 + 31.0) - 0.5;
    r.r = mix(r.r, uBase * (0.80 + 0.40 * grain), 1.0 - exp(-uDt * 0.30));
    r.g = mix(r.g, veins * 1.6, 1.0 - exp(-uDt * 0.07));
    r.r = clamp(r.r, 0.0, 1.45); r.g = clamp(r.g, -1.2, 1.2);
  }
  o = r;
}`,
  divergence: `${HEAD}
uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).x, R = texture(uVelocity, vR).x, T = texture(uVelocity, vT).y, B = texture(uVelocity, vB).y;
  vec2 C = texture(uVelocity, vUv).xy;
  if (wall(vL) > 1.0) L = -C.x; if (wall(vR) > 1.0) R = -C.x;
  if (wall(vT) > 1.0) T = -C.y; if (wall(vB) > 1.0) B = -C.y;
  o = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`,
  curl: `${HEAD}
uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).y, R = texture(uVelocity, vR).y, T = texture(uVelocity, vT).x, B = texture(uVelocity, vB).x;
  o = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`,
  vorticity: `${HEAD}
uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float uStrength; uniform float uDt;
void main() {
  float L = texture(uCurl, vL).x, R = texture(uCurl, vR).x, T = texture(uCurl, vT).x, B = texture(uCurl, vB).x, C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= uStrength * C; force.y *= -1.0;
  vec2 v = texture(uVelocity, vUv).xy + force * uDt;
  o = vec4(clamp(v, -1000.0, 1000.0), 0.0, 1.0);
}`,
  pressure: `${HEAD}
uniform sampler2D uPressure; uniform sampler2D uDivergence;
void main() {
  float C = texture(uPressure, vUv).x;
  float L = texture(uPressure, vL).x, R = texture(uPressure, vR).x, T = texture(uPressure, vT).x, B = texture(uPressure, vB).x;
  if (wall(vL) > 1.0) L = C; if (wall(vR) > 1.0) R = C; if (wall(vT) > 1.0) T = C; if (wall(vB) > 1.0) B = C;
  o = vec4((L + R + B + T - texture(uDivergence, vUv).x) * 0.25, 0.0, 0.0, 1.0);
}`,
  gradient: `${HEAD}
uniform sampler2D uPressure; uniform sampler2D uVelocity;
void main() {
  float C = texture(uPressure, vUv).x;
  float L = texture(uPressure, vL).x, R = texture(uPressure, vR).x, T = texture(uPressure, vT).x, B = texture(uPressure, vB).x;
  if (wall(vL) > 1.0) L = C; if (wall(vR) > 1.0) R = C; if (wall(vT) > 1.0) T = C; if (wall(vB) > 1.0) B = C;
  vec2 v = texture(uVelocity, vUv).xy - vec2(R - L, T - B);
  v *= 1.0 - smoothstep(0.92, 1.0, wall(vUv));
  o = vec4(v, 0.0, 1.0);
}`,
  seed: `${HEAD}
uniform float uSeed; uniform float uBase;
void main() {
  float grain = fbm(vUv * 5.0 + uSeed);
  float veins = fbm(vUv * 3.2 + uSeed * 1.7 + 31.0) - 0.5;
  o = vec4(uBase * (0.80 + 0.40 * grain), veins * 1.6, 0.0, 1.0);
}`,
  display: `${HEAD}
uniform sampler2D uDye; uniform vec2 uDyeTexel; uniform float uTime; uniform float uPx;
const float R_OUT = 0.985; const float R_LIP = 0.915; const float R_LIQ = ${R_LIQ.toFixed(3)};
const vec3 LIGHT = vec3(-0.46, 0.54, 0.70);

float worley(vec2 p) {
  vec2 i = floor(p), f = fract(p); float d = 1.0;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y));
    vec2 c = vec2(hash(i + g), hash(i + g + 7.7));
    d = min(d, length(g + c - f));
  }
  return d;
}

vec3 tea(vec2 p, float r) {
  vec2 uv = p / R_LIQ * 0.5 + 0.5;
  vec4 d = texture(uDye, uv);
  float f = d.r, tone = d.g;
  float hL = texture(uDye, uv - vec2(uDyeTexel.x, 0.0)).r, hR = texture(uDye, uv + vec2(uDyeTexel.x, 0.0)).r;
  float hB = texture(uDye, uv - vec2(0.0, uDyeTexel.y)).r, hT = texture(uDye, uv + vec2(0.0, uDyeTexel.y)).r;
  vec3 n = normalize(vec3((hL - hR) * 3.2, (hB - hT) * 3.2, 1.0));

  vec3 deep = vec3(0.070, 0.150, 0.022);
  vec3 mid = vec3(0.250, 0.420, 0.062);
  vec3 lite = vec3(0.430, 0.600, 0.150);
  vec3 cream = vec3(0.640, 0.760, 0.360);
  vec3 c = mix(deep, mid, smoothstep(0.02, 0.50, f));
  c = mix(c, lite, smoothstep(0.45, 1.00, f));
  c = mix(c, cream, smoothstep(1.00, 1.60, f) * 0.6);
  c *= 1.0 + 0.24 * tone;

  // micro-foam: a skin of tiny bubbles, finer and brighter where there is more foam
  float foam = smoothstep(0.25, 0.9, f);
  float cell = worley(p * 150.0 + tone * 2.0);
  float bubble = smoothstep(0.42, 0.10, cell);
  c *= 1.0 + foam * (bubble * 0.10 - 0.035);
  float big = worley(p * 46.0 + 9.0);
  float pick = step(0.88, hash(floor(p * 46.0 + 9.0)));
  c += foam * 0.035 * smoothstep(0.06, 0.0, abs(big - 0.26)) * pick;
  c *= 1.0 - 0.06 * (fbm(p * 26.0) - 0.5) * 2.0;

  float dif = clamp(dot(n, normalize(LIGHT)), 0.0, 1.0);
  c *= 0.62 + 0.52 * dif;
  vec3 h = normalize(normalize(LIGHT) + vec3(0.0, 0.0, 1.0));
  c += pow(max(dot(n, h), 0.0), 90.0) * 0.07 * foam;

  // the wall of the bowl shades the tea on the side the light comes from
  vec2 dir = p / max(r, 0.0001);
  float edge = smoothstep(R_LIQ - 0.16, R_LIQ, r);
  float lit = dot(dir, normalize(LIGHT.xy));
  c *= 1.0 - edge * (0.20 + 0.34 * smoothstep(-0.3, 1.0, lit));
  // meniscus: a thin bright line where the tea climbs the glaze
  c += vec3(0.10, 0.13, 0.04) * smoothstep(R_LIQ - 0.010, R_LIQ - 0.002, r) * smoothstep(0.3, -1.0, lit);
  // one soft gleam, the same one the logo carries
  vec2 g = p - vec2(-0.30, 0.34);
  c += vec3(0.95, 1.0, 0.80) * 0.030 * exp(-dot(g, g) / 0.05);
  return c;
}

vec3 clay(vec2 p, float r) {
  vec2 dir = p / max(r, 0.0001);
  float ang = atan(p.y, p.x);
  vec3 L = normalize(LIGHT);
  // kuro-raku: a soft black glaze, warmer where it is thin, with iron specks
  float streak = fbm(vec2(ang * 3.0, r * 9.0) + 4.0);
  float speck = smoothstep(0.80, 0.92, noise(p * 210.0)) * 0.5 + smoothstep(0.72, 0.9, noise(p * 70.0 + 3.0)) * 0.25;
  vec3 glaze = mix(vec3(0.0130, 0.0122, 0.0115), vec3(0.046, 0.034, 0.025), streak * streak);
  glaze += vec3(0.060, 0.044, 0.028) * speck * 0.5;
  vec3 h = normalize(L + vec3(0.0, 0.0, 1.0));
  vec3 c; vec3 n;
  if (r > R_LIP) {
    // the lip: a rounded edge, slightly uneven, as thrown by hand
    float t = (r - R_LIP) / (R_OUT - R_LIP);
    float a = (t - 0.40) * 2.7;
    n = normalize(vec3(dir * sin(a), cos(a)));
    float dif = clamp(dot(n, L), 0.0, 1.0);
    c = glaze * (0.35 + 2.4 * dif);
    c += vec3(0.085, 0.060, 0.040) * smoothstep(0.30, 0.44, t) * smoothstep(0.66, 0.50, t) * (0.2 + 0.8 * streak) * (0.4 + dif); // bare clay on the crown
    float sp = pow(max(dot(n, h), 0.0), 48.0);
    c += vec3(1.0, 0.95, 0.86) * (sp * 0.55 + pow(max(dot(n, h), 0.0), 8.0) * 0.035);
  } else {
    // the inside wall falls away towards the tea
    float t = (r - R_LIQ) / (R_LIP - R_LIQ); // 0 at the tea, 1 under the lip
    n = normalize(vec3(-dir * 0.84, 0.54));
    float dif = clamp(dot(n, L), 0.0, 1.0);
    c = glaze * (0.22 + 2.6 * dif) * mix(0.50, 1.0, t);
    c *= 1.0 - 0.55 * smoothstep(0.80, 1.0, t) * smoothstep(-0.2, 0.9, dot(dir, normalize(L.xy))); // the lip's own shadow
    c += vec3(0.020, 0.036, 0.008) * smoothstep(0.6, 0.0, t);            // green lifted off the tea
    float ring = smoothstep(0.07, 0.0, abs(t - 0.11 - 0.05 * fbm(vec2(ang * 5.0, 2.0))));
    c += vec3(0.050, 0.085, 0.020) * ring * (0.5 + 0.5 * fbm(vec2(ang * 11.0, 5.0)));  // the line the foam left
    c += vec3(1.0, 0.95, 0.88) * pow(max(dot(n, h), 0.0), 22.0) * 0.045;
  }
  return c;
}

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  // a bowl thrown by hand is never a perfect circle
  float ang = atan(p.y, p.x);
  float r = length(p) * (1.0 + 0.006 * sin(ang * 3.0 + 1.3) + 0.004 * sin(ang * 5.0 + 0.4));
  float alpha = 1.0 - smoothstep(R_OUT - uPx * 1.5, R_OUT, r);
  if (alpha <= 0.0) { o = vec4(0.0); return; }
  vec3 c = clay(p, max(r, R_LIQ));
  float rt = length(p);
  vec3 t = tea(p, rt);
  c = mix(t, c, smoothstep(R_LIQ - uPx, R_LIQ + uPx, rt));
  c = pow(max(c, 0.0), vec3(0.4545)) ;
  o = vec4(c * alpha, alpha);
}`
};

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src); gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { const log = gl.getShaderInfoLog(s); gl.deleteShader(s); throw new Error(log); }
  return s;
}

function program(gl, vs, fragSrc) {
  const p = gl.createProgram();
  gl.attachShader(p, vs); gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fragSrc));
  gl.bindAttribLocation(p, 0, 'aPos'); gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  const u = {};
  const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++) { const name = gl.getActiveUniform(p, i).name; u[name] = gl.getUniformLocation(p, name); }
  return { p, u };
}

export function createBowl(canvas, { dye = 384, reduced = false, onWork } = {}) {
  let gl;
  try {
    gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
  } catch { gl = null; }
  if (!gl) return null;
  if (!gl.getExtension('EXT_color_buffer_float') && !gl.getExtension('EXT_color_buffer_half_float')) return null;

  let P;
  try {
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    P = Object.fromEntries(Object.entries(FRAG).map(([k, src]) => [k, program(gl, vs, src)]));
  } catch (e) {
    if (import.meta.env?.DEV) console.warn('[bowl] shader', e);
    return null;
  }

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  function target(w, h, internal, format) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, gl.HALF_FLOAT, null);
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    gl.viewport(0, 0, w, h); gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT);
    return { tex, fbo, w, h, ok, texel: [1 / w, 1 / h] };
  }
  const double = (w, h, i, f) => {
    let a = target(w, h, i, f), b = target(w, h, i, f);
    return { get read() { return a; }, get write() { return b; }, swap() { const t = a; a = b; b = t; }, ok: a.ok && b.ok };
  };

  const velocity = double(SIM, SIM, gl.RG16F, gl.RG);
  const dyeT = double(dye, dye, gl.RGBA16F, gl.RGBA);
  const pressure = double(SIM, SIM, gl.R16F, gl.RED);
  const divergence = target(SIM, SIM, gl.R16F, gl.RED);
  const curl = target(SIM, SIM, gl.R16F, gl.RED);
  if (![velocity, dyeT, pressure, divergence, curl].every((t) => t.ok)) return null;

  let unit = 0;
  const use = (prog) => { gl.useProgram(prog.p); unit = 0; return prog.u; };
  const bind = (loc, t) => { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t.tex); gl.uniform1i(loc, unit); unit += 1; };
  const draw = (t) => {
    if (t) { gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo); gl.viewport(0, 0, t.w, t.h); }
    else { gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, canvas.width, canvas.height); }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  const seedValue = Math.random() * 40;
  let base = 0.10;        // the foam level the whisking has earned so far
  let work = 0;           // seconds of real whisking by the guest
  let time = 0;
  let lastInput = 0;
  let raf = 0, running = false, visible = true, dead = false, started = false;
  let last = 0;
  const queue = [];

  function seed() {
    const u = use(P.seed);
    gl.uniform2f(u.uTexel, dyeT.read.texel[0], dyeT.read.texel[1]);
    gl.uniform1f(u.uSeed, seedValue); gl.uniform1f(u.uBase, base);
    draw(dyeT.write); dyeT.swap();
  }

  function splat(x, y, dx, dy, foam) {
    let u = use(P.splat);
    gl.uniform2f(u.uTexel, velocity.read.texel[0], velocity.read.texel[1]);
    bind(u.uTarget, velocity.read);
    gl.uniform2f(u.uPoint, x, y); gl.uniform3f(u.uColor, dx, dy, 0); gl.uniform1f(u.uRadius, 0.0042);
    draw(velocity.write); velocity.swap();
    u = use(P.splat);
    gl.uniform2f(u.uTexel, dyeT.read.texel[0], dyeT.read.texel[1]);
    bind(u.uTarget, dyeT.read);
    gl.uniform2f(u.uPoint, x, y); gl.uniform3f(u.uColor, foam, (Math.random() - 0.5) * foam * 1.4, 0); gl.uniform1f(u.uRadius, 0.0030);
    draw(dyeT.write); dyeT.swap();
  }

  function step(dt) {
    while (queue.length) { const s = queue.shift(); splat(s[0], s[1], s[2], s[3], s[4]); }
    const vt = velocity.read.texel;

    let u = use(P.curl);
    gl.uniform2f(u.uTexel, vt[0], vt[1]); bind(u.uVelocity, velocity.read); draw(curl);

    u = use(P.vorticity);
    gl.uniform2f(u.uTexel, vt[0], vt[1]); bind(u.uVelocity, velocity.read); bind(u.uCurl, curl);
    gl.uniform1f(u.uStrength, 13); gl.uniform1f(u.uDt, dt); draw(velocity.write); velocity.swap();

    u = use(P.divergence);
    gl.uniform2f(u.uTexel, vt[0], vt[1]); bind(u.uVelocity, velocity.read); draw(divergence);

    u = use(P.pressure);
    gl.uniform2f(u.uTexel, vt[0], vt[1]);
    for (let i = 0; i < PRESSURE_ITER; i++) {
      unit = 0; bind(u.uPressure, pressure.read); bind(u.uDivergence, divergence);
      draw(pressure.write); pressure.swap();
    }

    u = use(P.gradient);
    gl.uniform2f(u.uTexel, vt[0], vt[1]); bind(u.uPressure, pressure.read); bind(u.uVelocity, velocity.read);
    draw(velocity.write); velocity.swap();

    u = use(P.advect);
    gl.uniform2f(u.uTexel, vt[0], vt[1]); gl.uniform2f(u.uVelTexel, vt[0], vt[1]);
    bind(u.uVelocity, velocity.read); bind(u.uSource, velocity.read);
    gl.uniform1f(u.uDt, dt); gl.uniform1f(u.uDissipation, 0.9); gl.uniform1f(u.uMode, 0);
    draw(velocity.write); velocity.swap();

    u = use(P.advect);
    gl.uniform2f(u.uTexel, dyeT.read.texel[0], dyeT.read.texel[1]); gl.uniform2f(u.uVelTexel, vt[0], vt[1]);
    bind(u.uVelocity, velocity.read); bind(u.uSource, dyeT.read);
    gl.uniform1f(u.uDt, dt); gl.uniform1f(u.uDissipation, 0); gl.uniform1f(u.uMode, 1);
    gl.uniform1f(u.uBase, base); gl.uniform1f(u.uSeed, seedValue);
    draw(dyeT.write); dyeT.swap();
  }

  function render() {
    const u = use(P.display);
    gl.uniform2f(u.uTexel, 0, 0);
    bind(u.uDye, dyeT.read);
    gl.uniform2f(u.uDyeTexel, dyeT.read.texel[0], dyeT.read.texel[1]);
    gl.uniform1f(u.uTime, time); gl.uniform1f(u.uPx, 2 / canvas.width);
    gl.disable(gl.BLEND);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  // ---- the hand that whisks ---------------------------------------------
  // One stroke: a point in tea coordinates (0..1 across the surface), how far
  // it moved, and how hard. Speed is what raises foam.
  function stroke(x, y, dx, dy, gain = 1) {
    const r = Math.hypot(x - 0.5, y - 0.5) * 2;
    if (r > 0.97) return;
    const speed = Math.hypot(dx, dy);
    if (speed < 1e-5) return;
    const force = 5200 * gain;
    queue.push([x, y, dx * force, dy * force, Math.min(0.20, speed * 3.5) * gain]);
    // a chasen has a hundred tines: scatter a little of the push around it
    const jx = (Math.random() - 0.5) * 0.05, jy = (Math.random() - 0.5) * 0.05;
    queue.push([x + jx, y + jy, -dy * force * 0.35, dx * force * 0.35, Math.min(0.10, speed * 2) * gain]);
    lastInput = time;
    wake();
  }

  // The opening: fast M-shaped strokes, then the slow の that tea people
  // finish with, lifting the whisk from the centre.
  const INTRO = 3.1;
  let introAt = -1;
  let introPrev = null;
  function introPoint(t) {
    if (t < 0.25) return null;
    if (t < 2.05) {
      const k = (t - 0.25) / 1.8;
      const sweep = Math.sin(k * Math.PI * 2 * 6.5);
      return [0.5 + 0.27 * sweep, 0.5 + 0.20 * Math.sin(k * Math.PI * 2 * 1.25 + 0.6) + 0.04 * Math.cos(k * 40)];
    }
    if (t < INTRO) {
      const k = (t - 2.05) / (INTRO - 2.05);
      const a = Math.PI * 0.75 - k * Math.PI * 2.15;
      const rad = 0.30 * (1 - k * k);
      return [0.5 + rad * Math.cos(a), 0.5 + rad * Math.sin(a)];
    }
    return null;
  }
  function playIntro(dt) {
    if (introAt < 0) return;
    introAt += dt;
    const pnt = introPoint(introAt);
    if (pnt && introPrev) stroke(pnt[0], pnt[1], pnt[0] - introPrev[0], pnt[1] - introPrev[1], introAt < 2.05 ? 0.55 : 0.4);
    introPrev = pnt;
    base = Math.min(0.72, 0.10 + 0.62 * Math.min(1, introAt / 2.4));
    if (introAt >= INTRO) { introAt = -1; introPrev = null; }
    lastInput = time;
  }

  function frame(now) {
    raf = 0;
    if (dead || !running) return;
    const dt = Math.min(1 / 30, Math.max(1 / 120, (now - last) / 1000 || 1 / 60));
    last = now;
    time += dt;
    playIntro(dt);
    step(dt);
    render();
    // nothing has touched the tea for a while: let it rest, and the battery too
    if (time - lastInput > 6 && introAt < 0) { running = false; return; }
    raf = requestAnimationFrame(frame);
  }
  function wake() {
    if (dead || running || !visible) return;
    running = true; last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = Math.max(64, Math.min(1400, Math.round(rect.width * dpr)));
    if (canvas.width !== size || canvas.height !== size) { canvas.width = size; canvas.height = size; }
    if (!running && !dead) render();
  }

  // ---- pointer -----------------------------------------------------------
  let prev = null;
  const toTea = (e) => {
    const rect = canvas.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const py = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    return [px / R_LIQ * 0.5 + 0.5, py / R_LIQ * 0.5 + 0.5];
  };
  const onMove = (e) => {
    const p = toTea(e);
    if (prev) {
      const dx = p[0] - prev[0], dy = p[1] - prev[1];
      const inside = Math.hypot(p[0] - 0.5, p[1] - 0.5) * 2 < 0.97;
      if (inside && Math.hypot(dx, dy) > 0.0015) {
        stroke(p[0], p[1], dx, dy, 1);
        work += Math.min(0.05, Math.hypot(dx, dy) * 0.35);
        base = Math.min(0.92, base + Math.hypot(dx, dy) * 0.012);
        onWork?.(work);
      }
    }
    prev = p;
  };
  const onLeave = () => { prev = null; };
  canvas.addEventListener('pointermove', onMove, { passive: true });
  canvas.addEventListener('pointerdown', (e) => { prev = toTea(e); }, { passive: true });
  canvas.addEventListener('pointerleave', onLeave, { passive: true });
  canvas.addEventListener('pointercancel', onLeave, { passive: true });
  canvas.addEventListener('pointerup', (e) => { if (e.pointerType !== 'mouse') prev = null; }, { passive: true });

  const onLost = (e) => { e.preventDefault(); dead = true; cancelAnimationFrame(raf); canvas.dispatchEvent(new CustomEvent('bowl:lost')); };
  canvas.addEventListener('webglcontextlost', onLost);

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible) { running = false; cancelAnimationFrame(raf); raf = 0; }
    else if (started && (time - lastInput <= 6 || introAt >= 0)) wake();
  }, { threshold: 0.05 });
  io.observe(canvas);

  seed();
  resize();

  // Run the simulation forward without drawing: used when motion is reduced,
  // so the guest gets the finished bowl rather than the performance.
  function advance(seconds) {
    const n = Math.round(seconds * 60);
    for (let i = 0; i < n; i++) { time += 1 / 60; playIntro(1 / 60); step(1 / 60); }
    render();
  }

  if (reduced) { started = true; introAt = 0; advance(INTRO + 1.5); } else render();

  return {
    // begin the opening whisk (once)
    start() { if (started) return; started = true; if (!reduced) { introAt = 0; lastInput = time; wake(); } },
    stroke,
    advance,
    // a nudge from outside (scrolling the page tilts the tea a little)
    slosh(dy) { if (dead) return; const n = 5; for (let i = 0; i < n; i++) { const x = 0.25 + (0.5 * i) / (n - 1); queue.push([x, 0.5, 0, dy * 900, 0]); } lastInput = time; wake(); },
    destroy() {
      dead = true; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      canvas.removeEventListener('pointermove', onMove); canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('pointercancel', onLeave); canvas.removeEventListener('webglcontextlost', onLost);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
  };
}
