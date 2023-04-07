import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useState, useEffect } from "react";
import {
  GiftedChat,
  Bubble,
  Send,
  SystemMessage,
} from "react-native-gifted-chat";
import { IconButton } from "react-native-paper";
import { firestore } from "../firebase";
import {
  doc,
  collection,
  query,
  addDoc,
  setDoc,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { useAuthContext } from "../navigation/AuthProvider";

const RoomScreen = ({ route }) => {
  const { user } = useAuthContext();
  const currentUser = user.toJSON();
  const { thread } = route.params;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const q = query(
      collection(firestore, "THREADS", thread._id, "MESSAGES"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (querySnapshot) => {
      let messages = [];
      querySnapshot.forEach((doc) => {
        const firebaseData = doc.data();
        const data = {
          _id: doc.id,
          text: "",
          createdAt: new Date().getTime(),
          ...firebaseData,
        };
        if (!firebaseData.system) {
          data.user = {
            ...firebaseData.user,
            name: firebaseData.user.email,
          };
        }
        messages = [...messages, data];
      });

      setMessages(messages);
      return unsub();
    });
  }, []);

  function handleSend(messages) {
    const text = messages[0].text;

    const threadDocRef = doc(firestore, "THREADS", thread._id);
    const msgColRef = collection(threadDocRef, "MESSAGES");
    addDoc(msgColRef, {
      text,
      createdAt: new Date().getTime(),
      user: {
        _id: currentUser.uid,
        email: currentUser.email,
      },
    });
    setDoc(
      threadDocRef,
      {
        latestMessage: {
          text,
          createdAt: new Date().getTime(),
        },
      },
      { merge: true }
    );
  }
  function renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#6646ee",
          },
        }}
        textStyle={{
          right: {
            color: "#fff",
          },
        }}
      />
    );
  }

  function renderSend(props) {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <IconButton icon="send-circle" size={32} iconColor="#6646ee" />
        </View>
      </Send>
    );
  }
  function scrollToBottomComponent() {
    return (
      <View style={styles.bottomComponentContainer}>
        <IconButton icon="chevron-double-down" size={36} iconColor="#6646ee" />
      </View>
    );
  }
  function renderLoading() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6646ee" />
      </View>
    );
  }
  function renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        wrapperStyle={styles.systemMessageWrapper}
        textStyle={styles.systemMessageText}
      />
    );
  }
  return (
    <GiftedChat
      messages={messages}
      onSend={handleSend}
      user={{ _id: currentUser.uid }}
      renderBubble={renderBubble}
      alwaysShowSend
      showUserAvatar
      renderSend={renderSend}
      scrollToBottom={true}
      scrollToBottomComponent={scrollToBottomComponent}
      renderLoading={renderLoading}
      renderSystemMessage={renderSystemMessage}
    />
  );
};

export default RoomScreen;

const styles = StyleSheet.create({
  sendingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  bottomComponentContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  systemMessageWrapper: {
    backgroundColor: "#6646ee",
    borderRadius: 4,
    padding: 5,
  },
  systemMessageText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
  },
});
