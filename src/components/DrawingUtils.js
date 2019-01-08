exports.findRange = function(obs, accessor) {
  if (obs.length) {
    let initRange = [obs[0][accessor], obs[0][accessor]];
    return obs.reduce((agg, curr) => {
      return [
        curr[accessor] < agg[0] ? curr[accessor] : agg[0],
        curr[accessor] > agg[1] ? curr[accessor] : agg[1]
      ];
    }, initRange);
  }
};

exports.scaleVal = (multiplier, minSize, valRange) => val =>
  minSize + ((val - valRange[0]) / (valRange[1] - valRange[0])) * multiplier;

exports.getMonthName = v =>
  [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ][v];
