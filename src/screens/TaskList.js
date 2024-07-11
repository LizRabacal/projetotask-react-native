import React, { Component, useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  PlatForm
} from "react-native";
import { TasksContext } from "../context/TasksContext";
import todayImage from "../../assets/imgs/today.jpg";
import moment from "moment";
import CommonStyles from "../CommonStyles";
import "moment/locale/pt-br";
import { List } from "react-native-paper";
import Task from "../components/Task";
import Icon from "react-native-vector-icons/FontAwesome";
import { Ionicons } from "@expo/vector-icons";
import AddTask from "./AddTask";
import { Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";



export default function TaskList() {
  const { state, dispatch } = useContext(TasksContext);
  const [tasks, setTasks] = useState(state);
  const [showAddTask, setShowAddTask] = useState(false);
  const [filter, setFilter] = useState("done");

  useEffect(
    () => {
      setTasks(state);
      AsyncStorage.setItem("state", JSON.stringify(state));
    },
    [state]
  );

 

  const toggleFilter = () => {
    if (filter == "done") {
      setTasks(state.filter(s => s.doneAt !== null));
      setFilter("undone");
    } else {
      setTasks(state.filter(s => s.doneAt == null));
      setFilter("done");
    }
  };

  const today = moment().locale("pt-br").format("ddd, D [de] MMMM");

  return (
    <View style={styles.container}>
      <AddTask isVisible={showAddTask} onCancel={() => setShowAddTask(false)} />
      <ImageBackground style={styles.background} source={todayImage}>
        <View style={styles.iconBar} />
        <TouchableOpacity onPress={() => toggleFilter()}>
          {filter == "done"
            ? <Ionicons
                name="checkmark-done-circle-outline"
                size={40}
                color="white"
              />
            : <Ionicons name="checkmark-done-circle" size={40} color="white" />}
        </TouchableOpacity>

        <View style={styles.titleBar}>
          <Text style={styles.title}>Hoje:</Text>
          <Text style={styles.today}>
            {today}
          </Text>
        </View>
      </ImageBackground>
      <View style={styles.taskList}>
        <List.Section>
          <List.Subheader>Lista de tarefas</List.Subheader>

          <FlatList
            data={tasks}
            keyExtractor={item =>
              `${item.id 
              }`}
            renderItem={({ item }) =>
              <Task {...item} toggleFilter={toggleFilter} />}
          />
        </List.Section>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddTask(true)}
      >
        <Icon name="plus" color={CommonStyles.colors.secondary} size={20} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  background: {
    padding: 25,
    flex: 3
  },
  taskList: {
    margin: 10,
    flex: 7
  },
  titleBar: {
    flex: 1,
    justifyContent: "flex-end"
  },
  title: {
    fontFamily: CommonStyles.fontFamily,
    fontSize: 50,
    color: CommonStyles.colors.secondary,
    marginLeft: 20
  },
  today: {
    fontFamily: CommonStyles.fontFamily,
    fontSize: 20,
    color: CommonStyles.colors.secondary,
    marginLeft: 20
  },
  iconBar: {
    marginTop: 50,
    flexDirection: "row"
  },
  addButton: {
    position: "absolute",
    right: 30,
    bottom: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: CommonStyles.colors.today,
    justifyContent: "center",
    alignItems: "center"
  }
});
