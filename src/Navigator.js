import React, { useContext, useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import Auth from "./screens/Auth";
import TaskList from "./screens/TaskList";
import { UserContext } from "./context/UserContext"; 

const Drawer = createDrawerNavigator();

export default props => {
  const { state } = useContext(UserContext);
  const { user } = state;



  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Auth">
        {user ? (
          <Drawer.Screen name="Home" component={TaskList} />
        ) : (
          <Drawer.Screen name="Auth" component={Auth} />
        )}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}


