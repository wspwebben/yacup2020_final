async function getCoordinates(dron) {
  const [top, left, right, bottom] = Promise.all([
    dron.top(),
    dron.left(),
    dron.right(),
    dron.bottom(),
  ]);

  return {
    top,
    left,
    right,
    bottom,
  };
}

function compareCoordinates(info) {
  return function (coordinates) {
    return (
      info.top === coordinates.top &&
      info.left === coordinates.left &&
      info.right === coordinates.right &&
      info.bottom === coordinates.bottom
    );
  };
}

async function solution(dron, info, size) {
  const { top, left, right, bottom } = info;
  const compareWithInfo = compareCoordinates(info);
  // start from 1, since 0,0 is dron's lo
  for (let y = top; y <= size - bottom; y += 1) {
    for (let x = left; x <= size - right; x += 1) {
      if (x == 0 && y == 0) continue;

      const moved = await dron.move([x, y]);
      if (moved) {
        const coordinates = await getCoordinates(dron);
        const isDownfall = compareWithInfo(coordinates);

        if (isDownfall) return [x, y]
      }
    }
  }
}

module.exports = solution;
