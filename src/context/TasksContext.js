import React, { createContext, useReducer, useEffect } from "react";
import axios from "axios";
import { server, showError } from "../Common";

export const TasksContext = createContext();

const initialState = {
  tasks: []
};

const tasksReducer = (state, action) => {
  switch (action.type) {
    case "SET_DONE":
      return state.map(
        task =>
          task.id === action.payload
            ? { ...task, doneAt: task.doneAt === null ? new Date() : null }
            : task
      )
    case "SET_TASKS":
      return { ...state, tasks: action.payload };
    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.payload] };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map(
          task => (task.id === action.payload.id ? action.payload : task)
        )
      };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };
    default:
      return state;
  }
};

export const TasksProvider = ({ children }) => {
  const [state, dispatch] = useReducer(tasksReducer, initialState);

  const loadTasks = async () => {
    try {
      const res = await axios.get(`${server}/tasks`);
      dispatch({ type: "SET_TASKS", payload: res.data });
    } catch (error) {
      showError(error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <TasksContext.Provider value={{ state, dispatch }}>
      {children}
    </TasksContext.Provider>
  );
};
