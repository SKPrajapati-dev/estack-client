import React from 'react';
import { Link } from 'react-router-dom';

const TeamSidebar = ({ teams }) => {

  return (
    <div className="teamSidebar">
      <div className="teamSidebar__wrapper">
        <ul className="teamSidebar__list">
          <Link key="add-team" to="/create-team" style={{textDecoration: 'none'}}>
            <li className="teamSidebar__listItem">+</li>
          </Link>
          {teams.map(team => {
            const letter = team.teamName.charAt(0).toUpperCase();
            return (
              <Link key={`team-${team.id}`} to={`/home/${team.id}`} style={{textDecoration: 'none'}}>
                <li className="teamSidebar__listItem">{letter}</li>
              </Link>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default TeamSidebar;