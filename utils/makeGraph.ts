import { Skia } from "@shopify/react-native-skia";
import { curveBasis, line, scaleLinear, scaleTime } from "d3";
import { parse } from "react-native-redash";
import { GRAPH_HEIGHT, GRAPH_WIDTH } from "../constants";
import { DataPoint, GraphData } from "../types";

// reference making line https://observablehq.com/@d3/d3-line
// reference curveCardinal https://github.com/d3/d3-shape/blob/main/README.md#curveCardinal

const makeGraph = (data: DataPoint[]): GraphData => {
  const maxValue = Math.max(...data.map((dataPoint) => dataPoint.value));
  const minValue = Math.min(...data.map((dataPoint) => dataPoint.value));

  const dates: Date[] = data.map((d) => new Date(d.date));
  const maxDate = new Date(Math.max.apply(null, dates));
  const minDate = new Date(Math.min.apply(null, dates));

  const walkY = scaleLinear().domain([0, maxValue]).range([GRAPH_HEIGHT, 0]);

  const walkX = scaleTime().domain([minDate, maxDate]).range([0, GRAPH_WIDTH]);

  const curvedLine = line<DataPoint>()
    .x((dataPoint) => walkX(new Date(dataPoint.date)))
    .y((dataPoint) => walkY(dataPoint.value))
    .curve(curveBasis)(data);

  const parsedPath = parse(curvedLine);

  const skPath = Skia.Path.MakeFromSVGString(curvedLine);

  return {
    max: maxValue,
    min: minValue,
    curve: skPath,
    parsedPath,
  };
};

export default makeGraph;
