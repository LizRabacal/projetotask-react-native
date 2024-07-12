import React, { useContext, useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import Auth from "./screens/Auth";
import TaskList from "../TaskList";
import { UserContext } from "./context/UserProvider"; // Certifique-se de que o caminho esteja correto

const Drawer = createDrawerNavigator();

export default props => {
  const { state } = useContext(UserContext);
  const { user } = state;

  useEffect(() => {
    if (!user) {
      navigationRef.current?.navigate("Auth");
    }
  }, [user]);

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


