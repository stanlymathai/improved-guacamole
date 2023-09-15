import React, { useState } from 'react';

import Login from './components/auth.component/Login';
import Register from './components/auth.component/Register';

import Chatboard from './components/chatboard.component';

import './App.scss';

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
