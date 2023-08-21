/* eslint-disable eqeqeq */
/* eslint-disable no-multi-str */
/* eslint-disable no-unused-vars */
/* eslint-disable default-case */
var SpeechSDK;
var authorizationToken = 'eyJhbGciOiJFUzI1NiIsImtpZCI6ImtleTEiLCJ0eXAiOiJKV1QifQ.eyJyZWdpb24iOiJjZW50cmFsaW5kaWEiLCJzdWJzY3JpcHRpb24taWQiOiJmMDg3MWNjMTQ3MzQ0MTJhODYwYmEwNDhkMWVmNjVhYSIsInByb2R1Y3QtaWQiOiJTcGVlY2hTZXJ2aWNlcy5GMCIsImNvZ25pdGl2ZS1zZXJ2aWNlcy1lbmRwb2ludCI6Imh0dHBzOi8vYXBpLmNvZ25pdGl2ZS5taWNyb3NvZnQuY29tL2ludGVybmFsL3YxLjAvIiwiYXp1cmUtcmVzb3VyY2UtaWQiOiIvc3Vic2NyaXB0aW9ucy9hMmMzZmM4Ny1hZTUyLTRhMDUtODU4Yy02NGMwZTI1NWNkZmIvcmVzb3VyY2VHcm91cHMvc3BlZWNoL3Byb3ZpZGVycy9NaWNyb3NvZnQuQ29nbml0aXZlU2VydmljZXMvYWNjb3VudHMvc3BlZWNoLXRvLXRleHQtZWR1Iiwic2NvcGUiOiJzcGVlY2hzZXJ2aWNlcyIsImF1ZCI6InVybjptcy5zcGVlY2hzZXJ2aWNlcy5jZW50cmFsaW5kaWEiLCJleHAiOjE2OTI2MjUxMzksImlzcyI6InVybjptcy5jb2duaXRpdmVzZXJ2aWNlcyJ9.U6J-W_tG8Q7MuS_fwOxNqfnIaO9GiEfXEWorSOuL54QdKofsHFhR19fDhWm1v79mjtku0aG9WbJSkKJTpgpNcQ';
var regionOptions = 'centralindia';
var languageOptions = 'es-ES'; 
var scenarioSelection = 'pronunciationAssessmentOnce'; 
var reco;
var referenceText = 'Hola, me llamo Jorge';
var authorizationEndpoint = 'Speech/GetAuthorizationKey';
var saveSpeechEndPoint = 'Speech/SaveSpeech';
var lanugaeEndPoint = 'Speech/GetLanguage'
var soundContext = undefined;

async function RequestAuthorizationToken() {
    try {
        const res = await fetch (authorizationEndpoint);
        const token = await res.json();
        authorizationToken = token;
        console.log('Token fetched from back-end: ' + token);
    } catch (err) {
        console.log(err);
    }
}

async function RequestLanguage() {
    try {
        const res = await fetch (authorizationEndpoint);
        const token = await res.json();
        authorizationToken = token;
        console.log('Token fetched from back-end: ' + token);
    } catch (err) {
        console.log(err);
    }
}

function Initialize(onComplete) {
    if (!!window.SpeechSDK) {
        onComplete(window.SpeechSDK);
    }
}
try {
    var AudioContext = window.AudioContext // our preferred impl
        || window.webkitAudioContext       // fallback, mostly when on Safari
        || false;                          // could not find.
    if (AudioContext) {
        soundContext = new AudioContext();
    } else {
        alert("Audio context not supported");
    }
} catch (e) {
    window.console.log("no sound context found, no audio output. " + e);
}

document.addEventListener("DOMContentLoaded", function () {
    Initialize(async function (speechSdk) {
        SpeechSDK = speechSdk;
        await RequestAuthorizationToken();
        await RequestLanguage();
    });
});

function getAudioConfig() {
    return SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
}

function getSpeechConfig(sdkConfigType) {
    let speechConfig;
    if (authorizationToken) {
        speechConfig = sdkConfigType.fromAuthorizationToken(authorizationToken, regionOptions);
    }
    speechConfig.outputFormat = SpeechSDK.OutputFormat.Detailed;
    speechConfig.speechRecognitionLanguage = languageOptions;
    return speechConfig;
}

function getPronunciationAssessmentConfig() {
    var pronunciationAssessmentConfig = new SpeechSDK.PronunciationAssessmentConfig(referenceText,
        SpeechSDK.PronunciationAssessmentGradingSystem.HundredMark,
        SpeechSDK.PronunciationAssessmentGranularity.Word, true);
    return pronunciationAssessmentConfig;
}

function getPronunciationAssessmentConfigFromJson() {
    var pronunciationAssessmentConfig = new SpeechSDK.PronunciationAssessmentConfig.fromJSON(
        "{\"GradingSystem\": \"HundredMark\", \
                \"Granularity\": \"Phoneme\", \
                \"EnableMiscue\": \"True\", \
                \"ScenarioId\": \"[scenario ID will be assigned by product team]\"}"
    );
    pronunciationAssessmentConfig.referenceText = referenceText;
    return pronunciationAssessmentConfig;
}

function onRecognizing(sender, recognitionEventArgs) {
   // for getting inbetween results
}

function onRecognized(sender, recognitionEventArgs) {
    var result = recognitionEventArgs.result;
    onRecognizedResult(recognitionEventArgs.result);
}

function onRecognizedResult(result) {
   console.log(result);
   saveSpeechToServer()
}

function onSessionStarted(sender, sessionEventArgs) {
    console.log(sessionEventArgs.sessionId);
}

function onSessionStopped(sender, sessionEventArgs) {
    // sesion stopped logic
}

function onCanceled(sender, cancellationEventArgs) {
    window.console.log(cancellationEventArgs);
}

function applyCommonConfigurationTo(recognizer) {
    recognizer.recognizing = onRecognizing;
    recognizer.recognized = onRecognized;
    recognizer.canceled = onCanceled;
    recognizer.sessionStarted = onSessionStarted;
    recognizer.sessionStopped = onSessionStopped;
}


function doPronunciationAssessmentOnceAsync() {
    var audioConfig = getAudioConfig();
    var speechConfig = getSpeechConfig(SpeechSDK.SpeechConfig);
    var pronunciationAssessmentConfig = getPronunciationAssessmentConfig();
    if (!audioConfig || !speechConfig || !pronunciationAssessmentConfig) return;
    reco = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
    applyCommonConfigurationTo(reco);
    pronunciationAssessmentConfig.applyTo(reco);
    reco.recognized = undefined;
    reco.recognizeOnceAsync(
        function (successfulResult) {
            onRecognizedResult(successfulResult);
        },
        function (err) {
            window.console.log(err);
        });
}

async function saveSpeechToServer(data) {
    if (saveSpeechEndPoint) {
        try {
            const res = await fetch(saveSpeechEndPoint, data);
            const movies = await res.json();
            console.log('speech Saved sucessfullyy');
        } catch (err) {
            console.log(err);
        }
    }
}