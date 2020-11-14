import React from 'react';
import { Avatar } from '@material-ui/core';
import { AccessTime, Search, HelpOutline } from '@material-ui/icons';
import { FiberManualRecord } from '@material-ui/icons';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';

const Header = ({ user, mutate }) => {

  const handleLogout = async () => {
    await mutate();
    localStorage.removeItem('token');
    window.location.replace('http://localhost:3000')
  }
  return (
    <div className="header">
      <div className="header__left">
        <Avatar 
          className="header__avatar"
          alt={user.username.toUpperCase()}
          src='cisjidj'
        />
        <div className="header__info">
          <h2>{user.username} </h2>
          <h3>
            <FiberManualRecord />
            {user.email}
          </h3>
        </div>
        <AccessTime />
      </div>
      <div className="header__search">
        <Search />
        <input placeholder="Search Estack here" />
      </div>
      <div className="header__right">
        <div className="header__logout" onClick={handleLogout}>Logout</div>
        <HelpOutline />
      </div>
    </div>
  )
}

const LOGOUT = gql`
  mutation{
    logout
  }
`;

export default graphql(LOGOUT)(Header);