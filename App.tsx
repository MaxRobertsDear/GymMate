import {
  Canvas,
  Circle,
  Easing,
  Group,
  Paint,
  Path,
  runTiming,
  SkiaValue,
  useComputedValue,
  useTouchHandler,
  useValue,
  SkiaMutableValue,
  runDecay,
} from "@shopify/react-native-skia";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import { GRAPH_HEIGHT, GRAPH_WIDTH } from "./constants";
import { originalData } from "./Data";
import makeGraph from "./utils/makeGraph";
import sliceIntoChunks from "./utils/sliceIntoChunks";
import { Picker } from "@react-native-picker/picker";
import { getYForX } from "react-native-redash";

const GRAPH_COLOUR = "#F7B49E";

enum GOING {
  FORWARD = "FORWARD",
  BACK = "BACK",
}

type TransitionState = {
  going: GOING;
  prevChart: number;
  currentChart: number;
  nextChart: number;
};

interface CursorProps {
  x: SkiaValue<number>;
  y: SkiaValue<number>;
}

const Cursor: React.FC<CursorProps> = ({ x, y }) => {
  const transform = useComputedValue(
    () => [{ translateX: x.current }, { translateY: y.current }],
    [x]
  );
  return (
    <Group transform={transform}>
      <Circle cx={0} cy={0} r={27} color={GRAPH_COLOUR} opacity={0.15} />
      <Circle cx={0} cy={0} r={18} color={GRAPH_COLOUR} opacity={0.15} />
      <Circle cx={0} cy={0} r={9} opacity={0.15}>
        <Paint style="stroke" strokeWidth={2} color="white" />
      </Circle>
    </Group>
  );
};

export const useGraphTouchHandler = (x: SkiaMutableValue<number>) => {
  const onTouch = useTouchHandler({
    onActive: (pos) => {
      x.current = pos.x;
    },
    onEnd: (event) => {
      runDecay(x, { velocity: event.velocityX, clamp: [0, GRAPH_WIDTH] });
    },
  });
  return onTouch;
};

const App = () => {
  const [dateRange, setDateRange] = React.useState<number>(15);
  const chunkedGraphs = React.useMemo(
    () => sliceIntoChunks(originalData, dateRange),
    [dateRange]
  );

  const graphData = chunkedGraphs.map((graph) => makeGraph(graph));

  const isTransitionCompleted = useValue(1);
  const transitionState = useValue<TransitionState>({
    going: GOING.BACK,
    prevChart: 0,
    currentChart: 1,
    nextChart: 2,
  });

  const transitionCharts = (target: number) => {
    const going =
      target > transitionState.current.currentChart
        ? GOING.FORWARD
        : GOING.BACK;
    if (
      (transitionState.current.nextChart === chunkedGraphs.length &&
        going === GOING.FORWARD) ||
      (transitionState.current.prevChart < 0 && going === GOING.BACK)
    )
      return;
    transitionState.current = {
      going,
      prevChart: target - 1,
      currentChart: target,
      nextChart: target + 1,
    };

    isTransitionCompleted.current = 0;

    runTiming(isTransitionCompleted, 1, {
      duration: 500,
      easing: Easing.inOut(Easing.cubic),
    });
  };

  const toggleNextChart = () =>
    transitionCharts(transitionState.current.currentChart + 1);
  const togglePrevChart = () =>
    transitionCharts(transitionState.current.currentChart - 1);
  const toggleResetChart = () => transitionCharts(0);

  const currentPath = useComputedValue(() => {
    const destChart =
      transitionState.current.going === GOING.BACK &&
      !graphData[transitionState.current.prevChart]
        ? transitionState.current.nextChart
        : transitionState.current.going === GOING.FORWARD &&
          !graphData[transitionState.current.nextChart]
        ? transitionState.current.prevChart
        : transitionState.current.going === GOING.FORWARD
        ? transitionState.current.nextChart
        : transitionState.current.prevChart;

    const start = graphData[transitionState.current.currentChart].curve;
    const end = graphData[destChart].curve;

    const curve = start.interpolate(end, isTransitionCompleted.current) ?? "";
    return curve ? curve.toSVGString() : "";
  }, [transitionState, isTransitionCompleted, dateRange]);
  const x = useValue(0);
  const y = useComputedValue(() => {
    return getYForX(
      graphData[transitionState.current.currentChart].parsedPath,
      x.current
    );
  }, [transitionState, x]);
  const onTouch = useGraphTouchHandler(x);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Canvas
        style={{ height: GRAPH_HEIGHT, width: GRAPH_WIDTH }}
        onTouch={onTouch}
      >
        <Path
          path={currentPath}
          color={GRAPH_COLOUR}
          strokeWidth={4}
          style={"stroke"}
        />
        <Cursor x={x} y={y} />
      </Canvas>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          width: "100%",
        }}
      >
        <Pressable onPress={togglePrevChart}>
          <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
            Previous
          </Text>
        </Pressable>
        <Pressable onPress={toggleNextChart}>
          <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
            Next
          </Text>
        </Pressable>
      </View>
      <Picker
        selectedValue={dateRange}
        onValueChange={(itemValue, itemIndex) => {
          toggleResetChart();
          setDateRange(itemValue);
        }}
        style={{ width: GRAPH_WIDTH * 0.5, color: "white", marginTop: 20 }}
        itemStyle={{ color: "white", fontWeight: "600" }}
      >
        {Array.from({ length: 5 }, (v, i) => {
          const value = (i + 1) * 5;
          return <Picker.Item key={i} label={value.toString()} value={value} />;
        })}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#192649",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
