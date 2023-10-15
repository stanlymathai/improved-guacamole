import React, { useState, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  logout,
  updateProfile,
} from '../../../../store/actions.store/auth.action';

import Modal from '../modal.element';

import maleIcon from '../../../../assets/images/male.svg';
import femaleIcon from '../../../../assets/images/female.svg';

import './Navbar.scss';

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [gender, setGender] = useState(user.gender);
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');

  const submitForm = (e) => {
    e.preventDefault();

    const _formData = { firstName, lastName, email, gender, avatar };
    if (password.length > 0) _formData.password = password;

    const formData = new FormData();

    for (const key in _formData) {
      formData.append(key, _formData[key]);
    }

    dispatch(updateProfile(formData)).then(() => setShowProfileModal(false));
  };

  const imgSrc = user.avatar
    ? user.avatar
    : gender === 'female'
    ? femaleIcon
    : maleIcon;

  return (
    <div id="navbar" className="card-shadow">
      <h2>ChatMoni</h2>
      <div
        onClick={() => setShowProfileOptions(!showProfileOptions)}
        id="profile-menu"
      >
        <img width="40" height="40" src={imgSrc} alt="Avatar" />
        <p>
          {user.firstName} {user.lastName}
        </p>

        {showProfileOptions && (
          <div id="profile-options">
            <p onClick={() => setShowProfileModal(true)}>Update profile</p>
            <p onClick={() => dispatch(logout())}>Logout</p>
          </div>
        )}

        {showProfileModal && (
          <Modal click={() => setShowProfileModal(false)}>
            <Fragment key="header">
              <h3 className="m-0">Update profile</h3>
            </Fragment>

            <Fragment key="body">
              <form>
                <div className="input-field mb-1">
                  <input
                    onChange={(e) => setFirstName(e.target.value)}
                    value={firstName}
                    required="required"
                    placeholder="First name"
                    type="text"
                  />
                </div>

                <div className="input-field mb-1">
                  <input
                    onChange={(e) => setLastName(e.target.value)}
                    value={lastName}
                    required="required"
                    placeholder="Last name"
                    type="text"
                  />
                </div>

                <div className="input-field mb-1">
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required="required"
                    placeholder="Email"
                    type="email"
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
                    <option value="not-specified">prefer not to say</option>
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

                <div className="input-field mb-2">
                  <input
                    onChange={(e) => setAvatar(e.target.files[0])}
                    type="file"
                  />
                </div>
              </form>
            </Fragment>

            <Fragment key="footer">
              <button className="btn-success" onClick={submitForm}>
                UPDATE
              </button>
            </Fragment>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Navbar;
