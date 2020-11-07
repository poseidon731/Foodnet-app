import axios from 'axios';
import 'intl';
import 'intl/locale-data/jsonp/en';

// import { EMAIL_PATTERN, PASSWORD_PATTERN, ALIAS_PATTERN, MOBILE_PATTERN } from '@constants/regexs';

export const navOptionHandler = () => ({
    headerShown: false,
    animationEnabled: false,
});

export const validateEmail = (value) => {
    const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (EMAIL_PATTERN.test(value)) {
        return true;
    }
    return false;
}

export const validateMobile = (value) => {
    if (MOBILE_PATTERN.test(value)) {
        return true;
    }
    return false;
}

export const validatePassword = (value) => {
    const PASSWORD_PATTERN = /^[a-zA-Z0-9!%+()@*?]{4,20}$/;
    if (PASSWORD_PATTERN.test(value)) {
        return true;
    }
    return false;
}

export const validateAlias = (value) => {
    if (ALIAS_PATTERN.test(value)) {
        return true;
    }
    return false;
}

export const validateLength = (value, length) => {
    if (value.length >= length) {
        return true;
    }
    return false;
}

export const isEmpty = (param) => {
    return param == undefined || param == null || (typeof param === 'string' && param == '') || (typeof param === 'object' && param.length == 0) || (typeof param === 'array' && param.length == 0);
}

export function SendPushNotification(token, title, body, data) {
    axios({
        method: 'POST',
        url: 'https://fcm.googleapis.com/fcm/send',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'key=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
        },
        data: {
            to: token,
            notification: {
                title: title,
                body: body,
                data: data
            }
        },
    }).then((response) => {
        console.log(response);
    });
}