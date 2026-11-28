// Joins index.html + css/ + js/ into one self-contained file for publishing.
// Artifact pages must have their CSS and JS inline, so publish dist/index.html, not index.html.
//
//   node tools/build.mjs        → writes dist/index.html
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = rel => fs.readFileSync(path.join(root, rel), "utf8");
const indent = text => text.replace(/\s+$/, "").split("\n").map(l => (l ? "  " + l : l)).join("\n");

let html = read("index.html");
const missing = [];

// <link rel="stylesheet" href="css/…"> → <style>…</style>   (Google Fonts links stay as they are)
html = html.replace(/<link rel="stylesheet" href="((?!https?:)[^"]+)">/g, (_, href) => {
  if (!fs.existsSync(path.join(root, href))) { missing.push(href); return _; }
  return `<style>\n  /* ${href} */\n${indent(read(href))}\n</style>`;
});

// <script src="js/…"></script> → <script>…</script>
html = html.replace(/<script src="((?!https?:)[^"]+)"><\/script>/g, (_, src) => {
  if (!fs.existsSync(path.join(root, src))) { missing.push(src); return _; }
  const code = read(src);
  if (/<\/script/i.test(code)) throw new Error(`${src} contains "</script", which would end the inline script early`);
  // Not indented: that would change the text inside template strings such as the lyrics
  return `<script>\n/* ${src} */\n${code.replace(/\s+$/, "")}\n</script>`;
});

if (missing.length) throw new Error("Missing files: " + missing.join(", "));

// Hide her second name: replace CONFIG.SECOND_NAME with hashes (NAME_LOCK), then make sure
// the plain name appears nowhere in the output.
const { NameLock } = require(path.join(root, "js/core/name-lock.js"));
const nameLine = /SECOND_NAME:\s*"([^"]*)",/;
const m = html.match(nameLine);
if (!m || !m[1].trim()) throw new Error("CONFIG.SECOND_NAME not found in js/config.js");
const secret = m[1].trim();
html = html.replace(nameLine, `SECOND_NAME: "",\n  NAME_LOCK: ${JSON.stringify(NameLock.make(secret))},`);
// Whole words, spelled exactly as in the config (so a placeholder like "Test" doesn't trip on "compatibility test")
const leaks = secret.split(/\s+/).filter(w => w.length >= 3 && new RegExp(`(?<![.\\w])${w}(?![\\w(])`).test(html));
if (leaks.length) throw new Error(`The name still appears in the output (${leaks.length} word(s)). Remove it from texts, comments or files and build again.`);

fs.mkdirSync(path.join(root, "dist"), { recursive: true });
fs.writeFileSync(path.join(root, "dist/index.html"), html);
console.log(`dist/index.html written (${(html.length / 1024).toFixed(1)} KB)`);

// Everything a static host (Cloudflare Pages) needs next to the page: the song and the photos,
// plus a _headers file that asks search engines not to list the page.
// Upload the whole dist/ folder there. (The claude.ai artifact only needs dist/index.html.)
for (const dir of ["BMusic", "images"]) {
  const from = path.join(root, dir);
  if (fs.existsSync(from)) fs.cpSync(from, path.join(root, "dist", dir), { recursive: true });
}
fs.writeFileSync(path.join(root, "dist/_headers"), "/*\n  X-Robots-Tag: noindex, nofollow\n");
console.log("dist/ also has BMusic/, images/ and _headers for Cloudflare Pages");
