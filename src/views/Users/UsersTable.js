import {
  Flex,
  Table,
  Tbody,
  Td,
  Thead,
  Tr,
  Th,
  Text,
  Tooltip,
} from "@chakra-ui/react";

const UsersTable = ({ users }) => {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>
            <Text fontWeight="bold">Email</Text>
          </Th>
          <Th>
            <Text fontWeight="bold">Address</Text>
          </Th>
          <Th>
            <Text fontWeight="bold">Number of Projects</Text>
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {users.map((user) => (
          <Tr key={user.email}>
            <Td>
              <Text>{user.email}</Text>
            </Td>
            <Td>
              <Tooltip
                aria-label="Full Crypto Address"
                label={user.stake_address}
                placement="top"
              >
                <Text>
                  {user.stake_address.substring(0, 12) +
                    "..." +
                    user.stake_address.substring(user.stake_address.length - 5)}
                </Text>
              </Tooltip>
            </Td>
            <Td>
              <Text>{Number(user.project_count)}</Text>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default UsersTable;
