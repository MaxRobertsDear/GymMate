import { SkPath } from "@shopify/react-native-skia";

export type DataPoint = {
  date: string;
  value: number;
};

interface GraphData {
  min: number;
  max: number;
  curve: SkPath;
}
