import { ReactComponent as Stamp } from "../assets/stamp.svg";

import styles from "./logo.module.css";

export const Logo = () => {
  return (
    <h1 className={styles.title}>
      <Stamp />
      Lokal foods
    </h1>
  );
};
