import axios from "axios";
const base = "https://localhost:44384/";
async function getLanguage(base) {
  try {
    const res = await axios.get(base + "Speech/GetLanguage");
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

async function requestAuthorizationToken(base) {
  try {
    const res = await axios.get(base + "Speech/GetAuthorizationKey");
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

async function saveSpeechToServer(data) {
  try {
    const res = await axios.post(base + "Speech/AudioFileToSpeech", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export const speechService = {
  saveSpeechToServer,
  requestAuthorizationToken,
  getLanguage,
};
