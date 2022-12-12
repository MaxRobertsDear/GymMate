import React from "react";
import Zable from "./Zable";
import WaveSwipe from "./WaveSwipe/WaveSwipe";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LineChart from "./LineChart/LineChart";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

const Tab = createBottomTabNavigator();
const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen name="Line Chart" component={LineChart} />
          <Tab.Screen name="Zable Smooth" component={Zable} />
          <Tab.Screen name="Zable Quirky" component={WaveSwipe} />
        </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
