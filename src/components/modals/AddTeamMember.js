import React from 'react';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Input from './Input';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';

const AddTeamMember = ({ teamId, open, onClose, data: { loading, getAllUsers } }) => {
  if(loading){
    return (<div>Loading...</div>)
  }
  
  return (
    <div>
      <Modal
        className="modal"
        open={open}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className="addTeamMember">
            <h2 id="transition-modal-title">Add Team Members</h2>
            <Input teamId={teamId} users={getAllUsers} />
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

const GET_ALL_USERS = gql`
  query{
    getAllUsers{
      username
      email
    }
}
`;

export default graphql(GET_ALL_USERS)(AddTeamMember);