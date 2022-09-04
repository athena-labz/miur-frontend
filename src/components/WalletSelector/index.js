import {
  Stack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

import { useWallet } from "../../contexts/walletContext";

export function WalletSelector({ isOpen, onClose, onSelect }) {
  const { getWallets } = useWallet();

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Select Wallet</ModalHeader>
        <ModalBody>
          <Stack spacing={8}>
            <Stack spacing={4} direction="column">
              {Object.entries(getWallets()).map(
                ([key, { name, primaryColor, secundaryColor }]) => (
                  <Button
                    key={key}
                    size="lg"
                    bgGradient={`linear(to-r, ${primaryColor}, ${secundaryColor})`}
                    _hover={{
                      bgGradient: `linear(to-l, ${primaryColor}, ${secundaryColor})`,
                      transitionDelay: "500ms",
                    }}
                    onClick={() => onSelect(key)}
                  >
                    {name}
                  </Button>
                )
              )}
            </Stack>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" colorScheme={"red"} onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
