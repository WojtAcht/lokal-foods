import { signal } from "@preact/signals";

import { connectSocket } from "./socket";
import { useEffect, useRef, useState } from "preact/hooks";
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
  const card = useRef(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/stamp/status", {
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

  const onStamp = (restaurantId: number) => {
    if (currentTab === ETabs.CODE) {
      setCurrentTab(ETabs.STAMPS);
      setTimeout(() => {
        restaurants.value = restaurants.value.map((restaurant) => ({
          ...restaurant,
          numberOfStamps:
            restaurant.id === restaurantId
              ? restaurant.numberOfStamps + 1
              : restaurant.numberOfStamps,
        }));
      }, 500);
    } else {
      restaurants.value = restaurants.value.map((restaurant) => ({
        ...restaurant,
        numberOfStamps:
          restaurant.id === restaurantId
            ? restaurant.numberOfStamps + 1
            : restaurant.numberOfStamps,
      }));
    }
  };

  useEffect(() => {
    if (socket.current) return;
    socket.current = connectSocket(onStamp);
  }, []);

  return (
    <>
      <Logo />
      <Nav currentTab={currentTab} setCurrentTab={setCurrentTab} />
      {currentTab == ETabs.CODE ? (
        <QRCodeWidget />
      ) : (
        <StampCard restaurantId={selectedRestaurantId} />
      )}
    </>
  );
}
