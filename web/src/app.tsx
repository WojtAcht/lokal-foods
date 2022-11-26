import { signal } from "@preact/signals";

import { connectSocket } from "./socket";
import { useEffect, useRef, useState } from "preact/hooks";
import { Logo } from "./logo ";
import { StampCard } from "./stampcard";
import { QRCodeWidget } from "./QRCodeWidget";

interface IRestaurant {
  id: number;
  name: string;
  numberOfStamps: number;
}

enum ETabs {
  CODE = "code",
  STAMPS = "stamps",
}

export const restaurants = signal<Array<IRestaurant>>([
  { id: 1, name: "My restaurant", numberOfStamps: 8 },
]);

export const CLIENT_ID = "12345";

export function App() {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(1);
  const [currentTab, setCurrentTab] = useState(ETabs.CODE);
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (socket.current) return;
    socket.current = connectSocket();
  }, []);

  return (
    <>
      <Logo />
      <button
        onClick={() => {
          setCurrentTab(ETabs.CODE);
        }}
      >
        QR Code
      </button>
      <button
        onClick={() => {
          setCurrentTab(ETabs.STAMPS);
        }}
      >
        My cards
      </button>
      {currentTab == ETabs.CODE ? (
        <QRCodeWidget />
      ) : (
        <StampCard restaurantId={selectedRestaurantId} />
      )}
      {/*<StampCard restaurantId={selectedRestaurantId} />*/}
      {/*<button*/}
      {/*  onClick={() => {*/}
      {/*    // @ts-ignore*/}
      {/*    socket.current = connectSocket();*/}
      {/*  }}*/}
      {/*>*/}
      {/*  dupa*/}
      {/*</button>*/}
      {/*<button*/}
      {/*  onClick={() => {*/}
      {/*    if (socket.current) {*/}
      {/*      socket.current.send(JSON.stringify({ id: "12345" }));*/}
      {/*    }*/}
      {/*  }}*/}
      {/*>*/}
      {/*  hahhahaha*/}
      {/*</button>*/}
    </>
  );
}
