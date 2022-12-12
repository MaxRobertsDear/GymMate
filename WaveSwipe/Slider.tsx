import React from "react";
import { StyleSheet, View } from "react-native";

import Wave, { HEIGHT, MARGIN_WIDTH, Side, WIDTH } from "./Wave";
import Button from "./Button";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { snapPoint, useVector } from "react-native-redash";

const PREV = WIDTH;
const NEXT = 0;

interface SliderProps {
  index: number;
  setIndex: (value: number) => void;
  current: JSX.Element;
  prev?: JSX.Element;
  next?: JSX.Element;
}

const Slider = ({ index, current, prev, next, setIndex }: SliderProps) => {
  const hasPrev = !!prev;
  const hasNext = !!next;

  const activeSide = useSharedValue(Side.NONE);
  const left = useVector();
  const right = useVector();

  const isTransitioningLeft = useSharedValue(false);
  const isTransitioningRight = useSharedValue(false);

  const panGesture = Gesture.Pan()
    .onBegin((event) => {
      if (event.x <= MARGIN_WIDTH) {
        activeSide.value = Side.LEFT;
      } else if (event.x >= WIDTH - MARGIN_WIDTH) {
        activeSide.value = Side.RIGHT;
      } else {
        activeSide.value = Side.NONE;
      }
    })
    .onUpdate((event) => {
      if (activeSide.value === Side.LEFT) {
        left.x.value = event.x;
        left.y.value = event.y;
      } else if (activeSide.value === Side.RIGHT) {
        right.x.value = WIDTH - event.x;
        right.y.value = event.y;
      }
    })
    .onEnd((event) => {
      if (activeSide.value === Side.LEFT) {
        const snapPoints = [MARGIN_WIDTH, WIDTH];
        const destination = snapPoint(event.x, event.velocityX, snapPoints);
        isTransitioningLeft.value = destination === WIDTH;
        left.x.value = withSpring(
          destination,
          {
            velocity: event.velocityX,
            overshootClamping: isTransitioningLeft.value ? true : false,
            restSpeedThreshold: isTransitioningLeft.value ? 100 : 0.01,
            restDisplacementThreshold: isTransitioningLeft.value ? 100 : 0.01,
          },
          () => {
            if (isTransitioningLeft.value) {
              runOnJS(setIndex)(index - 1);
            }
          }
        );
      } else if (activeSide.value === Side.RIGHT) {
        const snapPoints = [WIDTH - MARGIN_WIDTH, 0];
        const destination = snapPoint(event.x, event.velocityX, snapPoints);
        isTransitioningRight.value = destination === 0;
        right.x.value = withSpring(
          WIDTH - destination,
          {
            velocity: event.velocityX,
            overshootClamping: isTransitioningRight.value ? true : false,
            restSpeedThreshold: isTransitioningRight.value ? 100 : 0.01,
            restDisplacementThreshold: isTransitioningRight.value ? 100 : 0.01,
          },
          () => {
            if (isTransitioningRight.value) {
              runOnJS(setIndex)(index + 1);
            }
          }
        );
      }
    });

  React.useEffect(() => {
    left.x.value = withSpring(MARGIN_WIDTH);
    right.x.value = withSpring(MARGIN_WIDTH);
  }, [left.x, right.x]);

  const leftStyle = useAnimatedStyle(() => ({
    zIndex: activeSide.value === Side.LEFT ? 100 : 0,
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[StyleSheet.absoluteFill, leftStyle]}>
        {current}
        {prev && (
          <Animated.View style={[StyleSheet.absoluteFill]}>
            <Wave position={left} side={Side.LEFT}>
              {prev}
            </Wave>
          </Animated.View>
        )}
        {next && (
          <View style={StyleSheet.absoluteFill}>
            <Wave position={right} side={Side.RIGHT}>
              {next}
            </Wave>
          </View>
        )}
      </Animated.View>
    </GestureDetector>
  );
};

export default Slider;
