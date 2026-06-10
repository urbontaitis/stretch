// Post-cycling stretching routine from the "Važiavimas dviračiu" chart.
// Numbers match the chart illustration numbers.
export const STRETCH_SECONDS = 30;

export const exercises = [
  {
    id: 37,
    name: 'Seated hamstring stretch',
    description:
      'Sit on the edge of a box or bench with one leg extended along the surface. Lean forward from the hips to feel the back of the extended thigh stretching.',
    figure: 'hamstringSupport',
    perLeg: true
  },
  {
    id: 40,
    name: 'Lunge calf stretch with pole',
    description:
      'Hold a long stick or pole diagonally for balance and sink into a deep lunge. Keep the front foot flat to stretch the shin and calf of the front leg.',
    figure: 'calfWall',
    perLeg: true
  },
  {
    id: 22,
    name: 'Running-stride hip flexor',
    description:
      'Step into a deep lunge with arms in a running position. Sink your hips low to stretch the front of the trailing hip.',
    figure: 'quadStanding',
    perLeg: true
  },
  {
    id: 18,
    name: 'Standing knee raise',
    description:
      'Stand tall and pull one knee up toward your chest with both hands. Feel the stretch in the raised hip and glute.',
    figure: 'kneeHug',
    perLeg: true
  },
  {
    id: 31,
    name: 'Butterfly groin stretch',
    description:
      'Sit with the soles of your feet together and knees falling wide. Hold your feet and gently press the knees toward the floor to open the inner thighs.',
    figure: 'butterfly',
    perLeg: false
  },
  {
    id: 30,
    name: 'Lying hip and glute stretch',
    description:
      'Lie on your back and cross one ankle over the opposite knee. Pull the uncrossed leg toward you to feel a deep stretch in the crossed-side hip and glute.',
    figure: 'lyingTwist',
    perLeg: true
  },
  {
    id: 50,
    name: 'Lying back release',
    description:
      'Lie on your back with knees bent and hands behind your head. Gently curl your upper back off the floor to release the lower back and core.',
    figure: 'backCurl',
    perLeg: false
  },
  {
    id: 4,
    name: 'Forward fold at bar',
    description:
      'Hold a bar or railing at shoulder height with both hands. Step back and hinge at the hips until your torso is roughly parallel to the floor. Feel the stretch across the upper back and shoulders.',
    figure: 'barBend',
    perLeg: false
  },
  {
    id: 12,
    name: 'Kneeling all-fours reach',
    description:
      'From all fours, walk your hands forward while sitting your hips back toward your heels. Feel the stretch in the lower back and hips.',
    figure: 'kneelingReach',
    perLeg: false
  },
  {
    id: 44,
    name: 'Foot and plantar stretch',
    description:
      'Sitting or standing, take hold of one foot and gently pull the toes back toward the shin to stretch the sole and achilles.',
    figure: 'toeFlex',
    perLeg: true
  }
];

// Expands the exercise list: per-leg exercises become left then right steps.
export function buildRoutine(list = exercises) {
  const steps = [];
  for (const ex of list) {
    if (ex.perLeg) {
      steps.push({ ...ex, leg: 'left', key: `${ex.id}-left` });
      steps.push({ ...ex, leg: 'right', key: `${ex.id}-right` });
    } else {
      steps.push({ ...ex, leg: null, key: String(ex.id) });
    }
  }
  return steps;
}
