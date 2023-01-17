import { createMachine, assign } from 'xstate';

interface AuthContext {
  isLoggedIn: boolean;
}

type LoginEvent = { type: 'LOG_IN'; id: string };
type LogOutEvent = { type: 'LOG_OUT' };
type AuthEvent = LoginEvent | LogOutEvent;

const createAuthMachine = (storedAuth: string | null) =>
  createMachine(
    {
      id: 'auth',
      predictableActionArguments: true,
      schema: {
        context: {} as AuthContext,
        events: {} as AuthEvent,
      },
      context: {
        isLoggedIn: storedAuth !== null,
      },
      initial: !storedAuth ? 'notAuthenticated' : 'authenticated',
      states: {
        notAuthenticated: {
          on: {
            LOG_IN: {
              actions: ['logIn', 'storeAuth'],
              target: 'authenticated',
            },
          },
        },
        authenticated: {
          on: {
            LOG_OUT: {
              actions: ['logOut', 'clearAuth'],
              target: 'notAuthenticated',
            },
          },
        },
      },
    },
    {
      actions: {
        logIn: assign({
          isLoggedIn: true,
        }),
        storeAuth: (_, event: LoginEvent) => {
          localStorage.setItem('auth', event.id);
        },
        logOut: assign({
          isLoggedIn: false,
        }),
        clearAuth: () => {
          localStorage.clear();
        },
      },
    }
  );

const authMachine = createAuthMachine(localStorage.getItem('auth'));

export { authMachine };
