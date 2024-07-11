import React, { createContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const TasksContext = createContext();

const initialState = [
  {
    id: Math.random(),
    desc: "Ler livro de React Native",
    estimatedAt: new Date(),
    doneAt: null
  },
  {
    id: Math.random(),
    desc: "Fazer compras",
    estimatedAt: new Date(),
    doneAt: new Date() // tarefa concluída
  },
  {
    id: Math.random(),
    desc: "Estudar matemática",
    estimatedAt: new Date(),
    doneAt: null
  },
  {
    id: Math.random(),
    desc: "Ir à academia",
    estimatedAt: new Date(),
    doneAt: new Date() 
  },
  {
    id: Math.random(),
    desc: "Escrever relatório",
    estimatedAt: new Date(),
    doneAt: null
  }
];

const taskReducer = (state, action) => {
  switch (action.type) {
    case "SET_DONE":
      return state.map(
        task =>
          task.id === action.payload
            ? { ...task, doneAt: task.doneAt === null ? new Date() : null }
            : task
      );
    case "SET_DONE_FILTER":
      return action.payload;
    case "SET_UNDONE_FILTER":
      return action.payload;
    case "ADD_TASK":
      return [...state, action.payload];
    case "DELETE_TASK":
      return state.filter(t => t.id !== action.payload);
    default:
      return state;
  }
};

const TasksProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem("tasks");
        if (storedTasks !== null) {
          dispatch({ type: "SET_TASKS", payload: JSON.parse(storedTasks) });
        }
      } catch (error) {
        console.error("Failed to load tasks from storage", error);
      }
    };

    loadTasks();
  }, []);

  useEffect(
    () => {
      const saveTasks = async () => {
        try {
          await AsyncStorage.setItem("tasks", JSON.stringify(state));
        } catch (error) {
          console.error("Failed to save tasks to storage", error);
        }
      };

      saveTasks();
    },
    [state]
  );

  return (
    <TasksContext.Provider value={{ state, dispatch }}>
      {children}
    </TasksContext.Provider>
  );
};

export default TasksProvider;
