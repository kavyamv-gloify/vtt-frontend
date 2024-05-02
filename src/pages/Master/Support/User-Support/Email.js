import React, {Component, useState, useEffect} from 'react';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Api from '@api';
import axios from 'axios';
import {createFilterOptions} from '@mui/base';

const Editor = ({email, sms, notification, type, id}) => {
  const [body, setBody] = useState();
  const [emailBody, setEmailBody] = useState();

  useEffect(() => {
    if (id?.length) {
      axios
        .get(Api.baseUri + '/user-reg/announcement/getbyid/' + id)
        .then((res) => {
          if (res?.data?.data?.emailMessage)
            setEmailBody(res?.data?.data?.emailMessage);
        });
    }
  }, [id]);

  useEffect(() => {
    if (body?.length && type == 'email') {
      email(body);
    }
  }, [body]);
  {
    return (
      <>
        <div className='App'>
          <CKEditor
            id='textareaId'
            editor={ClassicEditor}
            data={emailBody}
            // onReady={editor => {
            //     // You can store the "editor" and use when it is needed.
            // }}
            config={{
              ckfinder: {
                uploadUrl: '/upload',
              },
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              setBody(data);
            }}
            // onBlur={(event, editor) => {
            // }}
            // onFocus={(event, editor) => {
            // }}
          />
        </div>
      </>
    );
  }
};

export default Editor;
