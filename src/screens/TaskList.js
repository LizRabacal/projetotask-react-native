import React, { Component, useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  PlatForm,
  Alert
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
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { server, showError, showSuccess } from "../Common";
import { Entypo } from '@expo/vector-icons';
export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [shownTasks, setShownTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [filter, setFilter] = useState("done");
  const { dispatch } = useContext(UserContext);
  const { state: estado } = useContext(UserContext);
  const { user } = estado;
  const { headerAuth } = estado;

  useEffect(
    () => {
      if (!user) {
        props.navigation.navigate("Auth");
      }
    },
    [user]
  );



  useEffect(
    () => {
    setShownTasks(tasks)
        setFilter("all")

    },
    [tasks]
  );




  const fetchData = async () => {
    try {
      const res = await axios.get(`${server}/task`, {
        headers: {
          Authorization: headerAuth
        }
      });
      setTasks(res.data);
    } catch (error) {
      showError(error);
      return [];
    }
  };



  useEffect(() => {
    fetchData();
    setFilter("all")

  }, []);

 

  const toggleFilter = () => {
    if (filter == "done") {
      setShownTasks(tasks.filter(s => s.doneAt !== null));
      setFilter("undone");
    } else {
      setShownTasks(tasks.filter(s => s.doneAt == null));
      setFilter("done");
    }
  };


  //Marcar como feito
  const onPressDone = async id => {
    try {
      await axios.put(
        `${server}/tasksToggle/${id}`,
        {},
        { headers: { Authorization: headerAuth } }
      );
      setTasks(tasks.map(task => task.id === id ? { ...task, doneAt: task.doneAt === null ? new Date() : null } : task));
    

      
    } catch (error) {
      showError(error);
    }
  };



  //DELETAR

  const handleRemoveTask = async (id) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Você tem certeza que deseja excluir esta tarefa?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              await axios.delete(`${server}/task/${id}`, {
                headers: {
                  Authorization: headerAuth 
                }
              });

              setTasks(tasks.filter(task => task.id !== id));

              showSuccess("Deletado com sucesso!");
            } catch (error) {
              showError(error);
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const allTasks = () =>{
    setFilter("all")
    setShownTasks(tasks);
  }




  const today = moment().locale("pt-br").format("ddd, D [de] MMMM");

  return (
    <View style={styles.container}>
      <AddTask isVisible={showAddTask} onCancel={() => setShowAddTask(false)} />

      <ImageBackground style={styles.background} source={todayImage}>


        <View style={styles.iconBar} >
           <TouchableOpacity style={{marginBottom:10}} onPress={() => toggleFilter()}>
          {filter == "done"
            ? 
            (<>
            <Ionicons
                name="checkmark-done-circle-outline"
                size={40}
                color="white"
              /><Text style={styles.t}>Ver tarefas feitas</Text></>)
            : 
            (<>
            <Ionicons name="checkmark-done-circle" size={40} color="white" /><Text style={styles.t}>Ver tarefas não Feitas</Text></>)
            } 


        </TouchableOpacity>
        <TouchableOpacity onPress={() => dispatch({type: "LOGOUT"})} style={{position: "relative", left: 160}}>
                  <Entypo name="log-out" size={34} color="white" />
        </TouchableOpacity>

         


        </View>

        <View style={styles.titleBar}>
          <Text style={styles.title}>Hoje:</Text>
          <Text style={styles.today}>
            {today}
          </Text>
        </View>
      </ImageBackground>
      <View style={styles.taskList}>
        <List.Section>
          <List.Subheader style={{alignItems: "center", justifyContent: "center"}}>
            {filter == "done" ? <Text>Tarefas feitas</Text> : filter== "undone" ? <Text>Tarefas não feitas</Text> : <Text>Lista de tarefas</Text>}
            {(filter == "done" || filter=="undone") && (
                <TouchableOpacity style={{marginBottom:0}} onPress={() => allTasks()}>
          <Text style={{marginLeft: 10, position: "absolute", bottom: -2, color: "red"}}>Ver todas</Text>
        </TouchableOpacity>
            )}

          </List.Subheader>

          <FlatList
            data={shownTasks}
            keyExtractor={item => `${item.id}`}
            renderItem={({ item }) =>
              <Task {...item} toggleFilter={toggleFilter} handleRemoveTask={handleRemoveTask} onPressDone={onPressDone} />}
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
    fontSize: 40,
    color: CommonStyles.colors.secondary,
    marginLeft: 20,
  },
  today: {
    fontFamily: CommonStyles.fontFamily,
    fontSize: 20,
    color: CommonStyles.colors.secondary,
    marginLeft: 20
  },
  iconBar: {
    marginBottom: 20,
    flexDirection: 'row',
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
  },
  t:{
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
    color: 'white'
  }
});
