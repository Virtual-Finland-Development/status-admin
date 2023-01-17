import { Flex, Container } from '@chakra-ui/react';

// components
import NavBar from '../NavBar/NavBar';
import StatusPanel from '../StatusPanel/StatusPanel';

function AuthenticatedContainer() {
  return (
    <>
      <NavBar />
      <Flex bg="gray.50">
        <Container maxW="container.lg" my={6}>
          <StatusPanel />
        </Container>
      </Flex>
    </>
  );
}

export default AuthenticatedContainer;
