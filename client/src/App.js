import React, { useState, Suspense, lazy } from 'react';

import './App.scss';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faSmile, faImage } from '@fortawesome/free-regular-svg-icons';
import {
  faSpinner,
  faEllipsisV,
  faUserPlus,
  faSignOutAlt,
  faTrash,
  faCaretDown,
  faUpload,
  faTimes,
  faBell,
} from '@fortawesome/free-solid-svg-icons';

// Components
const Login = lazy(() => import('./components/auth.component/Login'));
const Register = lazy(() => import('./components/auth.component/Register'));
const Chatboard = lazy(() => import('./components/chatboard.component'));

library.add(
  faSmile,
  faImage,
  faSpinner,
  faEllipsisV,
  faUserPlus,
  faSignOutAlt,
  faTrash,
  faCaretDown,
  faUpload,
  faTimes,
  faBell
);

const MODES = {
  LOGIN: 'login',
  REGISTER: 'register',
  CHATBOARD: 'chatboard',
};

function App() {
  const [mode, setMode] = useState(MODES.LOGIN);

  let ComponentToRender;

  switch (mode) {
    case MODES.LOGIN:
      ComponentToRender = <Login setMode={setMode} />;
      break;
    case MODES.REGISTER:
      ComponentToRender = <Register setMode={setMode} />;
      break;
    case MODES.CHATBOARD:
      ComponentToRender = <Chatboard setMode={setMode} />;
      break;
    default:
      ComponentToRender = null;
  }

  return (
    <div className="App">
      <Suspense fallback={<p>Loading...</p>}>{ComponentToRender}</Suspense>
    </div>
  );
}

export default App;
