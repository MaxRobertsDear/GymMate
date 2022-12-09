import { ImageSourcePropType } from "react-native";

export interface Product {
  title: string;
  colorPrimary: string;
  colorSecondary: string;
  aspectRatio: number;
  picture: ImageSourcePropType;
}

export const products: Product[] = [
  {
    title: "Credit",
    colorPrimary: "#f8a7fd",
    colorSecondary: "#f9b8fd",
    picture: require("./assets/Variant1.png"),
    aspectRatio: 0.6295,
  },

  {
    title: "Loans",
    colorPrimary: "#fd9b9b",
    colorSecondary: "#fdafaf",
    picture: require("./assets/Variant2.png"),
    aspectRatio: 0.6295,
  },
  {
    title: "BNPL",
    colorPrimary: "#bb94fd",
    colorSecondary: "#c9a9fd",
    picture: require("./assets/Variant3.png"),
    aspectRatio: 0.6295,
  },
];
