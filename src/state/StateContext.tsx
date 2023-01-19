import { createContext, ReactElement } from 'react';
import { InterpreterFrom } from 'xstate';
import { useInterpret } from '@xstate/react';

// auth state
import { authMachine } from './auth/authMachine';

const StateContext = createContext({
  authService: {} as InterpreterFrom<typeof authMachine>,
});

function StateProvider({ children }: { children: ReactElement }) {
  const authService = useInterpret(authMachine);

  return (
    <StateContext.Provider value={{ authService }}>
      {children}
    </StateContext.Provider>
  );
}

export { StateContext, StateProvider };
