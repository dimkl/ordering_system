import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useNavigation } from "expo-router";
import type { ShopMenu } from "@/types/shop";

export async function getShopMenu(
  shopId: string = "shp_01J4A6XTCZMCQ9P95SEEJWE237"
): Promise<ShopMenu> {
  // const menu = (await fetch(`https://make-order.online/2024-08-01/shops/${shopId}/menu`)).json();
  const menu = (await fetch(`http://192.168.1.6:3000/2024-08-01/shops/${shopId}/menu`)).json();

  console.log({ menu });
  return menu as unknown as ShopMenu;
}

export default function Index() {
  const [data, setData] = useState<ShopMenu>();
  const navigation = useNavigation();

  useEffect(() => {
    void getShopMenu().then((shopMenu) => {
      setData(shopMenu);
      navigation.setOptions({ title: shopMenu.name });
    });
  }, []);

  if (!data) {
    return null;
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Text>
        Open: {data.opening_time} - {data.closing_time}
      </Text>
      {data.products.map((product) => {
        return <Text key={product.id}>{JSON.stringify(product)}</Text>;
      })}
    </View>
  );
}
