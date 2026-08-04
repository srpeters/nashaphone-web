/**
 * visual-check.mjs — real-device visual regression check for nashaphone-web.
 *
 *   node scripts/visual-check.mjs [url]
 *
 * Default target is the LIVE site. Pass a URL (including file://...) to check
 * something else.
 *
 * Requires Playwright, which is intentionally NOT committed with this repo
 * (the published site ships no build tooling):
 *
 *   npm install -D playwright
 *   npx playwright install webkit chromium
 *
 * ENGINE NOTE. iOS Safari is WebKit, and a Chromium window resized to 390px
 * is NOT an iPhone: different engine, no real device pixel ratio, different
 * viewport behaviour. This script therefore tries to run the phone and tablet
 * profiles on real WebKit. If WebKit cannot launch on the host (it needs
 * system libraries that need root to install), it falls back to Chromium with
 * the device's viewport, deviceScaleFactor, isMobile and touch flags, and says
 * so on every line. That fallback is emulation, not Safari coverage — treat
 * any WebKit-specific rendering bug as unverified when it says CHROMIUM.
 */

import { webkit, chromium, devices } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const URL_ = process.argv[2] || "https://srpeters.github.io/nashaphone-web/";
const OUT = "build/shots";

const PROFILES = [
  { name: "iphone-13-mini",   device: "iPhone 13 Mini",   engine: "webkit",   mobile: true },
  { name: "iphone-14-pro",    device: "iPhone 14 Pro",    engine: "webkit",   mobile: true },
  { name: "iphone-14-promax", device: "iPhone 14 Pro Max", engine: "webkit",  mobile: true },
  { name: "ipad-mini",        device: "iPad Mini",        engine: "webkit",   mobile: true },
  { name: "desktop-1440",     viewport: { width: 1440, height: 900 },  engine: "chromium", mobile: false },
  { name: "desktop-1920",     viewport: { width: 1920, height: 1080 }, engine: "chromium", mobile: false },
];

// Elements in the featured offer band that must never sit on top of each other.
const BAND_PARTS = {
  headline: "#oferta h2",
  subline:  "#oferta .offer__sub",
  cta:      "#oferta .btn--accent",
  phone:    "#oferta .btn--ghost-dark",
  badge:    "#oferta .offer__tag",
  samsung:  "#oferta .offer__frame .brand-logo",
  image:    "#oferta .offer__photo",
};

const rectsOf = async (page) =>
  page.evaluate(async (parts) => {
    const out = {};
    for (const [key, sel] of Object.entries(parts)) {
      const el = document.querySelector(sel);
      if (!el) { out[key] = null; continue; }
      const r = el.getBoundingClientRect();
      out[key] = {
        x: Math.round(r.x), y: Math.round(r.y + window.scrollY),
        w: Math.round(r.width), h: Math.round(r.height),
      };
      if (el.tagName === "IMG") {
        // naturalWidth on a srcset image is density-corrected to CSS pixels,
        // so it cannot tell us how many real pixels the chosen FILE has.
        // Re-load the chosen file plainly to get its true resolution.
        const probe = new Image();
        probe.src = el.currentSrc;
        try { await probe.decode(); } catch { /* fall back to naturalWidth */ }
        out[key].naturalW = probe.naturalWidth || el.naturalWidth;
        out[key].naturalH = probe.naturalHeight || el.naturalHeight;
        out[key].currentSrc = (el.currentSrc || "").split("/").pop();
      }
    }
    return out;
  }, parts_(BAND_PARTS));

function parts_(o) { return o; }

const overlap = (a, b) => {
  if (!a || !b) return 0;
  const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  return w > 0 && h > 0 ? w * h : 0;
};

async function launch(engine) {
  const tries = engine === "webkit" ? [webkit, chromium] : [chromium];
  for (const type of tries) {
    try {
      const browser = await type.launch();
      return { browser, engine: type === webkit ? "WEBKIT" : "CHROMIUM" };
    } catch { /* fall through to the next engine */ }
  }
  throw new Error("no browser could be launched");
}

async function run() {
  await mkdir(OUT, { recursive: true });
  console.log(`\ntarget: ${URL_}\n`);

  const results = [];
  let anyWebkit = false, anyFallback = false;

  for (const profile of PROFILES) {
    const { browser, engine } = await launch(profile.engine);
    if (profile.engine === "webkit") {
      engine === "WEBKIT" ? (anyWebkit = true) : (anyFallback = true);
    }

    const base = profile.device ? devices[profile.device] : {};
    const context = await browser.newContext({
      ...base,
      ...(profile.viewport ? { viewport: profile.viewport } : {}),
    });
    const page = await context.newPage();
    await page.goto(URL_, { waitUntil: "networkidle", timeout: 60000 });
    // Reveal animations are IntersectionObserver-driven; force them so a
    // screenshot never catches a half-faded section.
    await page.evaluate(() =>
      document.querySelectorAll(".reveal").forEach((e) => e.classList.add("is-visible")));
    await page.waitForTimeout(700);

    const vw = page.viewportSize().width;
    const metrics = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      innerWidth: window.innerWidth,
      dpr: window.devicePixelRatio,
      docHeight: document.documentElement.scrollHeight,
      // any element sticking out past the right edge
      wide: [...document.querySelectorAll("body *")]
        .filter((el) => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
        .slice(0, 6)
        .map((el) => `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]}` +
                     ` (right ${Math.round(el.getBoundingClientRect().right)})`),
    }));

    const rects = await rectsOf(page);

    await page.screenshot({ path: path.join(OUT, `${profile.name}-full.png`), fullPage: true });
    const band = await page.$("#oferta");
    if (band) await band.screenshot({ path: path.join(OUT, `${profile.name}-offer.png`) });

    // --- checks ---
    const failures = [];
    const overflow = metrics.scrollWidth - metrics.clientWidth;
    if (overflow > 0) {
      failures.push(`horizontal overflow: scrollWidth ${metrics.scrollWidth} > clientWidth ${metrics.clientWidth} (+${overflow}px)` +
                    (metrics.wide.length ? ` | widest: ${metrics.wide.join(", ")}` : ""));
    }
    for (const [k, r] of Object.entries(rects)) {
      if (!r) { failures.push(`missing element: ${k}`); continue; }
      if (r.w === 0 || r.h === 0) failures.push(`${k} has zero size`);
      if (r.x < 0 || r.x + r.w > vw + 1) {
        failures.push(`${k} out of viewport: x=${r.x} w=${r.w} (viewport ${vw})`);
      }
    }
    const keys = Object.keys(rects);
    for (let i = 0; i < keys.length; i++) {
      for (let j = i + 1; j < keys.length; j++) {
        const area = overlap(rects[keys[i]], rects[keys[j]]);
        if (area > 16) failures.push(`${keys[i]} overlaps ${keys[j]} by ${area}px2`);
      }
    }
    if (rects.image) {
      // One asset serves every profile, so judge it against a 2x baseline
      // rather than this profile's own DPR: a 1x desktop would otherwise
      // flag an image that a 3x phone genuinely needs. Retina desktops
      // exist, so 2x is the floor even when this run reports dpr1.
      const served = rects.image.naturalW || 0;
      const shown = rects.image.w;
      const needed = shown * Math.max(metrics.dpr || 1, 2);
      const ratio = needed ? served / needed : 0;
      if (ratio > 1.6) {
        failures.push(`image oversized: serving ${served}px, ${shown}css needs ` +
                      `${Math.round(needed)}px at ${Math.max(metrics.dpr, 2)}x (${ratio.toFixed(1)}x)`);
      } else if (ratio < 0.8) {
        failures.push(`image undersized: serving ${served}px, ${shown}css needs ` +
                      `${Math.round(needed)}px at dpr${metrics.dpr} (${ratio.toFixed(2)}x)`);
      }
    }

    results.push({ profile: profile.name, engine, requested: profile.engine, metrics, rects, failures, vw });

    console.log(`${failures.length ? "FAIL" : "PASS"}  ${profile.name.padEnd(17)} ` +
                `${engine === "WEBKIT" ? "WEBKIT " : "CHROMIUM(emulated)"} ` +
                `${metrics.innerWidth}x${metrics.docHeight} dpr${metrics.dpr}` +
                (profile.engine === "webkit" && engine !== "WEBKIT" ? "  <- NOT Safari" : ""));
    for (const f of failures) console.log(`        - ${f}`);
    if (rects.image) {
      console.log(`        image ${rects.image.currentSrc} served ${rects.image.naturalW}x${rects.image.naturalH}` +
                  `, shown ${rects.image.w}x${rects.image.h} css`);
    }
    for (const k of ["headline", "subline", "cta", "badge", "samsung"]) {
      const r = rects[k];
      if (r) console.log(`        ${k.padEnd(9)} x=${String(r.x).padStart(4)} y=${String(r.y).padStart(5)} ${r.w}x${r.h}`);
    }

    await context.close();
    await browser.close();
  }

  await writeFile(path.join(OUT, "report.json"), JSON.stringify(results, null, 2));

  const failed = results.filter((r) => r.failures.length);
  console.log(`\n${results.length - failed.length}/${results.length} profiles pass`);
  if (anyFallback) {
    console.log(
      "\nWARNING: WebKit could not launch on this host, so the phone and tablet\n" +
      "profiles ran on Chromium with the device viewport, DPR, isMobile and touch\n" +
      "flags. That is emulation, NOT Safari. Layout and overflow findings are\n" +
      "reliable; anything WebKit-specific is unverified.");
  }
  if (anyWebkit) console.log("\nWebKit ran for real on the mobile profiles.");
  console.log(`shots: ${OUT}/\n`);
  process.exit(failed.length ? 1 : 0);
}

run().catch((e) => { console.error(e); process.exit(2); });
