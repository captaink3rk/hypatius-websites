/* tools/check-smoothness.mjs · does this video actually move evenly?
   ─────────────────────────────────────────────────────────────────────────────
   Written because the first ALIDADE cut shipped with a visible stutter that
   every other check passed. Duration was right, dimensions were right, the
   container timestamps were a perfect 33.33 ms apart, and the encoder was fine.
   None of that is a measurement of motion.

   What a screen recorder does when the page misses a paint is write the
   PREVIOUS frame again. The file stays constant-rate and the content does not.
   So this measures the content:

     duplicates   frames byte-identical to the one before, and the longest run
                  of them — a run of 8 is a 270 ms freeze
     near-dupes   frames whose difference is below a perceptual floor
     jitter ratio the mean absolute change in frame-to-frame motion magnitude,
                  over the mean motion. This is the number that matters. Even
                  motion gives a small ratio; a capture that alternates between
                  "nothing moved" and "everything moved at once" gives a large
                  one, and that alternation is exactly what stutter looks like.

   Measured on the two ALIDADE cuts:

     v1  screen-recorded    jitter 0.792   near-identical 16.1%
     v2  clock-driven       jitter 0.126   near-identical  2.5%

   Thresholds below are set from that: anything over 0.35 is a recapture, not a
   re-encode.

   A TRAILING HOLD IS NOT A FREEZE. A logo resolve is supposed to settle and sit
   there for half a second so the lockup can be read; the CRATON mark resolve
   holds 15 frames at the end on purpose. Counting that as a stall made the tool
   argue for chopping the beat off a correct animation, which is the tool wagging
   the design. So the trailing run of identical frames is measured, reported and
   excluded from both the freeze and the near-identical figures. A freeze in the
   MIDDLE is still a failure, which is what the ALIDADE capture had.

   Needs ffmpeg on PATH.

   Run: node tools/check-smoothness.mjs <video> [<video> ...]
   Exit 1 if any file is over threshold. */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const JITTER_MAX = 0.35;
const NEAR_MAX   = 0.10;          // 10% of frames near-identical
const FREEZE_MAX = 4;             // consecutive identical frames

const W = 240, H = 135, SZ = W * H;
const files = process.argv.slice(2);
if (!files.length) { console.error('usage: check-smoothness.mjs <video> ...'); process.exit(2); }

let fails = 0;
for (const f of files) {
  if (!existsSync(f)) { console.log(`  ✕ ${f}: missing`); fails++; continue; }

  const raw = execFileSync('ffmpeg',
    ['-v', 'error', '-i', f, '-vf', `scale=${W}:${H},format=gray`, '-f', 'rawvideo', '-'],
    { maxBuffer: 1 << 30 });

  const n = Math.floor(raw.length / SZ);
  const frame = i => raw.subarray(i * SZ, (i + 1) * SZ);

  /* "Identical" is judged with a small tolerance, not byte equality: a lossy
     encoder puts a little noise into a frame that was authored as a hold, so
     strict equality misses real freezes in an encoded file. */
  const STILL = 12;
  const motion = [], still = [];
  for (let i = 1; i < n; i++) {
    const a = frame(i - 1), b = frame(i);
    let sum = 0;
    for (let k = 0; k < SZ; k += 3) sum += Math.abs(a[k] - b[k]);
    motion.push(sum); still.push(sum <= STILL);
  }

  /* Holds at either END are measured, reported, and then excluded. See the note
     in the header. Both are real: the ALIDADE sting opens on a dark beat before
     the ring appears, and the CRATON resolve settles on the lockup. A freeze in
     the MIDDLE is the defect. */
  let lead = 0;
  for (let i = 0; i < still.length && still[i]; i++) lead++;
  let hold = 0;
  for (let i = still.length - 1; i > lead && still[i]; i--) hold++;
  const from = lead, to = motion.length - hold;
  const body = Math.max(1, to - from);

  let run = 1, longest = 1, near = 0;
  for (let i = from; i < to; i++) {
    if (still[i]) { run++; if (run > longest) longest = run; } else run = 1;
    if (motion[i] < 40) near++;
  }

  const mean = a => a.reduce((x, y) => x + y, 0) / Math.max(1, a.length);
  const jit = [];
  for (let i = from + 1; i < to; i++) jit.push(Math.abs(motion[i] - motion[i - 1]));
  const ratio = mean(jit) / Math.max(1, mean(motion.slice(from, to)));
  const nearPct = near / body;

  const ok = ratio <= JITTER_MAX && nearPct <= NEAR_MAX && longest <= FREEZE_MAX;
  if (!ok) fails++;
  console.log(`  ${ok ? '✓' : '✕'} ${f.split('/').pop()}`);
  console.log(`      frames ${n} · jitter ${ratio.toFixed(3)} (max ${JITTER_MAX})` +
              ` · near-identical ${(nearPct * 100).toFixed(1)}% (max ${NEAR_MAX * 100}%)` +
              ` · longest mid-clip freeze ${longest} (max ${FREEZE_MAX})` +
              ((lead || hold) ? ` · holds ${lead}f lead / ${hold}f tail (by design, excluded)` : ''));
}

console.log(`\n${files.length} file(s) · ${fails} failed`);
process.exit(fails ? 1 : 0);
