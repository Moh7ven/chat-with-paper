import AuthStack from "./AuthStack";
import HomeStack from "./HomeStack";
import { NavigationContainer } from "@react-navigation/native";
import { useAuthContext } from "./AuthProvider";

export default function Routes() {
  const { user } = useAuthContext();

  return (
    <NavigationContainer>
      {user ? <HomeStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
