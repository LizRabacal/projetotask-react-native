import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Navigator from "./src/Navigator";
import TasksProvider from "./src/context/TasksContext";
import UserProvider from "./src/context/UserProvider";
import moment from "moment";


export default function App() {
  moment.locale("pt-br");

  return (
    <TasksProvider>
    <UserProvider>

      <Navigator />
      
    </TasksProvider>
    </UserProvider>
  );
}
