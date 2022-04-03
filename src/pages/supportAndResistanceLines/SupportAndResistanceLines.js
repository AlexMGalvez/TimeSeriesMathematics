import ChartUI from "../../components/chart/chartUI/ChartUI";
import { Fragment } from "react";
import { MathJax } from "better-react-mathjax";
import Card from "../../components/UI/Card";

const SupportAndResistanceLines = () => {
  return (
    <Fragment>
      <h1>Computing Support and Resistance Lines in Javascript</h1>
      <p>
        Support and resistance lines are an essential visual asset for a stock
        trader to analyze the behaviour of a stock's trading range by setting
        the boundary lines for the price action of a given stock. The method for
        computing reliable support and resistance lines requires no more than
        some 1st year university level calculus and tweaking of paramaters until
        the best solution is found for your use case.
      </p>
      <p>
        Do not worry if you have no prior knowledge of calculus, for we will
        walk through the basics here and provide you with all the source code in
        javascript to get you started.
      </p>
      <ChartUI />
      <p>
        Choose your prefered stock and timeline from an api or historical data
        provider. We use BTC and GE historical data from yahoo finance in this
        example. Parse the data into a javascript object with paramater y as an
        array of strings representing the dates, and a paramater x as an array
        of numbers representing the data you want to caluclate trend lines on
        (we use closing price in this example). The format of your stock data
        object should look something like:
      </p>
      <Card>
        <pre>
          <code>{`const stockData =
  {
    name: "Bitcoin (BTC)",

    x: [
      "2021-05-18",
      "2021-05-19",
      "2021-05-20",
     ...
    ],
    y: [
      42909.402344, 37002.441406, 40782.738281, ...
    ]
  }`}</code>
        </pre>
      </Card>
      <p>
        {" "}
        The first mathematical operation that we perfrom on the stock data is a
        derivative calculation. The first derivative gives us an indication of
        the velocity of a given period for the price action (whether it is
        increasing or decreasing), and the second derivative measures the
        instantaneous rate of change of the first derivative. We calculate the
        numerical derivative using a centered 3-point method:
      </p>
      <Card>
        <MathJax>
          {"\\(First Derivative = \\frac{f(x+h)-f(x-h)}{2h}\\)"},{" "}
          {"\\(Second Derivative = \\frac{f(x-h)-2f(x)+f(x+h)}{h^2}\\)"} where h
          = 1
        </MathJax>
      </Card>
      <p>
        Start with the second element in your data array and perform the two
        derivative calulations on every y value until the second last element in
        your data array is reached. Be aware that we will want to adjust our
        original stock data array length by slicing off the first and last
        values so that we can align it with our new found derivatives arrays.{" "}
      </p>
      <Card>
        <pre>
          <code>{`const calcDerivatives = (data) => {
  const h = 1;
  let derivatives = { first: [], second: [] };
  for (let x = h; x < data.length - h; x++) {
    let firstDerivative = (data[x + h] - data[x - h]) / (2 * h);
    let secondDerivative = (data[x - h] - 2 * data[x] + data[x + h]) / (h ^ 2);
    derivatives.first.push(firstDerivative);
    derivatives.second.push(secondDerivative);
  }
  return derivatives;
};`}</code>
        </pre>
        <code>const derivatives = calcDerivatives(stockData.y);</code>
      </Card>

      <p>
        With a first and second derivative coinciding with every stock element
        we can now use them for determining all the extremas (peaks and troughs)
        in our data.
      </p>
      <h3>This article is incomplete and currently a work in progress.</h3>
    </Fragment>
  );
};

export default SupportAndResistanceLines;
