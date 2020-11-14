import React, { useState } from 'react';
import { InsertComment, Inbox, Drafts, BookmarkBorder, PeopleAlt, ExpandLess, ExpandMore, Add } from '@material-ui/icons';
import SidebarOption from './SidebarOption';
import { Link } from 'react-router-dom';
import AddTeamMemberModal from './modals/AddTeamMember';
import AddChannelModal from './modals/AddChannel';

const Sidebar = ({ team, userId }) => {

  const [state, setState] = useState({
    openAddTeamMember: false,
    openAddChannel: false
  })

  var isOwner;
  if(team.ownerId === userId){
    isOwner = true;
  }else{
    isOwner = false;
  }

  const toggleAddMemberModal = (e) => {
    if(e){
      e.preventDefault();
    }
    setState({
      ...state,
      openAddTeamMember: !state.openAddTeamMember
    });
  }

  const toggleAddChannelModal = (e) => {
    if(e){
      e.preventDefault();
    }
    setState({
      ...state,
      openAddChannel: !state.openAddChannel
    })
  }


  return (
    <div className="sidebar">
      <SidebarOption Icon={InsertComment} title="Threads" />
      <SidebarOption Icon={Inbox} title="Mentions & reactions" />
      <SidebarOption Icon={Drafts} title="Saved Items" />
      <SidebarOption Icon={BookmarkBorder} title="Channel Browser" />
      <SidebarOption Icon={PeopleAlt} title="Peoples" />
      <SidebarOption Icon={ExpandLess} title="Show less" />
      {isOwner && <SidebarOption Icon={Add} title={`Add Members to ${team.teamName}`} onAddTeamMember={toggleAddMemberModal} /> }
      <hr />
      <SidebarOption Icon={ExpandMore} title="Channels" />
      <hr />
      {isOwner && <SidebarOption Icon={Add} title="Add Channel" onAddChannel={toggleAddChannelModal} />}
      {/* Fetch Channels which this user belongs to from server*/}
      {team.channels.map((channel) => {
        return (
          <Link key={channel.id} to={`/home/${team.id}/${channel.id}`} style={{textDecoration: 'none'}}>
            <SidebarOption title={channel.channelName} />
          </Link>
        )
      })}

      <AddTeamMemberModal 
        teamId={team.id}
        open={state.openAddTeamMember} 
        onClose={toggleAddMemberModal} 
      />

      <AddChannelModal
        teamId={team.id}
        teamName={team.teamName}
        open={state.openAddChannel}
        onClose={toggleAddChannelModal}
      />
    </div>
  )
}

export default Sidebar;