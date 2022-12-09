import React from "react";
import {
  Dimensions,
  View,
  StyleSheet,
  TouchableWithoutFeedbackBase,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolateColor,
  withTiming,
} from "react-native-reanimated";
import { Audio } from "expo-av";
import { products } from "./Model";
import Card, { CARD_HEIGHT } from "./Card";
import Products from "./Products";
import { Ionicons } from "@expo/vector-icons";

const styles = StyleSheet.create({
  slider: { height: CARD_HEIGHT },
});

const MENU_ITEM_SIZE = 60;
const { width, height } = Dimensions.get("window");

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

  const isToggled = useSharedValue(false);
  const toggleMenu = () => {
    isToggled.value = !isToggled.value;
    playSound();
  };

  const menuItemLeft = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: isToggled.value ? withTiming(-45) : withTiming(0),
      },
      {
        translateX: isToggled.value ? withTiming(-60) : withTiming(0),
      },
    ],
    opacity: isToggled.value ? withTiming(1) : withTiming(0),
  }));
  const menuItemCenter = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: isToggled.value ? withTiming(-70) : withTiming(0),
      },
    ],
    opacity: isToggled.value ? withTiming(1) : withTiming(0),
  }));
  const menuItemRight = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: isToggled.value ? withTiming(-45) : withTiming(0),
      },
      {
        translateX: isToggled.value ? withTiming(60) : withTiming(0),
      },
    ],
    opacity: isToggled.value ? withTiming(1) : withTiming(0),
  }));

  const [sound, setSound] = React.useState<Audio.Sound>();

  async function playSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      require("./assets/mixkit-money-bag-drop-1989.mp3")
    );
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  }

  React.useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

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
      <View
        style={{
          width,
          height: height / 2,
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Animated.View
          style={[
            {
              width: MENU_ITEM_SIZE,
              position: "absolute",
              bottom: 40,
              alignSelf: "center",
              borderRadius: MENU_ITEM_SIZE / 2,
              height: MENU_ITEM_SIZE,
            },
            menuItemLeft,
          ]}
        >
          <Ionicons
            name={"pie-chart"}
            size={MENU_ITEM_SIZE}
            color={"white"}
            style={{ alignSelf: "center" }}
          />
        </Animated.View>
        <Animated.View
          style={[
            {
              width: MENU_ITEM_SIZE,
              position: "absolute",
              bottom: 40,
              alignSelf: "center",
              borderRadius: MENU_ITEM_SIZE / 2,
              height: MENU_ITEM_SIZE,
            },
            menuItemCenter,
          ]}
        >
          <Ionicons
            name={"cash"}
            size={MENU_ITEM_SIZE}
            color={"white"}
            style={{ alignSelf: "center" }}
          />
        </Animated.View>
        <Animated.View
          style={[
            {
              width: MENU_ITEM_SIZE,
              position: "absolute",
              bottom: 40,
              alignSelf: "center",
              borderRadius: MENU_ITEM_SIZE / 2,
              height: MENU_ITEM_SIZE,
            },
            menuItemRight,
          ]}
        >
          <Ionicons
            name={"bar-chart-outline"}
            size={MENU_ITEM_SIZE}
            color={"white"}
            style={{ alignSelf: "center" }}
          />
        </Animated.View>
        <Pressable
          style={{
            width: MENU_ITEM_SIZE * 1.4,
            bottom: 30,
            borderRadius: (MENU_ITEM_SIZE * 1.4) / 2,
            height: MENU_ITEM_SIZE * 1.4,
          }}
          onPress={toggleMenu}
        >
          <Ionicons
            name={"add-circle"}
            size={MENU_ITEM_SIZE * 1.4}
            color={"white"}
            style={{ alignSelf: "center" }}
          />
        </Pressable>
      </View>
    </Animated.View>
  );
};

export default Zable;
