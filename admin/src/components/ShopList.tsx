import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, useDisclosure } from "@chakra-ui/react";

import { useAuth } from "@clerk/clerk-react";

import { useEffect, useState } from "react";

import { ShopMenuModal } from "./ShopMenuModal";

const listShops = async (token: string) => {
  return (
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/2024-08-08/shops`, {
      mode: "cors",
      headers: { Authorization: token }
    })
  ).json();
};

const getShopMenu = async (shopId: string) => {
  return (
    await fetch(`http://localhost:3001/2024-08-08/shops/${shopId}/menu`, {
      mode: "cors"
    })
  ).json();
};
export function ShopList() {
  const { getToken } = useAuth();

  const [shops, setShops] = useState<any[]>([]);
  const [shop, setShop] = useState<any>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  async function openMenu(shopId: string) {
    const shop = await getShopMenu(shopId);
    setShop(shop);
    onOpen();
  }

  useEffect(() => {
    void getToken()
      .then((token) => listShops(token || ""))
      .then(setShops);
  }, [getToken]);

  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Name</Th>
            <Th>Opening time</Th>
            <Th>Closing time</Th>
            <Th>Manager ID</Th>
            <Th>CreatedAt</Th>
            <Th>Menu</Th>
          </Tr>
        </Thead>
        <Tbody>
          {shops.map((shop) => {
            return (
              <Tr key={shop.id}>
                <Td>{shop.id}</Td>
                <Td>{shop.name}</Td>
                <Td>{shop.opening_time}</Td>
                <Td>{shop.closing_time}</Td>
                <Td>{shop.manager_id}</Td>
                <Td>{shop.createdAt}</Td>
                <Td cursor="pointer" onClick={() => openMenu(shop.id)}>
                  📋
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <ShopMenuModal shop={shop} isOpen={isOpen} onClose={onClose} />
    </TableContainer>
  );
}
