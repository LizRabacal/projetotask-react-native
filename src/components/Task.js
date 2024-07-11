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

export default props => {
  const { state, dispatch } = useContext(TasksContext);

  const formatdate = date => {
    return moment(date).format("ddd, D [de] MMMM");
  };

  const handleRemoveTask = () => {
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
          onPress: () => {
            dispatch({ type: "DELETE_TASK", payload: props.id });
          },
          style: "destructive"
        }
      ]
    );
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

  const onPressDone = () => {
    dispatch({ type: "SET_DONE", payload: props.id });
  };

  const Done = () => {
    return (
      <TouchableOpacity onPress={() => onPressDone()}>
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
    return(

    <TouchableOpacity style={styles.left} onPress={() => handleRemoveTask()}>
        <Icon name="trash" style={styles.excludeIcon} color="white" size={30} />
        <Text style={styles.excludeText}>Excluir</Text>
    </TouchableOpacity>


    )
  };
  const getLeftContent = () => {
    return (
      <TouchableOpacity style={styles.right} onPress={() => handleRemoveTask()}>
        <Icon name="trash" style={styles.excludeIcon} color="white" size={40} />
      </TouchableOpacity>
    );
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
                <List.Icon {...props} icon="calendar" color="#AAA" />}
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
    color: "#Fff",
    fontSize: 20,
    margin: 10
  },

  excludeIcon: {
    margin: 10
  }
});
