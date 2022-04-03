import { useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import annotationPlugin from "chartjs-plugin-annotation";
import {
  calcDerivatives,
  calcExtremaIndxs,
  calcTrend,
  calcArea,
} from "../../helpers/computations";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

const LineChart = (props) => {
  const labels = props.stock.x;

const data = {
  labels,
  datasets: [
    {
      label: "closing price",
      data: props.stock.y,
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "support",
      borderColor: "rgba(18,146,16,255)",
      backgroundColor: "rgba(18,146,16,255)",
    },
    {
      label: "resistance",
      borderColor: "rgba(225,13,13,255)",
      backgroundColor: "rgba(225,13,13,255)",
    },
  ],
};
  useEffect(() => {
    const derivatives = calcDerivatives(props.stock.y); // Derivative calculation does not retireve perfect peaks and troughs
    const extremaIndxs = calcExtremaIndxs(derivatives);
    const adjustedClosingData = props.stock.y.slice(1, -1); // Trimed for alignment with derivatives

    const scale =
      (Math.max(...adjustedClosingData) - Math.min(...adjustedClosingData)) /
      adjustedClosingData.length;
    const fltpct = scale * props.errpct;

    const minTrends = calcTrend(
      extremaIndxs.minimaIndxs,
      adjustedClosingData,
      fltpct
    );
    const maxTrends = calcTrend(
      extremaIndxs.maximaIndxs,
      adjustedClosingData,
      fltpct
    );

    const trends = [...minTrends, ...maxTrends];

    let trendAreas = [];
    for (let i = 0; i < trends.length; i++) {
      trendAreas.push({
        trend: trends[i],
        area: calcArea(trends[i], adjustedClosingData),
      });
    }

    trendAreas.sort((a, b) => a.area - b.area);

    let minTrendByArea = trendAreas[0];
    let maxTrendByArea = trendAreas[trendAreas.length - 1];

    // // DISPLAY TRENDS BY MIN AND MAX AREAS
    // allData.push(minTrendByArea.trend);
    // allData.push(maxTrendByArea.trend);

    let annotationLine = {
      type: "line",
      mode: "horizontal",
      yMin: 0,
      yMax: 0,
      borderColor: "rgb(75, 192, 192)",
      borderWidth: 2,
      // label: {
      //   enabled: true,
      //   content: "Trendline",
      //   yAdjust: -16,
      // },
    };

    let resistanceLine = { ...annotationLine };
    let supportLine = { ...annotationLine };
    resistanceLine.yMin = minTrendByArea.trend.b;
    resistanceLine.yMax =
      minTrendByArea.trend.m * adjustedClosingData.length +
      minTrendByArea.trend.b;
    resistanceLine.borderColor = "rgba(225,13,13,255)";
    supportLine.yMin = maxTrendByArea.trend.b;
    supportLine.yMax =
      maxTrendByArea.trend.m * adjustedClosingData.length +
      maxTrendByArea.trend.b;
    supportLine.borderColor = "rgba(18,146,16,255)";

    props.changeSupportLine(supportLine);
    props.changeResistanceLine(resistanceLine);
  }, [props.stock, props.errpct]);

  return (
    <Line
      data={data}
      options={{
        plugins: {
          annotation: {
            annotations: [props.supportLine, props.resistanceLine],
          },
        },
      }}
    />
  );
};

export default LineChart;
