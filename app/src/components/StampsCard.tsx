import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from "react-native";

const CARDS_COUNT = 8;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderColor: "blue",
    borderWidth: 1,
    height: 200,
    margin: 20,
    justifyContent: "space-evenly",
  },
  stampsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  stampSlot: {
    height: 40,
    width: 40,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "black",
  },
  stamp: {
    backgroundColor: "red",
  },
});

export type TStampsCardProps = {
  collectedStampsCount: number;
};

const StampsCard: React.FC<TStampsCardProps> = ({ collectedStampsCount: stampsCountNonDelayed }) => {
  const wasInitialized = useRef(false)
  const [collectedStampsCount, setCollectedStampsCount] = useState(stampsCountNonDelayed);

  useEffect(() => {
    if (!wasInitialized.current) {
      wasInitialized.current = true;
      return
    }
    // TODO start animation :)

    setCollectedStampsCount(stampsCountNonDelayed);
  }, [stampsCountNonDelayed])

  return (
    <View style={styles.container}>
      <View style={styles.stampsRow}>
        {new Array(CARDS_COUNT / 2).fill(null).map((_, i) => {
          return (
            <View
              style={[
                styles.stampSlot,
                collectedStampsCount > i && styles.stamp,
              ]}
              key={i}
            />
          );
        })}
      </View>
      <View style={styles.stampsRow}>
        {new Array(CARDS_COUNT / 2).fill(null).map((_, i) => {
          const index = i + CARDS_COUNT / 2;
          return (
            <View
              style={[
                styles.stampSlot,
                collectedStampsCount > index && styles.stamp,
              ]}
              key={index}
            />
          );
        })}
      </View>
    </View>
  );
};

export default StampsCard;
