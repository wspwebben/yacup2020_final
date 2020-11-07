function getCoordinates(dron) {
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
  return function (dron) {
    const coordinates = getCoordinates(dron);

    return (
      info.top === coordinates.top &&
      info.left === coordinates.left &&
      info.right === coordinates.right &&
      info.bottom === coordinates.bottom
    );
  };
}

function solution(dron, info, size) {
  const { top, left, right } = info;
  const compareWithInfo = compareCoordinates(info);
  const rightBound = size - right;

  let direction = 1;

  const changeDirection = () => direction *= -1;

  function moveAndCheck(to) {
    let { x, y } = to;

    if (x < left || x > rightBound) {
      changeDirection();
      y += 1;
    }
    x += direction;

    return dron.move([x, y])
      .then(isLanded => {
        if (!isLanded) {
          return moveAndCheck({ x: x + direction, y })
        }

        return compareWithInfo(dron)
          .then(isDownfall => {
            if (isDownfall) {
              return [x, y]
            }

            return moveAndCheck({ x: x + direction, y })
          })
      })
  }

  return moveAndCheck({ x: top, y: left });
}

module.exports = solution;
