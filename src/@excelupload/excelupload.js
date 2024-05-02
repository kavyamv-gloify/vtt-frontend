import {useRef} from 'react';
import axios from 'axios';
import api from '@api';
import _ from '@lodash';
import Api from '@api';
import {toast} from 'react-toastify';
class excelDoc {
  static async uploadDoc(file, uploadURL) {
    const getFormData = (object) =>
      Object.keys(object).reduce((formData, key) => {
        formData.append(key, object[key]);
        return formData;
      }, new FormData());
    let tem = {file: file};
    let dataSet = {file: file};
    let allElem = {};
    Object.keys(tem).map((key) => {
      if (typeof tem[key]?.[0]?.name == 'string') {
        dataSet = {
          ...dataSet,
          [key]: tem[key][0],
        };
      } else {
        allElem = {
          ...allElem,
          [key]: tem[key],
        };
      }
    });
    dataSet = {
      ...dataSet,
      data: JSON.stringify(allElem),
    };
    let temErr = await axios({
      method: 'post',
      url: Api?.baseUri + uploadURL,
      data: getFormData(dataSet),
      headers: {'Content-Type': 'multipart/form-data'},
    });
    if (temErr?.data?.status == '200') {
      toast.success(temErr?.data?.message ?? 'Uploaded successfully.');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      if (!temErr?.data?.data) {
        toast.error(temErr?.data?.message);
        return;
      }
      if (typeof temErr?.data?.data == 'string') {
        toast.error(temErr?.data?.data?.message);
        return;
      }
      return temErr?.data;
    }
  }
  static async downloadDocPost(downloadurl, downloadFile, downloadBody) {
    // console.log(downloadFile, 'downloadFiledownloadFiledownloadFile');
    axios
      .post(Api?.baseUri + downloadurl, downloadBody, {responseType: 'blob'})
      .then((blob) => {
        const url = window.URL.createObjectURL(blob.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = downloadFile;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {});
  }
  static async downloadDoc(downloadurl, downloadFile) {
    axios
      .get(Api?.baseUri + downloadurl, {responseType: 'blob'})
      .then((blob) => {
        const url = window.URL.createObjectURL(blob.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = downloadFile;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {});
  }
}

export default excelDoc;
