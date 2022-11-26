import { useEffect, useRef } from "preact/hooks";
import QRCode from "qrcode";

import styles from "./qrcode.module.css";
import { CLIENT_ID } from "../app";

export const QRCodeWidget = () => {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvas.current) return;
    QRCode.toCanvas(canvas.current, CLIENT_ID, { scale: 10 }).catch(() => {});
  }, []);

  return (
    <div class={styles.qrContainer}>
      <canvas ref={canvas} class={styles.qrCanvas} />
    </div>
  );
};
