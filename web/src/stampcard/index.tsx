import { JSX, h } from "preact";
import styles from "./stampcard.module.css";
import { restaurants } from "../app";

interface IStampCardProps {
  restaurantId: number;
}

const Stamp = ({ isStamped }: { isStamped: boolean }) => {
  return isStamped ? (
    <div class={styles.stamped}></div>
  ) : (
    <div class={styles.notStamped}></div>
  );
};

export const StampCard = ({ restaurantId }: IStampCardProps) => {
  const restaurant = restaurants.value.find((restaurant) => {
    return restaurant.id === restaurantId;
  });
  if (!restaurant) return null;

  const stamps = new Array(restaurant.numberOfStamps).fill(false);

  return <div class={styles.card}>{/*{restaurant.numberOfStamps.}*/}</div>;
};
