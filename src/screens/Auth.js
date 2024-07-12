import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity
} from "react-native";
import axios from "axios";
import { TextInput, Button } from "react-native-paper";
import image from "../../assets/imgs/login.jpg";
import CommonStyles from "../CommonStyles";
import Icon from "react-native-vector-icons/FontAwesome";
import { Entypo } from "@expo/vector-icons";
import { server, showError, showSuccess } from "../Common";
import { UserContext } from "../context/UserContext";

export default props => {
  const { dispatch } = useContext(UserContext);
  const { state } = useContext(UserContext);
  const { user } = state;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [stageNew, setStageNew] = useState(false);

  const signup = async () => {
    try {
      await axios.post(`${server}/signup`, {
        name: name,
        email: email,
        password: password
      });
      showSuccess("Usuário cadastrado!");
      setStageNew(false);
    } catch (error) {
      showError(error);
    }
  };
  const signin = async () => {
    if (!user) {
      try {
        const res = await axios.post(`${server}/signin`, {
          email: email,
          password: password
        });
        axios.defaults.headers.common["Authorization"] = `bearer ${res.data
          .token}`;
        showSuccess("Usuário Logado: " + res.data.token);
        dispatch({
          type: "SET_USER",
          pyaload: {
            name: res.data.name,
            email: res.data.email,
            id: res.data.id,
            token: res.data.token
          }
        });
      } catch (error) {
        showError(error);
      }
    } else {
      showError("Você já está logadooo!");
    }
  };

  return (
    <ImageBackground style={styles.background} source={image}>
      <Text style={styles.title}>Tasks</Text>

      <View style={styles.formContainer}>
        <Text style={styles.subtitle}>
          {stageNew ? "Crie a sua conta" : "Login"}
        </Text>

        {stageNew &&
          <TextInput
            label="Nome"
            style={styles.ti}
            onChangeText={name => setName(name)}
            value={name}
            mode="flat"
            defaultProps
            activeUnderlineColor={"grey"}
            activeOutlineColor={"black"}
            selectionColor={"black"}
          />}
        <TextInput
          label="Email"
          style={styles.ti}
          onChangeText={email => setEmail(email.toLowerCase())}
          value={email}
          mode="flat"
          defaultProps
          activeUnderlineColor={"grey"}
          activeOutlineColor={"black"}
          selectionColor={"black"}
        />
        <TextInput
          style={styles.ti}
          label="Senha"
          value={password}
          onChangeText={password => setPassword(password)}
          mode="flat"
          defaultProps
          secureTextEntry={true}
          activeUnderlineColor={"grey"}
          activeOutlineColor={"black"}
          selectionColor={"black"}
        />

        {stageNew &&
          <TextInput
            selectionColor="white"
            style={styles.ti}
            value={confirmPassword}
            label="Confirme a senha"
            onChangeText={confirmPassword =>
              setConfirmPassword(confirmPassword)}
            mode="flat"
            defaultProps
            secureTextEntry={true}
            secureTextEntry={true}
            activeUnderlineColor={"grey"}
            activeOutlineColor={"black"}
            selectionColor={"black"}
          />}

        <TouchableOpacity onPress={stageNew ? () => signup() : () => signIn()}>
          <Button
            mode="elevated"
            onPress={props.onCancel}
            style={{ marginTop: 10 }}
            textColor={"white"}
            buttonColor="#080"
          >
            {stageNew ? "Cadastrar" : "Entrar"}
          </Button>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginTop: 10 }}
          onPress={() => setStageNew(!stageNew)}
        >
          <Text style={styles.text}>
            {stageNew ? "Já possui conta?" : "Não possui conta?"}
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontFamily: CommonStyles.fontFamily,
    color: CommonStyles.colors.secondary,
    fontSize: 70,
    marginBottom: 10
  },
  subtitle: {
    fontFamily: CommonStyles.fontFamily,
    color: "black",
    fontSize: 30,
    marginBottom: 15,
    textAlign: "center"
  },

  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    padding: 30,
    borderRadius: 10,
    width: "90%"
  },
  text: {
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center"
  },
  ti: {
    marginTop: 10
  }
});
