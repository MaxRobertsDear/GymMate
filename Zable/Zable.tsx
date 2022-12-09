import React from "react";
import { Dimensions, View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolateColor,
} from "react-native-reanimated";

import { products } from "./Model";
import Card, { CARD_HEIGHT } from "./Card";
import Products from "./Products";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  slider: { height: CARD_HEIGHT },
});

const Zable = () => {
  const translateX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      translateX.value = event.contentOffset.x;
    },
  });
  const style = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      translateX.value,
      products.map((_, i) => width * i),
      products.map((product) => product.colorSecondary)
    ) as string;
    return { flex: 1, backgroundColor };
  });
  return (
    <Animated.View style={style}>
      <View style={styles.slider}>
        <Animated.ScrollView
          onScroll={onScroll}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToInterval={width}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {products.map((product, index) => (
            <Card product={product} key={index} />
          ))}
        </Animated.ScrollView>
        <Products x={translateX} />
      </View>
    </Animated.View>
  );
};

export default Zable;
