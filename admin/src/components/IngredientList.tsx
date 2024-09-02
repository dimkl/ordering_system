import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from "@chakra-ui/react";
import { useAuth } from "@clerk/clerk-react";

import { useEffect, useState } from "react";

const listIngredients = async (token: string) => {
  return (
    await fetch("http://localhost:3001/2024-08-08/ingredients", {
      mode: "cors",
      headers: { Authorization: token }
    })
  ).json();
};

export function IngredientList() {
  const { getToken } = useAuth();
  const [ingredients, setIngredients] = useState<any[]>([]);

  useEffect(() => {
    void getToken()
      .then((token) => listIngredients(token || ""))
      .then(setIngredients);
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
            <Th>Suitable For Diet</Th>
            <Th>CreatedAt</Th>
          </Tr>
        </Thead>
        <Tbody>
          {ingredients.map((ingredient) => {
            return (
              <Tr>
                <Td>{ingredient.id}</Td>
                <Td>{ingredient.title}</Td>
                <Td>{ingredient.description}</Td>
                <Td>{ingredient.shop_id}</Td>
                <Td>{ingredient.suitable_for_diet}</Td>
                <Td>{ingredient.created_at}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
