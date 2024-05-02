import React, {Component, useState, useEffect} from 'react';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Api from '@api';
import axios from 'axios';
import {createFilterOptions} from '@mui/base';

const Editor = ({setEmail, id, resolution,setResolution, emailBodys}) => {
  // const [body, setBody] = useState();
  // const [emailBody, setEmailBody] = useState();

  // useEffect(() => {
  //   if (id?.length) {
  //     axios
  //       .get(
  //         Api.baseUri +
  //           '/user-reg/incident-management/get-incident-management-by-id/' +
  //           id,
  //       )
  //       .then((res) => {
  //         if (res?.data?.status == '200') {
  //           setEmailBody(res?.data?.data?.resolution ?? ' ');
  //         }
  //       });
  //   }
  // }, [id]);

  // useEffect(() => {
  //   if (body?.length) {
  //     // setEmail(body);
  //     resolution(body);
  //   }
  // }, [body]);
  {
    return (
      <>
        <div className='App'>
          <CKEditor
            id='textareaId'
            editor={ClassicEditor}
            // data={emailBody}
            data={resolution?.length ? resolution : ""}
            // onReady={editor => {
            //     // You can store the "editor" and use when it is needed.
            // }}
            config={{
              ckfinder: {
                uploadUrl: '/upload',
              },
            }}
            onChange={(event, editor) => { 
              // const data = editor.getData();
              // console.log('data', data);
              // setBody(data);
              setResolution(editor.getData());
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
