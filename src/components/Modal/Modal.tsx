import { ReactElement } from 'react';
import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalSettings: {
    title: string;
    content: string | ReactElement;
  };
}

function Modal(props: ModalProps) {
  const { isOpen, onClose, modalSettings } = props;

  return (
    <ChakraModal
      isCentered
      closeOnEsc={false}
      closeOnOverlayClick={false}
      size="md"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{modalSettings.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{modalSettings.content}</ModalBody>
      </ModalContent>
    </ChakraModal>
  );
}

export default Modal;
