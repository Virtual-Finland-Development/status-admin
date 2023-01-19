import { useContext } from 'react';
import { useSelector } from '@xstate/react';

import './App.css';

// state context
import { StateContext, StateProvider } from '../../state/StateContext';

// components
import Login from '../Login/Login';
import AuthenticatedContainer from '../AuthenticatedContainer/AuthenticatedContainer';

function Content() {
  const { authService } = useContext(StateContext);
  const isLoggedIn = useSelector(authService, state =>
    state.matches('authenticated')
  );

  return !isLoggedIn ? <Login /> : <AuthenticatedContainer />;
}

function App() {
  return (
    <StateProvider>
      <Content />
    </StateProvider>
  );
}

export default App;
