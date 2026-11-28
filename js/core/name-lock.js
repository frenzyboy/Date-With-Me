/* =========================================================
   NameLock: checks her second name without the name being in the page.
   The published page only has hashes: one for the exact name and a set for
   "nearly right" spellings (the name with up to 2 letters removed).
   tools/build.mjs turns CONFIG.SECOND_NAME into CONFIG.NAME_LOCK, so the
   plain name never ships. When opened from disk, the lock is made at runtime.
   No DOM here: the build script runs this file in Node too.
   ========================================================= */
const normalizeName = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "")
  .toLowerCase().replace(/[^a-z\s]/g, " ").replace(/\s+/g, " ").trim();

const NameLock = {
  SALT: "td14-bear-",

  // cyrb53: a small, fast string hash (not cryptographic; it just keeps the name out of sight)
  hash(str) {
    str = NameLock.SALT + str;
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
  },

  // Every version of the word with up to k letters removed (the word itself included)
  deletes(word, k = 2) {
    let level = new Set([word]);
    const all = new Set(level);
    for (let d = 0; d < k; d++) {
      const next = new Set();
      level.forEach(w => { for (let i = 0; i < w.length; i++) next.add(w.slice(0, i) + w.slice(i + 1)); });
      next.forEach(w => all.add(w));
      level = next;
    }
    return all;
  },

  make(name) {
    const t = normalizeName(name).replace(/ /g, "");
    return {
      exact: NameLock.hash(t),
      near: [...NameLock.deletes(t)].filter(w => w.length >= 2).map(NameLock.hash).sort(),
      len: t.length,
      letter: t.charAt(0).toUpperCase()
    };
  },

  // → { result: "yes" | "close" | "no", name: how to show her name when it's right }
  check(raw, lock) {
    const words = normalizeName(raw).split(" ").filter(Boolean);
    // any run of neighbouring words, joined without spaces ("anna marie" → "anna", "marie", "annamarie")
    for (let a = 0; a < words.length; a++) {
      for (let b = a + 1; b <= words.length; b++) {
        const run = words.slice(a, b);
        if (NameLock.hash(run.join("")) === lock.exact) {
          return { result: "yes", name: run.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") };
        }
      }
    }
    if (lock.len < 4) return { result: "no" };
    const near = new Set(lock.near);
    const candidates = [words.join(""), ...words];
    const close = candidates.some(w => w.length >= 3 && Math.abs(w.length - lock.len) <= 2 &&
      [...NameLock.deletes(w)].some(d => near.has(NameLock.hash(d))));
    return { result: close ? "close" : "no" };
  }
};

if (typeof module !== "undefined") module.exports = { NameLock, normalizeName };
