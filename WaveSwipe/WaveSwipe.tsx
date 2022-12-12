import React, { useState } from "react";

import Slider from "./Slider";
import Slide from "./Slide";

const slides = [
  {
    color: "#f8a7fd",
    title: "Credit",
    description:
      "Want to securely make online purchases? Why not sign up for Zable Credit!",
    picture: require("./assets/Variant1.png"),
  },
  {
    color: "#fd9b9b",
    title: "Loans",
    description: "Buy a car today. Pay for it in installments.",
    picture: require("./assets/Variant2.png"),
  },
  {
    color: "#bb94fd",
    title: "BNPL",
    description: "Buy now, pay later.",
    picture: require("./assets/Variant3.png"),
  },
];

export const assets = slides.map(({ picture }) => picture);

const LiquidSwipe = () => {
  const [index, setIndex] = useState(1);
  const prev = slides[index - 1];
  const next = slides[index + 1];
  return (
    <Slider
      key={index}
      index={index}
      setIndex={setIndex}
      prev={prev && <Slide slide={prev} />}
      current={<Slide slide={slides[index]!} />}
      next={next && <Slide slide={next} />}
    />
  );
};

export default LiquidSwipe;
