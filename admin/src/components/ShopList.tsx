import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from "@chakra-ui/react";

import { useAuth } from "@clerk/clerk-react";

import { useEffect, useState } from "react";

const listShops = async (token: string) => {
  return (
    await fetch("http://localhost:3001/2024-08-08/shops", {
      mode: "cors",
      headers: { Authorization: token }
    })
  ).json();
};

export function ShopList() {
  const { getToken } = useAuth();

  const [shops, setShops] = useState<any[]>([]);

  useEffect(() => {
    void getToken()
      .then((token) => listShops(token || ""))
      .then(setShops);
  }, []);

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
          </Tr>
        </Thead>
        <Tbody>
          {shops.map((shop) => {
            return (
              <Tr>
                <Td>{shop.id}</Td>
                <Td>{shop.name}</Td>
                <Td>{shop.opening_time}</Td>
                <Td>{shop.closing_time}</Td>
                <Td>{shop.manager_id}</Td>
                <Td>{shop.createdAt}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
