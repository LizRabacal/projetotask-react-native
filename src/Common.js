import {Alert, Platform} from 'react-native'
import axios from "axios";

const server =
  Platform.OS === "ios" ? "http://localhost:5000" : "http://10.0.2.2:5000";


  const api = axios.create({
    baseURL: server
  });

  function showError(err) {
    Alert.alert('Ops! Ocorreu um problema!', `Mensagem: ${err}`)
  }

 
  function showSuccess(msg) {
    Alert.alert('Sucesso', msg)
  }

  export { api, server, showError, showSuccess };

 