// Stretch illustrations redrawn from the "Važiavimas dviračiu" cycling chart.
// 200×200 viewBox. Oriented for the LEFT leg — mirrored automatically for right.
//
// CSS classes used:
//   .head   — filled circle for the head
//   .limb   — body stroke (arms, legs, torso)
//   .muscle — FILLED shape for the highlighted/stretched muscle (matches original black-fill style)
//   .prop   — equipment stroke (box, bar, floor line, pole)

const FIGURES = {

  // 37 — seated stretch on box: left leg extended along box surface
  hamstringSupport: (
    <>
      {/* Box / plinth on right */}
      <rect x="100" y="110" width="82" height="58" className="prop" />
      {/* Head — sitting, leaning toward extended leg */}
      <circle cx="130" cy="38" r="12" className="head" />
      {/* Neck + torso leaning left */}
      <path d="M130 50 L114 92" className="limb" />
      {/* Hip down to box surface */}
      <path d="M114 92 L108 112" className="limb" />
      {/* Extended LEFT leg along top of box */}
      <path d="M108 112 L30 106" className="limb" />
      {/* Foot */}
      <path d="M30 106 L18 110" className="limb" />
      {/* Right leg hanging off box */}
      <path d="M108 112 L116 168" className="limb" />
      {/* Arm reaching toward left foot */}
      <path d="M118 68 L54 100" className="limb" />
      <path d="M118 68 L138 82" className="limb" />
      {/* Hamstring highlight — filled oval along top of extended thigh */}
      <ellipse cx="70" cy="105" rx="40" ry="10" className="muscle"
               transform="rotate(-3 70 105)" />
    </>
  ),

  // 40 — deep lunge with diagonal pole, front shin highlighted
  calfWall: (
    <>
      {/* Long diagonal pole (top-left → bottom-right) */}
      <path d="M50 18 L166 176" className="prop" />
      {/* Head */}
      <circle cx="96" cy="50" r="12" className="head" />
      {/* Torso upright */}
      <path d="M96 62 L98 108" className="limb" />
      {/* Arms gripping pole — upper hand left, lower hand right */}
      <path d="M97 78 L70 50" className="limb" />
      <path d="M97 78 L122 96" className="limb" />
      {/* Front LEFT thigh */}
      <path d="M98 108 L76 146" className="limb" />
      {/* Front LEFT shin */}
      <path d="M76 146 L66 176" className="limb" />
      {/* Back RIGHT leg extended */}
      <path d="M98 108 L140 138 L156 176" className="limb" />
      {/* Shin highlight — tall oval on lower front leg */}
      <ellipse cx="70" cy="162" rx="11" ry="20" className="muscle"
               transform="rotate(-12 70 162)" />
    </>
  ),

  // 22 — running-stride lunge, LEFT trailing hip flexor highlighted
  quadStanding: (
    <>
      {/* Head */}
      <circle cx="112" cy="30" r="12" className="head" />
      {/* Torso, slight forward lean */}
      <path d="M112 42 L110 96" className="limb" />
      {/* RIGHT leg striding forward */}
      <path d="M110 96 L128 134 L136 170" className="limb" />
      {/* LEFT leg trailing behind */}
      <path d="M110 96 L88 134 L66 168" className="limb" />
      {/* Arms in running motion */}
      <path d="M110 68 L134 86" className="limb" />
      <path d="M110 68 L86 50" className="limb" />
      {/* Hip-flexor / groin highlight on left side — large teardrop */}
      <ellipse cx="98" cy="116" rx="20" ry="26" className="muscle"
               transform="rotate(20 98 116)" />
    </>
  ),

  // 18 — standing, left knee raised, large hip/groin highlighted
  kneeHug: (
    <>
      {/* Small stool underfoot */}
      <rect x="62" y="162" width="44" height="12" className="prop" />
      {/* Head */}
      <circle cx="100" cy="28" r="12" className="head" />
      {/* Torso upright */}
      <path d="M100 40 L100 98" className="limb" />
      {/* RIGHT leg standing */}
      <path d="M100 98 L108 134 L114 162" className="limb" />
      {/* LEFT leg raised — thigh up, shin forward */}
      <path d="M100 98 L82 132" className="limb" />
      <path d="M82 132 L94 160" className="limb" />
      {/* Arms wrapping raised knee */}
      <path d="M97 66 L76 98" className="limb" />
      <path d="M97 66 L120 82" className="limb" />
      {/* Hip / iliopsoas highlight — large filled shape */}
      <ellipse cx="90" cy="112" rx="22" ry="28" className="muscle"
               transform="rotate(15 90 112)" />
    </>
  ),

  // 31 — butterfly seated: both inner thighs filled
  butterfly: (
    <>
      {/* Floor */}
      <path d="M16 174 L184 174" className="prop" />
      {/* Head */}
      <circle cx="100" cy="42" r="12" className="head" />
      {/* Torso sitting */}
      <path d="M100 54 L100 110" className="limb" />
      {/* LEFT leg in butterfly */}
      <path d="M100 110 L52 134 L84 160" className="limb" />
      {/* RIGHT leg in butterfly */}
      <path d="M100 110 L148 134 L116 160" className="limb" />
      {/* Arm to left foot */}
      <path d="M97 84 L58 154" className="limb" />
      {/* Arm to right foot */}
      <path d="M97 84 L140 154" className="limb" />
      {/* LEFT inner thigh highlight */}
      <ellipse cx="72" cy="138" rx="22" ry="11" className="muscle"
               transform="rotate(-32 72 138)" />
      {/* RIGHT inner thigh highlight */}
      <ellipse cx="128" cy="138" rx="22" ry="11" className="muscle"
               transform="rotate(32 128 138)" />
    </>
  ),

  // 30 — lying hip/glute stretch: large hip filled
  lyingTwist: (
    <>
      {/* Floor */}
      <path d="M12 164 L188 164" className="prop" />
      {/* Head */}
      <circle cx="28" cy="134" r="12" className="head" />
      {/* Body along floor */}
      <path d="M40 146 L134 150" className="limb" />
      {/* Right leg flat */}
      <path d="M134 150 L168 154" className="limb" />
      {/* LEFT leg bent and crossing: thigh up, shin over */}
      <path d="M82 150 L60 116" className="limb" />
      <path d="M60 116 L102 122" className="limb" />
      {/* Left arm outstretched for balance */}
      <path d="M42 148 L14 128" className="limb" />
      {/* Hip/glute highlight — large oval */}
      <ellipse cx="100" cy="148" rx="32" ry="20" className="muscle" />
    </>
  ),

  // 50 — lying crunch: lower back / core filled
  backCurl: (
    <>
      {/* Floor */}
      <path d="M12 168 L188 168" className="prop" />
      {/* Head raised slightly */}
      <circle cx="44" cy="110" r="12" className="head" />
      {/* Curled torso */}
      <path d="M56 122 L114 158" className="limb" />
      {/* LEFT thigh up */}
      <path d="M114 158 L142 124" className="limb" />
      {/* LEFT shin */}
      <path d="M142 124 L156 158" className="limb" />
      {/* Hands behind head */}
      <path d="M56 122 L32 112" className="limb" />
      <path d="M56 122 L60 108" className="limb" />
      {/* Core / lower-back highlight */}
      <ellipse cx="84" cy="138" rx="30" ry="13" className="muscle"
               transform="rotate(-22 84 138)" />
    </>
  ),

  // 4 — forward fold at horizontal bar: upper back filled
  barBend: (
    <>
      {/* Vertical post */}
      <path d="M162 48 L162 186" className="prop" />
      {/* Horizontal bar */}
      <path d="M90 48 L162 48" className="prop" />
      {/* Head forward, level with bar */}
      <circle cx="92" cy="90" r="12" className="head" />
      {/* Horizontal torso */}
      <path d="M28 114 L92 82" className="limb" />
      {/* Arms to bar */}
      <path d="M92 82 L136 50" className="limb" />
      {/* Left leg */}
      <path d="M28 114 L26 150 L22 180" className="limb" />
      {/* Right leg */}
      <path d="M28 114 L38 150 L40 180" className="limb" />
      {/* Upper back / shoulder highlight */}
      <ellipse cx="60" cy="96" rx="34" ry="14" className="muscle"
               transform="rotate(-18 60 96)" />
    </>
  ),

  // 12 — all-fours kneeling reach: hip / lower back filled
  kneelingReach: (
    <>
      {/* Floor */}
      <path d="M12 174 L188 174" className="prop" />
      {/* Head low */}
      <circle cx="36" cy="124" r="12" className="head" />
      {/* Torso reaching forward */}
      <path d="M48 134 L108 154" className="limb" />
      {/* Near knee */}
      <path d="M108 154 L118 174" className="limb" />
      {/* Hip back toward heels */}
      <path d="M108 154 L150 164 L164 174" className="limb" />
      {/* Arms on floor */}
      <path d="M52 132 L14 150" className="limb" />
      {/* Hip / lower-back highlight */}
      <ellipse cx="130" cy="162" rx="24" ry="14" className="muscle" />
    </>
  ),

  // 44 — close-up foot stretch: sole / achilles filled
  toeFlex: (
    <>
      {/* Floor */}
      <path d="M12 168 L188 168" className="prop" />
      {/* Lower leg */}
      <path d="M102 44 L94 124" className="limb" />
      {/* Ankle to heel */}
      <path d="M94 124 L82 164" className="limb" />
      {/* Foot (horizontal) */}
      <path d="M82 164 L48 158" className="limb" />
      {/* Toes pulled back */}
      <path d="M48 158 L38 148" className="limb" />
      {/* Arm reaching down */}
      <path d="M98 92 L50 152" className="limb" />
      {/* Hand at toes */}
      <path d="M50 152 L30 144" className="limb" />
      {/* Sole / achilles highlight — large oval on foot */}
      <ellipse cx="64" cy="158" rx="22" ry="12" className="muscle"
               transform="rotate(-12 64 158)" />
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
