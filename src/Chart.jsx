import React, { useLayoutEffect, useRef } from "react";
import { arrayOf, number } from "prop-types";
import Chart from "chart.js";
import zip from "lodash.zip";
import merge from "lodash.merge";
import {
  possiblePatterns,
  patternReducer,
  averageReducer,
  minWeekReducer,
} from "./v2/optimizer";
import { Box } from "@material-ui/core";
import { useDebounce } from "react-use";
import i18n from "./i18n";

const generateData = (filter) => {
  let patterns = possiblePatterns(filter);
  const patternCount = patterns.reduce((acc, cur) => acc + cur.length, 0);
  if (patternCount === 0) patterns = possiblePatterns([0, ...filter.slice(1)]);
  const minMaxPattern = patternReducer(patterns);
  const minMaxData = zip(...minMaxPattern);
  const avgPattern = patternReducer(patterns, averageReducer);
  const avgData = zip(...avgPattern);
  const [minWeekValue] = patternReducer(patterns, minWeekReducer);

  return [
    {
      label: i18n.t("Buy Price"),
      data: new Array(12).fill(filter[0] || null),
      fill: true,
      backgroundColor: "transparent",
      borderColor: "#7B6C53",
      pointRadius: 0,
      pointHoverRadius: 0,
      borderDash: [5, 15],
    },
    {
      label: i18n.t("Guaranteed Min"),
      data: new Array(12).fill(minWeekValue || null),
      fill: true,
      backgroundColor: "transparent",
      borderColor: "#007D75",
      pointRadius: 0,
      pointHoverRadius: 0,
      borderDash: [3, 6],
    },
    {
      label: i18n.t("Daily Price"),
      data: Array.from({ length: 12 }, (v, i) => filter[i + 1] || null),
      fill: false,
      backgroundColor: "#EF8341",
      borderColor: "#EF8341",
    },
    {
      label: i18n.t("Average"),
      data: avgData[0] ? avgData[0].map(Math.trunc) : new Array(12).fill(null),
      backgroundColor: "#F0E16F",
      borderColor: "#F0E16F",
      pointRadius: 0,
      fill: false,
    },
    {
      label: i18n.t("Maximum"),
      data: minMaxData[1] || new Array(12).fill(null),
      backgroundColor: "#A5D5A5",
      borderColor: "#A5D5A5",
      pointRadius: 0,
      pointHoverRadius: 0,
      fill: 3,
    },
    {
      label: i18n.t("Minimum"),
      data: minMaxData[0] || new Array(12).fill(null),
      backgroundColor: "#88C9A1",
      borderColor: "#88C9A1",
      pointRadius: 0,
      pointHoverRadius: 0,
      fill: 3,
    },
  ];
};

const ChartComponent = ({ filter }) => {
  const canvas = useRef();
  const chart = useRef();

  useLayoutEffect(() => {
    const ctx = canvas.current.getContext("2d");
    Chart.defaults.global.defaultFontFamily = "Arial Rounded MT Bold";
    chart.current = new Chart(ctx, {
      type: "line",
      data: {
        datasets: generateData(filter),
        labels: i18n
          .t("Mon Tue Wed Thu Fri Sat")
          .split(" ")
          .reduce(
            (acc, day) => [
              ...acc,
              `${day} ${i18n.t("AM")}`,
              `${day} ${i18n.t("PM")}`,
            ],
            []
          ),
      },
      options: {
        maintainAspectRatio: false,
        showLines: true,
        tooltips: {
          intersect: false,
          mode: "index",
        },
        scales: {
          yAxes: [
            {
              gridLines: {
                display: false,
              },
              ticks: {
                suggestedMin: 0,
                suggestedMax: 300,
              },
            },
          ],
        },
        elements: {
          line: {
            cubicInterpolationMode: "monotone",
          },
        },
      },
    });
  }, []);

  useDebounce(
    () => {
      if (!chart.current) return;
      const newData = generateData(filter);
      merge(chart.current.data.datasets, newData);
      chart.current.update();
    },
    500,
    [filter]
  );

  return (
    <Box p={2} mt={2} borderRadius={16} bgcolor="bkgs.chart">
      <canvas ref={canvas} width={600} height={400} />
    </Box>
  );
};

ChartComponent.propTypes = {
  filter: arrayOf(number).isRequired,
};

export default ChartComponent;
