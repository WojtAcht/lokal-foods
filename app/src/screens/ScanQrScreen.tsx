import React, { useEffect, useState } from "react";
import { BarCodeScannedCallback, BarCodeScanner } from "expo-barcode-scanner";
import { Alert, Button, StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
});

const ScanQrScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned: BarCodeScannedCallback = () => {
    setScanned(true);
    Alert.alert(`Czy chcesz dać pieczątkę? :3`, undefined, [
      { text: "Nie" },
      {
        text: "Tak!",
        onPress: async () => {
          try {
            const res = await fetch("http://192.168.123.116:3000/api/stamp/add", {
              method: "POST",
              headers: { "Content-Type": 'application/json' },
              body: JSON.stringify({
                ["client-id"]: "0",
                ["user-id"]: "0",
                ["stamp-hash"]: "asdf",
              }),
            });
            console.log(await res.json())
          } catch (e) {
            console.error(e)
          }
        },
      },
    ]);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (!hasPermission) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{ flex: 1, alignSelf: 'stretch' }}
      />
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
    </View>
  );
};

export default ScanQrScreen;
