import { useState } from "preact/hooks";
import { ReactComponent as Stamp } from "./assets/stamp.svg";

import styles from "./app.module.css";

export function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1 class={styles.title}>
        <Stamp />
        Lokal foods
      </h1>
    </>
  );
}
