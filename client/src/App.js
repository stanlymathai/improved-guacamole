import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

import Layout from './components/layout.component/Layout';
import Login from './components/auth.component/Login';
import Register from './components/auth.component/Register';

import './App.scss';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<Layout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route render={() => <h1>404 page not found</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
