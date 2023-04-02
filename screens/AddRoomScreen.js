import { StyleSheet, View } from "react-native";
import FormInput from "../components/FormInput";
import FormButton from "../components/FormButton";
import React, { useState } from "react";
import { IconButton, Title } from "react-native-paper";
import { collection, addDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import useStatsBar from "../utils/useStatusBar";
export default function AddRoomScreen({ navigation }) {
  useStatsBar("dark-content");
  const [roomName, setRoomName] = useState("");
  async function handleButtonPress() {
    if (roomName.length > 0) {
      try {
        const docRef = await addDoc(collection(firestore, "THREADS"), {
          name: roomName,
          latestMessage: {
            text: `You have joined the room ${roomName}.`,
            createdAt: new Date().getTime(),
          },
        });
        const msgColRef = collection(docRef, "MESSAGES");
        await addDoc(msgColRef, {
          text: `You have joined the room ${roomName}.`,
          createdAt: new Date().getTime(),
          system: true,
        });
      } catch (e) {
        console.error("Error adding document: ", e);
      }

      navigation.navigate("Home");
    }
  }
  return (
    <View style={styles.rootContainer}>
      <View style={styles.closeButtonContainer}>
        <IconButton
          icon="close-circle"
          size={36}
          color="#6646ee"
          onPress={() => navigation.goBack()}
        />
      </View>
      <View style={styles.innerContainer}>
        <Title style={styles.title}>Create a new chat room</Title>
        <FormInput
          labelName="Room Name"
          value={roomName}
          onChangeText={setRoomName}
          clearButtonMode="while-editing"
        />
        <FormButton
          title="Create"
          modeValue="contained"
          labelStyle={styles.buttonLabel}
          onPress={handleButtonPress}
          disabled={roomName.length === 0}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  closeButtonContainer: {
    position: "absolute",
    top: 30,
    right: 0,
    zIndex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  buttonLabel: {
    fontSize: 22,
  },
});
