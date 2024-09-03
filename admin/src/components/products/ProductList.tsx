import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from "@chakra-ui/react";
import { useAuth } from "@clerk/clerk-react";

import { useEffect, useState } from "react";

const listProducts = async (token: string) => {
  return (
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/2024-08-08/products?include=ingredients`, {
      mode: "cors",
      headers: { Authorization: token }
    })
  ).json();
};

export function ProductList() {
  const { getToken } = useAuth();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    void getToken()
      .then((token) => listProducts(token || ""))
      .then(setProducts);
  }, [getToken]);

  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Title</Th>
            <Th>Description</Th>
            <Th>ShopID</Th>
            <Th>SKU</Th>
            <Th>CreatedAt</Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.map((product) => {
            return (
              <Tr key={product.id}>
                <Td>{product.id}</Td>
                <Td>{product.title}</Td>
                <Td>{product.description}</Td>
                <Td>{product.shop_id}</Td>
                <Td>{product.sku}</Td>
                <Td>{product.created_at}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
