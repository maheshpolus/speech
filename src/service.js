import axios from "axios";

async function getLanguage(base) {
    try {
        const res = await axios.get(base + 'Speech/GetLanguage');
        return res.data;
    } catch (err) {
        console.log(err);
    }
}

async function requestAuthorizationToken(base) {
    try {
        const res = await axios.get(base + 'Speech/GetAuthorizationKey');
        return res.data;
        } catch (err) {
        console.log(err);
    }
}

async function saveSpeechToServer(base, data) {
    try {
        const res = await axios.post(base + 'Speech/SaveSpeech', data);
        return res.data;
    } catch (err) {
        console.log(err);
    }
}

export const speechService = {
    saveSpeechToServer, requestAuthorizationToken, getLanguage
};