import { SkPath } from "@shopify/react-native-skia";
import { Path } from "react-native-redash";

export type DataPoint = {
  date: string;
  value: number;
};

interface GraphData {
  min: number;
  max: number;
  curve: SkPath;
  parsedPath: Path;
}
