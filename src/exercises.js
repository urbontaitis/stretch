// Post-cycling stretching routine, based on the classic stretching chart
// "Važiavimas dviračiu" (Cycling). Numbers refer to the chart illustrations.
export const STRETCH_SECONDS = 30;

export const exercises = [
  {
    id: 37,
    name: 'Hamstring stretch on support',
    description:
      'Rest your heel on a bench or box, leg straight. Hinge forward from the hips until you feel the back of the thigh stretch.',
    figure: 'hamstringSupport',
    perLeg: true
  },
  {
    id: 40,
    name: 'Calf stretch against wall',
    description:
      'Lean into a wall with the back leg straight and heel pressed to the floor. Keep toes pointing forward.',
    figure: 'calfWall',
    perLeg: true
  },
  {
    id: 22,
    name: 'Standing quad stretch',
    description:
      'Pull your foot towards your glutes, knees together, hips pushed slightly forward. Hold something for balance.',
    figure: 'quadStanding',
    perLeg: true
  },
  {
    id: 18,
    name: 'Standing knee hug',
    description:
      'Pull one knee up towards your chest with both hands, standing tall on the other leg.',
    figure: 'kneeHug',
    perLeg: true
  },
  {
    id: 31,
    name: 'Butterfly groin stretch',
    description:
      'Sit with the soles of your feet together. Hold your feet and gently press the knees towards the floor.',
    figure: 'butterfly',
    perLeg: false
  },
  {
    id: 30,
    name: 'Lying spinal twist',
    description:
      'Lying on your back, bring one knee across your body towards the floor. Keep both shoulders down.',
    figure: 'lyingTwist',
    perLeg: true
  },
  {
    id: 50,
    name: 'Lying back curl',
    description:
      'On your back with knees bent, hands behind your head, curl gently up to release the lower back and abs.',
    figure: 'backCurl',
    perLeg: false
  },
  {
    id: 4,
    name: 'Forward bend with support',
    description:
      'Hold a bar or railing at hip height, step back and fold forward with a flat back to stretch shoulders and spine.',
    figure: 'barBend',
    perLeg: false
  },
  {
    id: 12,
    name: 'Kneeling reach',
    description:
      'From kneeling, sit back towards your heels and walk your hands forward, lengthening the back and sides.',
    figure: 'kneelingReach',
    perLeg: false
  },
  {
    id: 44,
    name: 'Toe and foot stretch',
    description:
      'Pull your toes gently back with your hand to stretch the sole of the foot and toe flexors.',
    figure: 'toeFlex',
    perLeg: true
  }
];

// Expands the exercise list into individual steps: per-leg exercises become
// two consecutive steps, left leg first, then right.
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
