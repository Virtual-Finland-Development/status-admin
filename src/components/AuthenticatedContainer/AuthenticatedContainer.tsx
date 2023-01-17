import { Container } from '@chakra-ui/react';

// components
import NavBar from '../NavBar/NavBar';
// import StatusPanel from '../StatusPanel/StatusPanel';
import StatusTable from '../StatusTable/StatusTable';

function AuthenticatedContainer() {
  return (
    <>
      <NavBar />
      <Container maxW="container.lg" my={6}>
        <StatusTable />
      </Container>
    </>
  );
}

export default AuthenticatedContainer;
