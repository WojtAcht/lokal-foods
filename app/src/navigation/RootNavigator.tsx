import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import ClientScreen from '../screens/ClientScreen';
import ScanQrScreen from '../screens/ScanQrScreen';

export enum ERootNavigatorRoute {
  HOME = "home",
  SCAN_QR = "scanQr",
  CLIENT = "client",
}

export type TRootNavigatorParamList = {
  [ERootNavigatorRoute.HOME]: undefined;
  [ERootNavigatorRoute.SCAN_QR]: undefined;
  [ERootNavigatorRoute.CLIENT]: undefined;
};

const Stack = createNativeStackNavigator();

const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={ERootNavigatorRoute.HOME} component={HomeScreen} />
      <Stack.Screen name={ERootNavigatorRoute.SCAN_QR} component={ScanQrScreen} />
      <Stack.Screen name={ERootNavigatorRoute.CLIENT} component={ClientScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
