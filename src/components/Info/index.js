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

export function Info({ isOpen, onClose, header, body, footer }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>{header}</ModalHeader>
        <ModalBody>{body}</ModalBody>
        <ModalFooter >
          <Button variant="outline" colorScheme={"red"} onClick={onClose} marginRight={footer ? "10px" : 0}>
            Close
          </Button>
          {footer ? footer : null}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
