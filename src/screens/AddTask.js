import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { TasksContext } from "../context/TasksContext";
import CommonStyles from "../CommonStyles";
import { DatePickerInput } from "react-native-paper-dates";
import { SafeAreaProvider } from "react-native-safe-area-context";
import moment from "moment";
import "moment/locale/pt-br";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { server, showError, showSuccess } from "../Common";

export default props => {
  const { state: estado } = useContext(UserContext);
  const { headerAuth } = estado;
  const { user } = estado;
  const [inputDate, setInputDate] = useState(null);
  const [desc, setDesc] = useState("");

  const handleSaveTask = async () => {
    console.log( headerAuth );
    if (inputDate && desc) {
      try {
        await axios.post(
          `${server}/task`,
          {
            desc: desc,
            estimateAt: inputDate,
          },
          {
            headers: { 
              Authorization: headerAuth
            }
          }
        );

        showSuccess("Adicionado com sucesso!");
        props.onCancel();
      } catch (error) {
        showError(error);
      }
    } else {
      Alert.alert("PREENCHA TODOS OS CAMPOS");
    }
  };

  return (
    <Modal
      transparent={true}
      visible={props.isVisible}
      onRequestClose={props.onCancel}
      animationType="slide"
    >
      <TouchableWithoutFeedback onPress={props.onCancel}>
        <View style={styles.background} />
      </TouchableWithoutFeedback>

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Criar nova tarefa
          </Text>
        </View>

        <View style={styles.body}>
          <TextInput
            label="Descrição"
            onChangeText={setDesc}
            mode="outlined"
            activeUnderlineColor={"grey"}
            activeOutlineColor={CommonStyles.colors.today}
            selectionColor={CommonStyles.colors.today}
          />
          <SafeAreaProvider style={{ marginTop: 35, marginBottom: 25 }}>
            <DatePickerInput
              locale="pt-BR"
              label="Data estimada"
              mode="outlined"
              value={inputDate}
              onChange={setInputDate}
              inputMode="end"
              activeUnderlineColor={"grey"}
              activeOutlineColor={CommonStyles.colors.today}
              selectionColor={CommonStyles.colors.today}
            />
          </SafeAreaProvider>

          <View style={styles.botoes}>
            <TouchableOpacity>
              <Button
                mode="elevated"
                onPress={props.onCancel}
                style={{ marginRight: 5 }}
                textColor={CommonStyles.colors.today}
                buttonColor="white"
              >
                Cancelar
              </Button>
            </TouchableOpacity>

            <TouchableOpacity>
              <Button
                mode="elevated"
                textColor={"white"}
                buttonColor={CommonStyles.colors.today}
                onPress={handleSaveTask}
              >
                Salvar
              </Button>
            </TouchableOpacity>
          </View>

          
        </View>
      </View>

      <TouchableWithoutFeedback onPress={props.onCancel}>
        <View style={styles.background} />
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)"
  },
  container: {
    backgroundColor: "white",
    justifyContent: "space-between"
  },
  title: {
    fontSize: 15,
    color: CommonStyles.colors.secondary,
    fontWeight: "bold",
    fontFamily: CommonStyles.fontFamily
  },
  header: {
    fontFamily: CommonStyles.fontFamily,
    color: CommonStyles.colors.secondary,
    alignItems: "center",
    padding: 15,
    backgroundColor: CommonStyles.colors.today
  },
  body: {
    padding: 15
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10
  }
});
