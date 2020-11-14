import React from 'react';

const SidebarOption = ({ Icon, title, onAddTeamMember, onAddChannel }) => {
  return (
    <div className="sidebarOption" onClick={onAddTeamMember || onAddChannel}>
      {Icon && <Icon className="sidebarOption__icon" />}
      {Icon ? <h3>{title}</h3> : 
      <h3 className="sidebarOption__channel">
        <span className="sidebarOption__hash">#</span> {title}</h3>}
    </div>
  )
}

export default SidebarOption;