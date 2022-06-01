import "node-libs-react-native/globals";
import "react-native-polyfill-globals/auto";

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./Home";
import Send from "./Send";
import Receive from "./Receive";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          background: "#161616",
          primary: "#fff",
          border: "#fff",
          card: "#161616",
          notification: "#fff",
          text: "#fff",
        },
      }}
    >
      {/* @ts-ignore */}
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Send"
          component={Send}
          options={{
            headerBackTitleVisible: false,
            headerBackVisible: true,
          }}
        />
        <Stack.Screen
          name="Receive"
          component={Receive}
          options={{
            headerBackTitleVisible: false,
            headerBackVisible: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
