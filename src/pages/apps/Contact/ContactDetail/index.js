import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {onUpdateSelectedContact} from 'redux/actions';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import ContactActions from './ContactActions';
import PersonalDetails from './PersonalDetails';
import OtherDetails from './OtherDetails';
import AppDialog from '@crema/core/AppDialog';
import AppGridContainer from '@crema/core/AppGridContainer';
import Grid from '@mui/material/Grid';
import {DialogActions} from '@mui/material';
import Button from '@mui/material/Button';

const ContactDetail = (props) => {
  const {
    isShowDetail,
    selectedContact,
    onShowDetail,
    onSelectContactsForDelete,
    onOpenEditContact,
  } = props;
  const dispatch = useDispatch();

  const [contact, setContact] = useState(selectedContact);

  useEffect(() => {
    setContact(selectedContact);
  }, [selectedContact]);

  const onChangeStarred = (checked) => {
    const updatedContact = contact;
    contact.isStarred = checked;
    setContact(updatedContact);
    dispatch(onUpdateSelectedContact(contact));
  };

  const onDeleteContact = () => {
    onSelectContactsForDelete([contact.id]);
    onShowDetail(false);
  };

  return (
    <>
      <AppDialog
        sxStyle={{
          '& .MuiPaper-root:hover': {
            '& .btn-action-view': {
              opacity: 1,
              visibility: 'visible',
            },
          },
        }}
        onClose={() => onShowDetail(false)}
        hideClose
        open={isShowDetail}
        title={
          <ContactActions
            onChangeStarred={onChangeStarred}
            onDeleteContact={onDeleteContact}
            onOpenEditContact={onOpenEditContact}
            contact={contact}
          />
        }
      >
        {contact ? (
          <div>
            <Box
              sx={{
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                ml: -6,
                mr: -6,
                pl: 5,
                pr: 5,
                pb: 4,
              }}
            >
              <Box
                sx={{
                  mb: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {contact.image ? (
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mb: 2.5,
                    }}
                    src={contact.image}
                  />
                ) : (
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mb: 2.5,
                    }}
                  >
                    {contact.name[0].toUpperCase()}
                  </Avatar>
                )}
                <Box component='h3'>{contact.name}</Box>
              </Box>
            </Box>

            <Box
              sx={{
                pt: 5,
              }}
            >
              <AppGridContainer>
                <Grid item xs={12} md={6}>
                  <PersonalDetails contact={contact} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <OtherDetails contact={contact} />
                </Grid>
              </AppGridContainer>
            </Box>
          </div>
        ) : (
          <div />
        )}
        <DialogActions>
          <Button
            id='btnMui123'
            variant='outlined'
            color='primary'
            type='submit'
            sx={{width: 100}}
            onClick={() => onShowDetail(false)}
          >
            Close
          </Button>
        </DialogActions>
      </AppDialog>
    </>
  );
};

export default ContactDetail;

ContactDetail.propTypes = {
  isShowDetail: PropTypes.bool.isRequired,
  onShowDetail: PropTypes.func.isRequired,
  selectedContact: PropTypes.object,
  onSelectContactsForDelete: PropTypes.func,
  onOpenEditContact: PropTypes.func,
};
