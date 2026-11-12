// Reel 1, "The first bowl": 12 seconds, 1080 x 1920, 30 frames a second.
// usage: node social/reel.mjs test   a few still frames to look at first
//        node social/reel.mjs full   the film (needs ffmpeg), written to social/prelaunch
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import { open, OUT } from './lib.mjs';

const mode = process.argv[2] || 'test';
const FPS = 30, SECONDS = 12, N = FPS * SECONDS;
const { browser, page } = await open('reel.html', 1080, 1920);
await page.evaluate(async () => { await document.fonts.load('148px "Hina Mincho"', 'Machiko まちこ'); await document.fonts.load('42px "Hanken Grotesk Variable"', 'Dorćol'); });
console.log('bowl', await page.evaluate(() => window.hasBowl));
const shots = mode === 'test' ? new Set([15, 60, 100, 135, 190, 250, 359]) : null;
let ff;
if (mode === 'full') {
  const tmp = `${OUT}/R1-first-bowl.part.mp4`;
  ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100', '-map', '0:v', '-map', '1:a', '-shortest', '-c:a', 'aac', '-b:a', '96k', '-c:v', 'libx264', '-crf', '17', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-color_range', 'tv', '-movflags', '+faststart', tmp], { stdio: ['pipe', 'inherit', 'inherit'] });
}
const t0 = Date.now();
for (let f = 0; f < N; f++) {
  await page.evaluate((t) => window.tick(t), f / FPS);
  if (mode === 'full') {
    const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (f === 300) fs.writeFileSync(`${OUT}/R1-cover.jpg`, await page.screenshot({ type: 'jpeg', quality: 95 }));
  } else if (shots.has(f)) {
    await page.screenshot({ path: `${OUT}/test-${String(f).padStart(3, '0')}.jpg`, type: 'jpeg', quality: 88 });
  }
}
if (mode === 'full') {
  ff.stdin.end();
  const code = await new Promise((r) => ff.on('close', r));
  if (code === 0) fs.renameSync(`${OUT}/R1-first-bowl.part.mp4`, `${OUT}/R1-first-bowl.mp4`);
  console.log('ffmpeg', code);
}
console.log('done in', ((Date.now() - t0) / 1000).toFixed(1), 's');
await browser.close();
