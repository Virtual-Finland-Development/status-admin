import { createContext, useContext } from 'react';
import { useInterpret, useSelector } from '@xstate/react';
import { InterpreterFrom } from 'xstate';

import './App.css';

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
  const isLoggedIn = useSelector(authService, state =>
    state.matches('authenticated')
  );

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
