import { ETabs } from "../app";
import { StateUpdater } from "preact/compat";

import styles from "./nav.module.css";

interface INavProps {
  currentTab: ETabs;
  setCurrentTab: StateUpdater<ETabs>;
}

export const Nav = ({ currentTab, setCurrentTab }: INavProps) => {
  return (
    <nav class={styles.nav}>
      <button
        type={"button"}
        onClick={() => {
          setCurrentTab(ETabs.CODE);
        }}
        class={`${styles.navButton} ${
          currentTab === ETabs.CODE ? styles.active : ""
        }`}
      >
        QR Code
      </button>
      <button
        type={"button"}
        onClick={() => {
          setCurrentTab(ETabs.STAMPS);
        }}
        class={`${styles.navButton} ${
          currentTab === ETabs.STAMPS ? styles.active : ""
        }`}
      >
        My cards
      </button>
    </nav>
  );
};
