const getProportion = ({ w, h }) => Math.max(w, h) / Math.min(w, h)

function solution(frame, images) {
  const frameProportion = getProportion(frame);
  const imageProportions = images.map(image => Math.abs(getProportion(image) - frameProportion));

  const minDiff = Math.min(...imageProportions)
  return imageProportions.findIndex(diff => diff === minDiff);
}

module.exports = solution;

export default solution
