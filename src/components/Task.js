import React, { useContext } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { List } from "react-native-paper";
import CommonStyles from "../CommonStyles";
import "moment/locale/pt-br";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import moment from "moment";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { TasksContext } from "../context/TasksContext";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { server, showError, showSuccess } from "../Common";

export default props => {
  const { state: estado } = useContext(UserContext);
  const { headerAuth } = estado;
  const { dispatch } = useContext(TasksContext);


  
  const formatdate = date => {
    return moment(date).format("ddd, D [de] MMMM");
  };

  

  const Title = () => {
    return (
      <Text
        style={{
          textDecorationLine: props.doneAt !== null ? "line-through" : "none"
        }}
      >
        {props.desc}
      </Text>
    );
  };



 

  const Done = () => {
    return (
      <TouchableOpacity onPress={()=>props.onPressDone(props.id)}>
        <View
          style={[
            styles.isdone,
            props.doneAt !== null ? styles.done : styles.undone
          ]}
        >
          {props.doneAt !== null
            ? <MaterialIcons name="check" size={20} color="white" />
            : ""}
        </View>
      </TouchableOpacity>
    );
  };

  const getRightContent = () => {
    return (
      <TouchableOpacity style={styles.left} onPress={()=>props.handleRemoveTask(props.id)}>
        <Icon name="trash" style={styles.excludeIcon} color="white" size={30} />
        <Text style={styles.excludeText}>Excluir</Text>
      </TouchableOpacity>
    );
  };

  const getLeftContent = () => {
    return <TouchableOpacity style={styles.right} onPress={()=>props.handleRemoveTask(props.id)}>
        <Icon name="trash" style={styles.excludeIcon} color="white" size={40} />
      </TouchableOpacity>;
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        renderRightActions={getLeftContent}
        renderLeftActions={getRightContent}
      >
        <View>
          <List.Accordion
            style={{
              borderColor: "#AAA",
              borderBottomWidth: 1,
              fontFamily: CommonStyles.fontFamily,
              color: CommonStyles.colors.mainText
            }}
            left={iconProps =>
              props.doneAt !== null
                ? <List.Icon {...iconProps} icon="check" color="green" />
                : null}
            title={<Title />}
            id={props.id}
          >
            <List.Item
              style={{ color: CommonStyles.colors.subText }}
              title={formatdate(props.estimateAt)}
              description="Data estimada"
              left={props =>
                <List.Icon {...props} icon="calendar" size={60} color="#AAA" />}
            />
            <List.Item
              style={{ color: CommonStyles.colors.subText }}
              title={
                props.doneAt !== null
                  ? formatdate(props.doneAt)
                  : "Tarefa ainda não feita"
              }
              description={
                props.doneAt !== null
                  ? "Desmarcar como feita"
                  : "Marcar como feita"
              }
              left={props => <Done />}
            />
          </List.Accordion>
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  isdone: {
    borderWidth: 2,
    borderColor: "green",
    height: 25,
    width: 25,
    borderRadius: 13,
    marginLeft: 13,
    marginTop: 5
  },
  done: {
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center"
  },
  undone: {},
  right: {
    fontSize: 12,
    backgroundColor: "red",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 7
  },
  left: {
    flex: 1,
    backgroundColor: "red",
    flexDirection: "row",
    alignItems: "center"
  },
  excludeText: {
    color: "#fff",
    fontSize: 20,
    margin: 10
  },
  excludeIcon: {
    margin: 10
  }
});
