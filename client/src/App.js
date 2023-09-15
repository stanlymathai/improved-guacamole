import React, { useState } from 'react';

import Login from './components/auth.component/Login';
import Register from './components/auth.component/Register';

import Chatboard from './components/chatboard.component';

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

function App() {
  const [mode, setMode] = useState('login'); // login, register, chatboard

  return (
    <div className="App">
      {mode === 'login' && <Login setMode={setMode} />}
      {mode === 'register' && <Register setMode={setMode} />}
      {mode === 'chatboard' && <Chatboard setMode={setMode} />}
    </div>
  );
}

export default App;
