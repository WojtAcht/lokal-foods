import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  ERootNavigatorRoute,
  TRootNavigatorParamList,
} from "../navigation/RootNavigator";
import { Button, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        margin: 10,
    }
})

const HomeScreen = ({
  navigation,
}: NativeStackScreenProps<TRootNavigatorParamList>) => {
  return <View style={styles.container}>
      <Button title={"Jestem klientem"} onPress={() => navigation.navigate(ERootNavigatorRoute.CLIENT)} />
      <Button title={"Jestem pracownikiem"} onPress={() => navigation.navigate(ERootNavigatorRoute.SCAN_QR)} />
  </View>;
};

export default HomeScreen;
