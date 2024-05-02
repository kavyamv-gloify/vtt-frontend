import {useRef} from 'react';
import axios from 'axios';
import _ from '@lodash';
import Api from '@api';
class geturl {
  static async getRealUrl(ur, myname) {
    let postData = {
      fileurl: ur,
    };
    axios
      .post(Api?.baseUri + '/user-reg/download-file', postData, {
        responseType: 'blob',
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob.data);
        var reader = new FileReader();
        reader.readAsDataURL(blob.data);
        reader.onloadend = function () {
          var base64data = reader.result;
          if (myname) localStorage.setItem(myname, base64data);
          return base64data;
        };
      })
      .catch((error) => {});
  }
}

export default geturl;
