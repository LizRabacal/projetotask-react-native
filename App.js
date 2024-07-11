import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import TaskList from "./src/screens/TaskList";
import TasksProvider from "./src/context/TasksContext";
import moment from "moment";


export default function App() {
  moment.locale("pt-br");

  return (
    <TasksProvider>
      <TaskList />
    </TasksProvider>
  );
}
