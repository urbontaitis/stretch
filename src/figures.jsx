// Stretch illustrations cut from the original "Važiavimas dviračiu" cycling
// chart scan. Files are named by their chart number and oriented as printed —
// mirrored via CSS for the right-leg pass of per-leg stretches.
import hamstringSupport from './figures/37.png';
import calfWall from './figures/40.png';
import quadStanding from './figures/22.png';
import kneeHug from './figures/18.png';
import butterfly from './figures/31.png';
import lyingTwist from './figures/30.png';
import backCurl from './figures/50.png';
import barBend from './figures/4.png';
import kneelingReach from './figures/12.png';
import toeFlex from './figures/44.png';

const FIGURES = {
  hamstringSupport,
  calfWall,
  quadStanding,
  kneeHug,
  butterfly,
  lyingTwist,
  backCurl,
  barBend,
  kneelingReach,
  toeFlex
};

export function Figure({ name, mirrored = false }) {
  return (
    <img
      src={FIGURES[name]}
      alt=""
      aria-hidden="true"
      draggable="false"
      className={mirrored ? 'figure mirrored' : 'figure'}
    />
  );
}
