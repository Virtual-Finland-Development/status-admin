import { Fragment } from 'react';
import { Container } from '@chakra-ui/react';

// components
import NavBar from '../NavBar/NavBar';
// import StatusPanel from '../StatusPanel/StatusPanel';
import StatusTable from '../StatusTable/StatusTable';

function AuthenticatedContainer() {
  return (
    <Fragment>
      <NavBar />
      <Container maxW="container.lg" my={6}>
        <StatusTable />
      </Container>
    </Fragment>
  );
}

export default AuthenticatedContainer;
