import React from "react";
import { StyleSheet, View } from "react-native";
import StampsCard from '../components/StampsCard';

const styles = StyleSheet.create({
  container: {},
});

const ClientScreen = () => {
  return <View style={styles.container}>
      <StampsCard collectedStampsCount={3} />
  </View>;
};

export default ClientScreen;
