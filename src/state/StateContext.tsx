import { createContext, ReactElement, useCallback, useEffect } from 'react';
import { InterpreterFrom } from 'xstate';
import { useInterpret } from '@xstate/react';

// auth state
import { authMachine } from './auth/authMachine';

const StateContext = createContext({
  authService: {} as InterpreterFrom<typeof authMachine>,
});

function StateProvider({ children }: { children: ReactElement }) {
  const authService = useInterpret(authMachine);

  useEffect(() => {
    const onWindowMessageEvent = (event: MessageEvent) => {
      if (event.data === 'auth-expired') {
        authService.send('LOG_OUT');
      }
    };

    window.addEventListener('message', onWindowMessageEvent);

    return () => window.removeEventListener('message', onWindowMessageEvent);
  }, [authService]);

  return (
    <StateContext.Provider value={{ authService }}>
      {children}
    </StateContext.Provider>
  );
}

export { StateContext, StateProvider };
