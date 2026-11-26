/* =========================================================
   Mascot: the bear SVG and its moods
   moods: nervous, sad, happy, angry, think, suspicious, shocked, bouncer
   ========================================================= */
class Mascot {
  constructor(el, mood, extra = "") {
    el.innerHTML = Mascot.svg();
    this.svg = el.querySelector("svg");
    this.set(mood, extra);
  }
  set(mood, extra = "") {
    this.mood = mood;
    this.svg.setAttribute("class", `bear ${mood} ${extra}`.trim());
  }
  static svg() {
    const INK = "#3f1229", FUR = "#c9895f", FUR2 = "#a86b45", TEAR = "#8fd0f5", SHADE = "#1a1014", MOUTH = "#7a1f3d";
    const line = (d, cls, w = 4) => `<path class="f ${cls}" d="${d}" stroke="${INK}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
    const glasses = (cls, dy) => `
      <g class="f ${cls}" transform="translate(0 ${dy})">
        <rect x="58" y="81" width="36" height="20" rx="8" fill="${SHADE}"/>
        <rect x="106" y="81" width="36" height="20" rx="8" fill="${SHADE}"/>
        <path d="M94 88 L106 88" stroke="${SHADE}" stroke-width="4"/>
        <path d="M64 86 L74 86 M112 86 L122 86" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>
      </g>`;
    return `
    <svg class="bear" viewBox="0 0 200 200" role="img">
      <g class="f on-happy">
        <text class="floaty" x="18" y="70" font-size="22">💖</text>
        <text class="floaty" x="160" y="58" font-size="18">💕</text>
        <text class="floaty" x="28" y="140" font-size="16">✨</text>
        <text class="floaty" x="166" y="130" font-size="22">💗</text>
      </g>
      <g class="f on-angry" fill="#eadfe3">
        <g class="steam"><circle cx="36" cy="34" r="8"/><circle cx="28" cy="24" r="6"/></g>
        <g class="steam"><circle cx="164" cy="34" r="8"/><circle cx="172" cy="24" r="6"/></g>
      </g>
      <g class="b-body">
        <circle cx="58" cy="52" r="22" fill="${FUR2}"/><circle cx="142" cy="52" r="22" fill="${FUR2}"/>
        <circle cx="58" cy="52" r="11" fill="#f3b7c4"/><circle cx="142" cy="52" r="11" fill="#f3b7c4"/>
        <ellipse cx="100" cy="100" rx="66" ry="60" fill="${FUR}"/>
        <ellipse class="f on-angry" cx="100" cy="100" rx="66" ry="60" fill="#ff2d3d" opacity=".32"/>
        <ellipse cx="100" cy="124" rx="30" ry="22" fill="#f3d7c2"/>
        <ellipse cx="62" cy="120" rx="11" ry="6" fill="#ff8fab" opacity=".75"/>
        <ellipse cx="138" cy="120" rx="11" ry="6" fill="#ff8fab" opacity=".75"/>

        <!-- eyes -->
        <g class="f on-nervous on-sad on-think on-camera blink"><g class="pupils">
          <circle cx="76" cy="92" r="7.5" fill="${INK}"/><circle cx="124" cy="92" r="7.5" fill="${INK}"/>
          <circle cx="78.5" cy="89.5" r="2.4" fill="#fff"/><circle cx="126.5" cy="89.5" r="2.4" fill="#fff"/>
        </g></g>
        ${line("M66 95 Q76 80 86 95 M114 95 Q124 80 134 95", "on-happy", 5)}
        ${line("M66 93 L88 91 M112 91 L134 93", "on-suspicious", 5)}
        <g class="f on-shocked">
          <circle cx="76" cy="90" r="12" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="124" cy="90" r="12" fill="#fff" stroke="${INK}" stroke-width="3"/>
          <circle cx="76" cy="91" r="5" fill="${INK}"/><circle cx="124" cy="91" r="5" fill="${INK}"/>
        </g>

        <!-- brows -->
        ${line("M64 84 L84 77 M136 84 L116 77", "on-sad")}
        ${line("M60 68 L90 80 M140 68 L110 80", "on-angry", 6)}
        ${line("M64 80 L88 82 M112 74 Q124 64 138 72", "on-suspicious", 4.5)}

        <!-- sunglasses: on the eyes, or pushed up on the head -->
        ${glasses("on-bouncer on-angry", 0)}
        ${glasses("on-think on-suspicious on-shocked", -28)}

        <ellipse cx="100" cy="112" rx="9" ry="6.5" fill="${INK}"/>

        <!-- mouths -->
        ${line("M86 134 q3.5 -4 7 0 t7 0 t7 0 t7 0", "on-nervous", 3.5)}
        ${line("M88 140 Q100 129 112 140", "on-sad")}
        <path class="f on-happy" d="M84 128 Q100 154 116 128 Z" fill="${MOUTH}"/>
        <g class="f on-angry">
          <rect x="84" y="130" width="32" height="12" rx="4" fill="#fff" stroke="${INK}" stroke-width="3"/>
          <path d="M92 130 V142 M100 130 V142 M108 130 V142" stroke="${INK}" stroke-width="2"/>
        </g>
        ${line("M88 136 L112 136", "on-bouncer")}
        ${line("M88 134 Q100 145 112 134", "on-camera on-covered")}
        ${line("M94 138 Q102 133 112 137", "on-think")}
        ${line("M88 138 Q100 140 114 131", "on-suspicious")}
        <ellipse class="f on-shocked" cx="100" cy="138" rx="7" ry="9" fill="${MOUTH}"/>

        <path class="f on-nervous sweat" d="M152 60 q7 11 0 15 q-7 -4 0 -15z" fill="${TEAR}"/>
        <g class="f on-sad">
          <ellipse class="tear" cx="74" cy="106" rx="4" ry="6" fill="${TEAR}"/>
          <ellipse class="tear" cx="126" cy="106" rx="4" ry="6" fill="${TEAR}"/>
        </g>
      </g>

      <!-- body: a heart, or a SECURITY shirt at the checkpoint -->
      <path class="f on-nervous on-sad on-happy on-camera on-covered b-heart" d="M100 194 C68 172 72 148 89 150 C96 151 100 157 100 161 C100 157 104 151 111 150 C128 148 132 172 100 194Z" fill="#df3567"/>
      <g class="f on-bouncer on-angry on-think on-suspicious on-shocked">
        <rect x="60" y="152" width="80" height="44" rx="18" fill="${SHADE}"/>
        <text x="100" y="192" text-anchor="middle" font-size="10" font-family="monospace" font-weight="700" letter-spacing="1.5" fill="#fff">SECURITY</text>
      </g>
      <!-- camera for the photo booth (paws are drawn on top so the bear holds it) -->
      <g class="f on-camera">
        <rect x="68" y="150" width="64" height="40" rx="7" fill="#2b2326"/>
        <rect x="76" y="145" width="18" height="8" rx="2" fill="#2b2326"/>
        <circle cx="100" cy="170" r="13" fill="#4a4045" stroke="#d9cfd3" stroke-width="3"/>
        <circle cx="96" cy="166" r="3.5" fill="#fff" opacity=".7"/>
        <rect x="118" y="155" width="8" height="5" rx="1.5" fill="#ffd166"/>
      </g>

      <circle cx="80" cy="168" r="11" fill="${FUR2}"/><circle cx="120" cy="168" r="11" fill="${FUR2}"/>

      <!-- shy: paws over the eyes -->
      <g class="f on-covered">
        <circle cx="76" cy="92" r="15" fill="${FUR2}"/><circle cx="124" cy="92" r="15" fill="${FUR2}"/>
        <path d="M70 84 v8 M76 82 v9 M82 84 v8 M118 84 v8 M124 82 v9 M130 84 v8" stroke="${FUR}" stroke-width="2" stroke-linecap="round"/>
      </g>

      <g class="f on-think on-suspicious"><g class="magnifier">
        <path d="M162 132 L180 152" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>
        <circle cx="150" cy="120" r="17" fill="rgba(190,225,255,.45)" stroke="${INK}" stroke-width="5"/>
        <path d="M141 113 Q146 107 153 106" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>
      </g></g>
    </svg>`;
  }
}
