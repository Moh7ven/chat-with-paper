import { IconButton, Title } from "react-native-paper";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import FormButton from "../components/FormButton";
import FormInput from "../components/FormInput";
import { useAuthContext } from "../navigation/AuthProvider";

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUp } = useAuthContext();
  const { loginWithGoogle } = useAuthContext();

  const onSignUp = () => {
    signUp(name, email, password);
  };

  return (
    <View style={styles.container}>
      <Title style={styles.titleText}>Register to chat</Title>
      <FormInput
        labelName="Name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <FormInput
        labelName="Email"
        value={email}
        autoCapitalize="none"
        onChangeText={(text) => setEmail(text)}
      />
      <FormInput
        labelName="Password"
        value={password}
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
      />
      <FormButton
        title="Signup"
        modeValue="contained"
        labelStyle={styles.loginButtonLabel}
        onPress={onSignUp}
      />
      <FormButton
        icon="google"
        title="With Google"
        modeValue="contained"
        labelStyle={styles.loginButtonLabel}
        onPress={() => loginWithGoogle()}
      />
      <IconButton
        icon="keyboard-backspace"
        size={30}
        style={styles.navButton}
        color="#6646ee"
        onPress={() => navigation.navigate("Login")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 24,
    marginBottom: 10,
  },
  loginButtonLabel: {
    fontSize: 18,
  },
  navButtonText: {
    fontSize: 18,
  },
  navButton: {
    marginTop: 10,
  },
});
