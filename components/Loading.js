import { ActivityIndicator, StyleSheet, View } from "react-native";

import React from "react";

export default function Loading() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#6646ee" />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
