import { signal } from "@preact/signals";

import { connectSocket } from "./socket";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { Logo } from "./logo ";
import { StampCard } from "./stampcard";
import { QRCodeWidget } from "./QRCodeWidget";
import { Nav } from "./nav";

interface IRestaurant {
  id: number;
  name: string;
  numberOfStampSlots: number;
  numberOfStamps: number;
}

export enum ETabs {
  CODE = "code",
  STAMPS = "stamps",
}

export const restaurants = signal<Array<IRestaurant>>([
  { id: 0, name: "My restaurant", numberOfStampSlots: 8, numberOfStamps: 0 },
]);

export const CLIENT_ID = "0";

export function App() {
  const [selectedRestaurantId] = useState(0);
  const [currentTab, setCurrentTab] = useState(ETabs.CODE);
  const socket = useRef<WebSocket | null>(null);

  const stampEventTarget = useRef<EventTarget | null>(null);
  if (!stampEventTarget.current) {
    stampEventTarget.current = new EventTarget();
  }

  useEffect(() => {
    fetch("http://192.168.123.116:3000/api/stamp/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "user-id": CLIENT_ID,
        "client-id": selectedRestaurantId.toString(),
      }),
    }).then(async (res) => {
      const response = (await res.json()) as {
        success: boolean;
        result?: number;
      };
      const { result } = response;
      if (result) {
        restaurants.value = restaurants.value.map((restaurant) => ({
          ...restaurant,
          numberOfStamps: result,
        }));
      }
    });
  }, [selectedRestaurantId]);

  const stamp = useCallback((restaurantId: number) => {
    restaurants.value = restaurants.value.map((restaurant) => ({
      ...restaurant,
      numberOfStamps:
        restaurant.id === restaurantId
          ? restaurant.numberOfStamps + 1
          : restaurant.numberOfStamps,
    }));
  }, []);

  const onStampSocket = (restaurantId: number, isFinished: boolean) => {
    if (currentTab === ETabs.CODE) {
      setCurrentTab(ETabs.STAMPS);
      setTimeout(() => {
        // @ts-ignore
        if (stampEventTarget.current) {
          stampEventTarget.current?.dispatchEvent(
            new CustomEvent<{ id: number; isFinished: boolean }>("stamp", {
              detail: { id: restaurantId, isFinished },
            })
          );
        }
      }, 250);
    } else {
      if (stampEventTarget.current) {
        stampEventTarget.current?.dispatchEvent(
          new CustomEvent<{ id: number; isFinished: boolean }>("stamp", {
            detail: { id: restaurantId, isFinished },
          })
        );
      }
    }
  };

  useEffect(() => {
    if (socket.current) return;
    socket.current = connectSocket(onStampSocket);
  }, []);

  return (
    <>
      <Logo />
      <Nav currentTab={currentTab} setCurrentTab={setCurrentTab} />
      {currentTab == ETabs.CODE ? (
        <QRCodeWidget />
      ) : (
        <StampCard
          restaurantId={selectedRestaurantId}
          updateStamps={stamp}
          eventTarget={stampEventTarget}
        />
      )}
    </>
  );
}
