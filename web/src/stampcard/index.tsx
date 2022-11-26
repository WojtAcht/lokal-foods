import styles from "./stampcard.module.css";
import { restaurants } from "../app";
import { computed } from "@preact/signals";
import { MutableRef, useCallback, useEffect, useRef } from "preact/hooks";

interface IStampCardProps {
  restaurantId: number;
  updateStamps: (restaurantId: number) => void;
  eventTarget: MutableRef<EventTarget | null>;
}

const Stamp = ({ isStamped }: { isStamped: boolean }) => {
  return isStamped ? (
    <div class={`${styles.stamp} ${styles.stamped}`}></div>
  ) : (
    <div class={`${styles.stamp} ${styles.notStamped}`}></div>
  );
};

const keyframes = [
  { transform: "perspective(800px) rotateX(0)" },
  {
    transform: "perspective(600px) rotateX(80deg)",
  },
];
const keyframesOut = [
  {
    transform: "perspective(600px) rotateX(80deg)",
  },
  { transform: "perspective(800px) rotateX(0)" },
];
const options: KeyframeAnimationOptions = {
  duration: 300,
  easing: "ease-in-out",
  iterations: 1,
  fill: "forwards",
};

export const StampCard = ({
  restaurantId,
  updateStamps,
  eventTarget,
}: IStampCardProps) => {
  const restaurant = restaurants.value.find((restaurant) => {
    return restaurant.id === restaurantId;
  });
  const cardElement = useRef<HTMLDivElement>(null);

  const animateIn: () => Animation | undefined = useCallback(() => {
    if (!cardElement.current) {
      return;
    }
    return cardElement.current.animate(keyframes, options);
  }, []);

  const animateOut: () => Animation | undefined = useCallback(() => {
    if (!cardElement.current) {
      return;
    }
    return cardElement.current.animate(keyframesOut, options);
  }, []);

  useEffect(() => {
    const { current: target } = eventTarget;
    if (!target) {
      return undefined;
    }
    const doShit = (e: Event) => {
      const { detail } = e as CustomEvent<number>;
      animateIn()
        ?.finished?.then?.(() => {
          updateStamps(detail);
        })
        .then(() => animateOut());
    };

    target.addEventListener("stamp", doShit);
    return () => {
      target.removeEventListener("stamp", doShit);
    };
  }, [eventTarget, updateStamps]);

  if (!restaurant) return null;

  const stamps = computed(() => {
    return Array(restaurant.numberOfStampSlots)
      .fill(false)
      .map((_, i) => i < restaurant.numberOfStamps);
  });

  return (
    <div class={styles.container}>
      <p class={styles.name}>{restaurant.name}</p>
      <div class={styles.card} ref={cardElement}>
        {stamps.value.map((isStamped) => {
          return <Stamp isStamped={isStamped} />;
        })}
      </div>
    </div>
  );
};
