import React from "react";
import { Dimensions, View, StyleSheet, Text } from "react-native";

import { Product } from "./Model";

const { width } = Dimensions.get("window");
export const CARD_HEIGHT = width * 1;
const styles = StyleSheet.create({
  container: {
    width,
    height: CARD_HEIGHT,
    marginTop: 30,
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    color: "white",
    marginBottom: 16,
  },
});

interface CardProps {
  product: Product;
}

const Card = ({ product: { colorPrimary, title } }: CardProps) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          borderRadius: 16,
          margin: 32,
          flex: 1,
          backgroundColor: colorPrimary,
          padding: 16,
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
    </View>
  );
};

export default Card;
