import React, { createContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { server, showError, showSuccess } from "../Common";
import axios from "axios";

export const UserContext = createContext();

const initialState = {
  user: null,
  headerAuth: null
};

const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
         user: {
          email: action.payload.email,
          name: action.payload.name,
          id: action.payload.id
        },
        headerAuth: `bearer ${action.payload.token}`
      };
    case "LOGOUT":
      return {
        user: null,
        headerAuth: null
      };
    default:
      return state;
  }
};

const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const user = JSON.parse(userData);
        dispatch({ type: "SET_USER", payload: user });
        axios.defaults.headers.common["Authorization"] = `bearer ${user.token}`;
      }
    };
    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
