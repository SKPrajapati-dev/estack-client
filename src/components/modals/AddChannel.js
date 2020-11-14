import React, { useState } from 'react';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import NoSsr from '@material-ui/core/NoSsr';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import { gql } from '@apollo/client';
import { graphql, withApollo } from '@apollo/client/react/hoc';
import compose from 'lodash.flowright';
import useAutocomplete from '@material-ui/lab/useAutocomplete';

const Label = styled('label')`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;

const InputWrapper = styled('div')`
  width: 300px;
  border: 1px solid #d9d9d9;
  background-color: #fff;
  border-radius: 4px;
  padding: 1px;
  display: flex;
  flex-wrap: wrap;

  &:hover {
    border-color: #40a9ff;
  }

  &.focused {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  & input {
    font-size: 14px;
    color: black;
    height: 30px;
    box-sizing: border-box;
    padding: 4px 6px;
    width: 0;
    min-width: 30px;
    flex-grow: 1;
    border: 0;
    margin: 0;
    outline: 0;
  }
`;

const Tag = styled(({ label, onDelete, ...props }) => (
  <div {...props}>
    <span>{label}</span>
    <CloseIcon onClick={onDelete} />
  </div>
))`
  display: flex;
  align-items: center;
  height: 24px;
  margin: 2px;
  line-height: 22px;
  background-color: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  box-sizing: content-box;
  padding: 0 4px 0 10px;
  outline: 0;
  overflow: hidden;
  color: black;

  &:focus {
    border-color: #40a9ff;
    background-color: #e6f7ff;
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & svg {
    font-size: 12px;
    cursor: pointer;
    padding: 4px;
  }
`;

const Listbox = styled('ul')`
  width: 300px;
  color: black;
  margin: 2px 0 0;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color: #fff;
  overflow: auto;
  max-height: 250px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }

    & svg {
      color: transparent;
    }
  }

  & li[aria-selected='true'] {
    background-color: #fafafa;
    font-weight: 600;

    & svg {
      color: #1890ff;
    }
  }

  & li[data-focus='true'] {
    background-color: #e6f7ff;
    cursor: pointer;

    & svg {
      color: #000;
    }
  }
`;


const AddChannel = ({ open, onClose, teamId, teamName, mutate, client }) => {

  const [state, setState] = useState({
    channelName: '',
    public: true,
    teamMembers: [],
  });


  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: 'addTeamMember',
    multiple: true,
    options: state.teamMembers,
    getOptionLabel: (option) => option.username,
  });

  const handleChange = (e) => {
    setState({
      ...state,
      channelName: e.target.value
    });
  }
  
  const handleCheck = (e) => {
    e.persist();
    client.query({
      query: GET_TEAM_MEMBERS,
      variables: {
        teamId
      }
    }).then(({ data }) => {
      setState({
        ...state,
        public: !e.target.checked,
        teamMembers: data.getTeamMembers
      })
    })
  }

  function redirect(channelId){
    return (
      <Redirect push to={`/home/${teamId}/${channelId}`} />
    )
  }

  const handleSubmit = async () => {

      const response = await mutate({
        variables: {
          teamId,
          name: state.channelName,
          public: state.public
        }
      });
      const  { ok, channel, errors } = response.data.createChannel;
      if(ok){
        redirect(channel.id);
      }else{
        const err = [];
        errors.forEach(({ path, message}) => {
          err[`${path}Error`] = message;
        });
        console.log(err);
      }
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
          <div className="addChannelModal">
            <h2 id="transition-modal-title">Add Channel to {teamName} </h2>
            <input className="addChannel__name" value={state.channelName} type="text" onChange={handleChange} placeholder="Please do not prefix a channel name whith '#'..Estack will do that for you" />
            <br />
            <input className="addChannel__public" type="checkbox" name="public" onChange={handleCheck} />
            <label for="public"> Private Channel</label><br />
            <br />
            {!state.public && <div>
              <NoSsr>
                <div>
                  <div {...getRootProps()}>
                    <Label {...getInputLabelProps()}>Search Team Members</Label>
                    <InputWrapper ref={setAnchorEl} className={focused ? 'focused' : ''} >
                      {value.map((option, index) => (
                        <Tag label={option.username} {...getTagProps({ index })} />
                      ))}

                      <input {...getInputProps()} />
                    </InputWrapper>
                  </div>
                  {groupedOptions.length > 0 ? (
                    <Listbox {...getListboxProps()}>
                      {groupedOptions.map((option, index) => (
                        <li {...getOptionProps({ option, index })}>
                          <span>{option.username}</span>
                          <CheckIcon fontSize="small" />
                        </li>
                      ))}
                    </Listbox>
                  ) : null}
                </div>
              </NoSsr>
              </div>}
              <br />
            <button onClick={handleSubmit}>Add Channel</button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

const CREATE_CHANNEL = gql`
  mutation($teamId: ID!, $name: String!, $public: Boolean){
    createChannel(teamId: $teamId, name: $name, public: $public){
      ok
      channel{
        id
        channelName
      }
      errors{
        path
        message
      }
    }
  }
`;

const GET_TEAM_MEMBERS = gql`
  query GetTeamMembers($teamId: ID!){
    getTeamMembers(teamId: $teamId){
      id
      username
    }
  }
`;

export default compose(
  withApollo,
  graphql(CREATE_CHANNEL)
)(AddChannel);