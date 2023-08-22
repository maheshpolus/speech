import axios from "axios";

async function getLanguage(base) {
    try {
        const res = await axios.get(base + 'Speech/GetLanguage');
        return res.data;
        // return 'es-ES';
    } catch (err) {
        console.log(err);
    }
}

async function requestAuthorizationToken(base) {
    try {
        const res = await axios.get(base + 'Speech/GetAuthorizationKey');
        return res.data;
        // return 'eyJhbGciOiJFUzI1NiIsImtpZCI6ImtleTEiLCJ0eXAiOiJKV1QifQ.eyJyZWdpb24iOiJjZW50cmFsaW5kaWEiLCJzdWJzY3JpcHRpb24taWQiOiJmMDg3MWNjMTQ3MzQ0MTJhODYwYmEwNDhkMWVmNjVhYSIsInByb2R1Y3QtaWQiOiJTcGVlY2hTZXJ2aWNlcy5GMCIsImNvZ25pdGl2ZS1zZXJ2aWNlcy1lbmRwb2ludCI6Imh0dHBzOi8vYXBpLmNvZ25pdGl2ZS5taWNyb3NvZnQuY29tL2ludGVybmFsL3YxLjAvIiwiYXp1cmUtcmVzb3VyY2UtaWQiOiIvc3Vic2NyaXB0aW9ucy9hMmMzZmM4Ny1hZTUyLTRhMDUtODU4Yy02NGMwZTI1NWNkZmIvcmVzb3VyY2VHcm91cHMvc3BlZWNoL3Byb3ZpZGVycy9NaWNyb3NvZnQuQ29nbml0aXZlU2VydmljZXMvYWNjb3VudHMvc3BlZWNoLXRvLXRleHQtZWR1Iiwic2NvcGUiOiJzcGVlY2hzZXJ2aWNlcyIsImF1ZCI6InVybjptcy5zcGVlY2hzZXJ2aWNlcy5jZW50cmFsaW5kaWEiLCJleHAiOjE2OTI2OTA1MzIsImlzcyI6InVybjptcy5jb2duaXRpdmVzZXJ2aWNlcyJ9.PjIiXfTHgmFj6J92YyMqFLI8fC9P7pmHBpPKCgfAx8YAWbQvn8tp8kLsgranojvYGCMfNeDHVajUjqRx3t_W2A';
    } catch (err) {
        console.log(err);
    }
}

async function saveSpeechToServer(base, data) {
    try {
        const res = await axios.post(base + 'Speech/SaveSpeech', data);
        console.log(res);
    } catch (err) {
        console.log(err);
    }
}

export const speechService = {
    saveSpeechToServer, requestAuthorizationToken, getLanguage
};