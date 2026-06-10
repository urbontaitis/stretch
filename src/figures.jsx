// Minimal line-art illustrations of each stretch, in the spirit of the
// original chart. Per-leg exercises are mirrored for the right leg.

const FIGURES = {
  hamstringSupport: (
    <>
      <rect x="108" y="112" width="62" height="56" className="prop" />
      <circle cx="103" cy="42" r="11" className="head" />
      <path d="M70 96 L96 56" className="limb" />
      <path d="M96 56 L108 88" className="limb" />
      <path d="M70 96 L70 136 L70 180" className="limb" />
      <path d="M70 96 L120 106" className="accent" />
      <path d="M120 106 L132 102" className="limb" />
    </>
  ),
  calfWall: (
    <>
      <path d="M152 18 L152 182" className="prop" />
      <circle cx="76" cy="42" r="11" className="head" />
      <path d="M64 106 L86 58" className="limb" />
      <path d="M86 58 L148 74" className="limb" />
      <path d="M64 106 L96 134 L104 178" className="limb" />
      <path d="M64 106 L34 178" className="accent" />
      <path d="M34 178 L22 180" className="limb" />
    </>
  ),
  quadStanding: (
    <>
      <circle cx="93" cy="30" r="11" className="head" />
      <path d="M94 44 L96 100" className="limb" />
      <path d="M96 100 L94 140 L94 182" className="limb" />
      <path d="M96 100 L102 140" className="accent" />
      <path d="M102 140 L120 112" className="limb" />
      <path d="M94 44 L122 110" className="limb" />
      <path d="M94 44 L58 60" className="limb" />
    </>
  ),
  kneeHug: (
    <>
      <circle cx="82" cy="28" r="11" className="head" />
      <path d="M82 42 L84 100" className="limb" />
      <path d="M84 100 L84 142 L84 182" className="limb" />
      <path d="M84 100 L52 86" className="accent" />
      <path d="M52 86 L58 122" className="limb" />
      <path d="M82 42 L52 88" className="limb" />
    </>
  ),
  butterfly: (
    <>
      <circle cx="100" cy="44" r="11" className="head" />
      <path d="M100 58 L100 112" className="limb" />
      <path d="M100 112 L54 128 L98 150" className="accent" />
      <path d="M100 112 L146 128 L102 150" className="accent" />
      <path d="M100 62 L92 144" className="limb" />
      <path d="M100 62 L108 144" className="limb" />
      <path d="M30 160 L170 160" className="prop" />
    </>
  ),
  lyingTwist: (
    <>
      <path d="M20 158 L180 158" className="prop" />
      <circle cx="32" cy="138" r="11" className="head" />
      <path d="M44 144 L102 148" className="limb" />
      <path d="M102 148 L172 150" className="limb" />
      <path d="M102 148 L74 112" className="accent" />
      <path d="M74 112 L96 120" className="limb" />
      <path d="M48 146 L74 116" className="limb" />
    </>
  ),
  backCurl: (
    <>
      <path d="M20 162 L180 162" className="prop" />
      <circle cx="56" cy="116" r="11" className="head" />
      <path d="M68 126 L112 156" className="accent" />
      <path d="M112 156 L138 116" className="limb" />
      <path d="M138 116 L158 156" className="limb" />
      <path d="M66 128 L48 122" className="limb" />
    </>
  ),
  barBend: (
    <>
      <path d="M104 66 L186 66" className="prop" />
      <path d="M178 66 L178 182" className="prop" />
      <circle cx="106" cy="100" r="11" className="head" />
      <path d="M48 108 L100 86" className="accent" />
      <path d="M100 86 L148 68" className="limb" />
      <path d="M48 108 L46 182" className="limb" />
      <path d="M56 108 L58 182" className="limb" />
    </>
  ),
  kneelingReach: (
    <>
      <path d="M20 172 L180 172" className="prop" />
      <circle cx="56" cy="134" r="11" className="head" />
      <path d="M124 142 L70 148" className="accent" />
      <path d="M124 142 L122 170" className="limb" />
      <path d="M122 170 L162 168" className="limb" />
      <path d="M70 148 L34 168" className="limb" />
    </>
  ),
  toeFlex: (
    <>
      <path d="M20 166 L180 166" className="prop" />
      <circle cx="104" cy="78" r="11" className="head" />
      <path d="M120 160 L106 92" className="limb" />
      <path d="M120 160 L76 140 L62 162" className="limb" />
      <path d="M62 162 L50 148" className="accent" />
      <path d="M106 96 L52 146" className="limb" />
      <path d="M120 160 L152 164" className="limb" />
    </>
  )
};

export function Figure({ name, mirrored = false }) {
  return (
    <svg viewBox="0 0 200 200" className="figure" role="img" aria-hidden="true">
      <g transform={mirrored ? 'translate(200 0) scale(-1 1)' : undefined}>
        {FIGURES[name]}
      </g>
    </svg>
  );
}
