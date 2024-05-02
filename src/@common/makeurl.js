import { useRef } from 'react';
import axios from 'axios';
import api from '@api';
import _ from '@lodash';
import Api from '@api';
class getDocUrl {
    static async docURL(ur) {
        let blob = await axios.post(Api?.file?.filedownload, { "fileurl": ur }, { responseType: 'blob' });
        const reader = new FileReader();
        await reader.readAsDataURL(blob.data);
        let yoi = await new Promise(resolve => {
            reader.onloadend = () => {
                resolve(reader.result);
            };
        });
        return yoi;
    }
}

export default getDocUrl;