import { JSX, h } from "preact";
import styles from "./stampcard.module.css";
import { restaurants } from "../app";
import { computed } from "@preact/signals";

interface IStampCardProps {
  restaurantId: number;
}

const Stamp = ({ isStamped }: { isStamped: boolean }) => {
  return isStamped ? (
    <div class={`${styles.stamp} ${styles.stamped}`}></div>
  ) : (
    <div class={`${styles.stamp} ${styles.notStamped}`}></div>
  );
};

export const StampCard = ({ restaurantId }: IStampCardProps) => {
  const restaurant = restaurants.value.find((restaurant) => {
    return restaurant.id === restaurantId;
  });
  if (!restaurant) return null;

  const stamps = computed(() => {
    return Array(restaurant.numberOfStampSlots)
      .fill(false)
      .map((_, i) => i < restaurant.numberOfStamps);
  });

  return (
    <div class={styles.container}>
      <p>{restaurant.name}</p>
      <div class={styles.card}>
        {stamps.value.map((isStamped) => {
          return <Stamp isStamped={isStamped} />;
        })}
      </div>
    </div>
  );
};
