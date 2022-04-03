export const calcDerivatives = (data) => {
  // A default coefficient value of 1 for determining derivatives is sufficient for our purposes
  const h = 1;
  let derivatives = { first: [], second: [] };
  for (let x = h; x < data.length - h; x++) {
    let firstDerivative = (data[x + h] - data[x - h]) / (2 * h);
    let secondDerivative = (data[x - h] - 2 * data[x] + data[x + h]) / (h ^ 2);
    derivatives.first.push(firstDerivative);
    derivatives.second.push(secondDerivative);
  }
  return derivatives;
};

export const calcExtremaIndxs = (derivatives) => {
  let extremaIndxs = { minimaIndxs: [], maximaIndxs: [] };
  let previous = derivatives.first[0];
  for (let i = 1; i < derivatives.first.length; i++) {
    if (derivatives.first[i] === 0) {
      if (derivatives.second[i] < 0) {
        extremaIndxs.maximaIndxs.push(i);
      } else {
        extremaIndxs.minimaIndxs.push(i);
      }
    } else if (previous < 0 && 0 < derivatives.first[i]) {
      if (0 - previous < derivatives.first[i]) {
        // closer to previous
        if (derivatives.second[i - 1] < 0) {
          extremaIndxs.maximaIndxs.push(i - 1);
        } else {
          extremaIndxs.minimaIndxs.push(i - 1);
        }
      } else {
        // closer to current
        if (derivatives.second[i] < 0) {
          extremaIndxs.maximaIndxs.push(i);
        } else {
          extremaIndxs.minimaIndxs.push(i);
        }
      }
    } else if (previous > 0 && 0 > derivatives.first[i]) {
      if (previous < 0 - derivatives.first[i]) {
        // closer to previous
        if (derivatives.second[i - 1] < 0) {
          extremaIndxs.maximaIndxs.push(i - 1);
        } else {
          extremaIndxs.minimaIndxs.push(i - 1);
        }
      } else {
        // closer to current
        if (derivatives.second[i] < 0) {
          extremaIndxs.maximaIndxs.push(i);
        } else {
          extremaIndxs.minimaIndxs.push(i);
        }
      }
    }

    previous = derivatives.first[i];
  }
  // Remove dupplicates before returning
  extremaIndxs.minimaIndxs = [...new Set(extremaIndxs.minimaIndxs)];
  extremaIndxs.maximaIndxs = [...new Set(extremaIndxs.maximaIndxs)];
  return extremaIndxs;
};

const calcLineByLeastSquares = (values_x, values_y) => {
  let n = values_x.length;
  let x = 0;
  let y = 0;
  let sum_x = 0;
  let sum_y = 0;
  let xbar = 0;
  let ybar = 0;
  let calcSum1 = 0;
  let calcSum2 = 0;
  let calcSum3 = 0;

  for (let i = 0; i < n; i++) {
    x = values_x[i];
    y = values_y[i];
    sum_x += x;
    sum_y += y;
  }

  xbar = sum_x / n;
  ybar = sum_y / n;

  for (let i = 0; i < n; i++) {
    x = values_x[i];
    y = values_y[i];
    calcSum1 += (x - xbar) * (y - ybar);
    calcSum2 += (x - xbar) ** 2;
    calcSum3 += x ** 2;
  }

  let m = calcSum1 / calcSum2;
  let b = ybar - m * xbar;
  let yres = 0;
  let ssr = 0;

  for (let i = 0; i < n; i++) {
    x = values_x[i];
    y = values_y[i];
    yres = m * x + b;
    ssr += (y - yres) ** 2;
  }

  let stndrdErrorS = Math.sqrt(ssr / ((n - 2) * calcSum2));
  let stndrdErrorI = stndrdErrorS * Math.sqrt(calcSum3 / n);

  return [m, b, ssr, stndrdErrorS, stndrdErrorI];
};

export const calcTrend = (indxs, history, fltpct) => {
  let n = indxs.length;
  let slopes = [];
  let trend = [];
  //let trend = {x:[], y:[],  m:0, b:0, stndrdErrorS:0};
  let trends = [];

  for (let x = 0; x < n; x++) {
    slopes.push([]);
    for (let y = x + 1; y < n; y++) {
      let slope =
        (history[indxs[x]] - history[indxs[y]]) / (indxs[x] - indxs[y]);
      slopes[x].push([slope, y]);
    }
  }

  for (let x = 0; x < n; x++) {
    slopes[x].sort((a, b) => a[0] - b[0]);
    let curIndxs = [indxs[x]];

    for (let y = 0; y < slopes[x].length; y++) {
      curIndxs.push(indxs[slopes[x][y][1]]);

      if (curIndxs.length < 3) {
        continue;
      }

      let dataToFit = { values_x: [], values_y: [] };
      for (let i = 0; i < curIndxs.length; i++) {
        dataToFit.values_x.push(curIndxs[i]);
        dataToFit.values_y.push(history[curIndxs[i]]);
      }
      let res = calcLineByLeastSquares(dataToFit.values_x, dataToFit.values_y);
      if (res[3] <= fltpct) {
        curIndxs.sort((a, b) => a - b);
        if (curIndxs.length === 3) {
          trend.push([curIndxs, res]);
          
          // trend.x.push(curIndxs);
          // trend.y.push(res);
        } else {
          trend[trend.length-1] = [curIndxs, res];
          // trend.x[trend.length-1] = curIndxs;
          // trend.y[trend.length-1] = res;
        }
      } else {
        curIndxs = [curIndxs[0], curIndxs[curIndxs.length - 1]];
      }
    }
  }
  //return trend;

  // reformat trend data and push to an array with m, b and standard error of slope values
   // trend = {x: [x1, x2, ...], y: [y1, y2, ...], m, b, stndrdErrorS}
    for (let i = 0; i < trend.length; i++) {
      let m = trend[i][1][0];
      let b = trend[i][1][1];
      let newTrend = {
        x: trend[i][0],
        y: [],
        m: m,
        b: b,
        stndrdErrorS: trend[i][1][3],
      };
      for (let j = 0; j < trend[i][0].length; j++) {
        let x = trend[i][0][j];
        let y = m * x + b;
        newTrend.y.push(y);
      }
      trends.push(newTrend);
    }

  return trends;
};

export const calcArea = (trend, closingData) => {
  let m = trend.m;
  let b = trend.b;
  let riemannSum = 0;

  for (let x = 1; x < closingData.length; x++) {
    let lineY = m * x + b;
    let dataY = closingData[x];
    riemannSum += dataY - lineY;
  }
  return riemannSum;
};
