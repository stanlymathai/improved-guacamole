import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { register } from '../../store/actions.store/auth.action';
import registerImage from '../../assets/images/register.svg';
import './Auth.scss';

const Register = ({ setMode }) => {
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('male');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitForm = (e) => {
    e.preventDefault();

    const payload = {
      firstName,
      lastName,
      email,
      gender,
      password,
    };

    dispatch(register(payload, setMode));
  };

  return (
    <div id="auth-container">
      <div id="auth-card">
        <div className="card-shadow">
          <div id="image-section">
            <img src={registerImage} alt="Register" />
          </div>

          <div id="form-section">
            <h2>Create an account</h2>

            <form onSubmit={submitForm}>
              <div className="input-field mb-1">
                <input
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                  required="required"
                  type="text"
                  placeholder="First name"
                />
              </div>

              <div className="input-field mb-1">
                <input
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                  required="required"
                  type="text"
                  placeholder="Last name"
                />
              </div>

              <div className="input-field mb-1">
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required="required"
                  type="email"
                  placeholder="Email"
                />
              </div>

              <div className="input-field mb-1">
                <select
                  onChange={(e) => setGender(e.target.value)}
                  value={gender}
                  required="required"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">non-binary</option>
                  <option value="prefer not to say">prefer not to say</option>
                </select>
              </div>

              <div className="input-field mb-2">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required="required"
                  type="password"
                  placeholder="Password"
                />
              </div>

              <button type="submit">REGISTER</button>
            </form>

            <p>
              Already have an account?{' '}
              <button type="button" onClick={() => setMode('login')}>
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
