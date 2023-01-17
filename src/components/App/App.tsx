import { createContext, useContext } from 'react';
import { useInterpret, useActor } from '@xstate/react';
import { InterpreterFrom } from 'xstate';

// auth state
import { authMachine } from '../../state/auth/authMachine';

// components
import Login from '../Login/Login';
import AuthenticatedContainer from '../AuthenticatedContainer/AuthenticatedContainer';

// global context
export const GlobalStateContext = createContext({
  authService: {} as InterpreterFrom<typeof authMachine>,
});

function Content() {
  const { authService } = useContext(GlobalStateContext);
  const [state] = useActor(authService);
  const {
    context: { isLoggedIn },
  } = state;

  return !isLoggedIn ? <Login /> : <AuthenticatedContainer />;
}

function App() {
  const authService = useInterpret(authMachine);

  return (
    <GlobalStateContext.Provider value={{ authService }}>
      <Content />
    </GlobalStateContext.Provider>
  );
}

export default App;
