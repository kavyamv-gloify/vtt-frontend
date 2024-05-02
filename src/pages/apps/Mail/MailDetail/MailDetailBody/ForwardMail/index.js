import React, {useState} from 'react';
import Button from '@mui/material/Button/index';
import InputAdornment from '@mui/material/InputAdornment/index';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import IntlMessages from '@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';
import {Box} from '@mui/material';
import PropTypes from 'prop-types';
import moment from 'moment';
import {useAuthUser} from '@crema/utility/AuthHooks';
import AppTextField from '@crema/core/AppFormComponents/AppTextField';
import ReactQuill from 'react-quill';
import {Fonts} from 'shared/constants/AppEnums';

import {styled} from '@mui/material/styles';

const ReactQuillWrapper = styled(ReactQuill)(() => {
  return {
    '& .ql-toolbar': {
      borderRadius: '8px 8px 0 0',
    },
    '& .ql-container': {
      borderRadius: '0 0 8px 8px',
      minHeight: 150,
      maxHeight: 200,
    },
  };
});

const validationSchema = yup.object({
  to: yup
    .string()
    .email(<IntlMessages id='validation.emailFormat' />)
    .required(<IntlMessages id='validation.emailRequired' />),
  cc: yup.string().email(<IntlMessages id='validation.emailFormat' />),
});

const MailForward = ({onSubmitForwardedMail}) => {
  const [isShowCC, onShowCC] = useState(false);

  const onShowCcInput = () => {
    onShowCC(true);
  };

  const {user} = useAuthUser();

  const {messages} = useIntl();

  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'grey.300',
        borderRadius: 2,
        ml: {md: 12.5},
        mt: 4,
        mb: 3,
        p: 5,
      }}
    >
      <Formik
        validateOnChange={true}
        initialValues={{
          to: '',
          cc: '',
          content: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(data, {setSubmitting, resetForm}) => {
          setSubmitting(true);
          const mail = {
            messageId: Math.floor(Math.random()) * 1000,
            sender: {
              name: user.displayName ? user.displayName : user.username,
              email: user.email,
              profilePic: '',
            },
            to: [
              {
                name: data.to ? data.to : user.username,
                email: data.to,
                profilePic: '',
              },
            ],
            cc: [],
            bcc: [],
            description: data.content ? data.content : 'No Message',
            isStarred: false,
            sentOn: moment().format('llll'),
          };

          onSubmitForwardedMail(mail);
          setSubmitting(false);
          resetForm();
        }}
      >
        {({setFieldValue}) => (
          <Form>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 4,
              }}
            >
              <AppTextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position='start'
                      sx={{
                        fontWeight: Fonts.MEDIUM,
                      }}
                    >
                      <IntlMessages id='common.to' />
                    </InputAdornment>
                  ),
                }}
                name='to'
              />

              <Box
                component='span'
                sx={{
                  ml: 4,
                  cursor: 'pointer',
                }}
                onClick={onShowCcInput}
              >
                <IntlMessages id='common.cc' />
              </Box>
            </Box>

            {isShowCC ? (
              <Box
                sx={{
                  mb: 4,
                }}
              >
                <AppTextField
                  placeholder={messages['common.cc']}
                  fullWidth
                  name='cc'
                />
              </Box>
            ) : null}

            <Box
              sx={{
                mb: 4,
              }}
            >
              <ReactQuillWrapper
                theme='snow'
                placeholder={messages['common.writeContent']}
                onChange={(value) => setFieldValue('content', value)}
              />
            </Box>

            <div style={{textAlign: 'right'}}>
              <Button
                id='btnMui123'
                type='submit'
                color='primary'
                variant='outlined'
              >
                <IntlMessages id='common.send' />
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default MailForward;

MailForward.propTypes = {
  onSubmitForwardedMail: PropTypes.func,
  selectedMail: PropTypes.object.isRequired,
};
