// Joins index.html + css/ + js/ into one self-contained file for publishing.
// Artifact pages must have their CSS and JS inline, so publish dist/index.html, not index.html.
//
//   node tools/build.mjs        → writes dist/index.html
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

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

fs.mkdirSync(path.join(root, "dist"), { recursive: true });
fs.writeFileSync(path.join(root, "dist/index.html"), html);
console.log(`dist/index.html written (${(html.length / 1024).toFixed(1)} KB)`);
