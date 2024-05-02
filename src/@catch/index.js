import { useRef } from 'react';
import axios from 'axios';
import api from '@api';
import _ from '@lodash';
import Api from '@api';
import { toast } from 'react-toastify';
class handleCatchError {
    static async errorAction(err) {
        const AxiosError = require('axios-error');
        const errors = new AxiosError(err);
        toast.error("Something went wrong. ("+errors?.response?.data?.status+errors?.response?.data?.error + ')')
    }
}

export default handleCatchError;