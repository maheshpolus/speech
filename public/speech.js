let SpeechSDK;
let authorizationToken = 'eyJhbGciOiJFUzI1NiIsImtpZCI6ImtleTEiLCJ0eXAiOiJKV1QifQ.eyJyZWdpb24iOiJjZW50cmFsaW5kaWEiLCJzdWJzY3JpcHRpb24taWQiOiJmMDg3MWNjMTQ3MzQ0MTJhODYwYmEwNDhkMWVmNjVhYSIsInByb2R1Y3QtaWQiOiJTcGVlY2hTZXJ2aWNlcy5GMCIsImNvZ25pdGl2ZS1zZXJ2aWNlcy1lbmRwb2ludCI6Imh0dHBzOi8vYXBpLmNvZ25pdGl2ZS5taWNyb3NvZnQuY29tL2ludGVybmFsL3YxLjAvIiwiYXp1cmUtcmVzb3VyY2UtaWQiOiIvc3Vic2NyaXB0aW9ucy9hMmMzZmM4Ny1hZTUyLTRhMDUtODU4Yy02NGMwZTI1NWNkZmIvcmVzb3VyY2VHcm91cHMvc3BlZWNoL3Byb3ZpZGVycy9NaWNyb3NvZnQuQ29nbml0aXZlU2VydmljZXMvYWNjb3VudHMvc3BlZWNoLXRvLXRleHQtZWR1Iiwic2NvcGUiOiJzcGVlY2hzZXJ2aWNlcyIsImF1ZCI6InVybjptcy5zcGVlY2hzZXJ2aWNlcy5jZW50cmFsaW5kaWEiLCJleHAiOjE2OTI2MzMzNjQsImlzcyI6InVybjptcy5jb2duaXRpdmVzZXJ2aWNlcyJ9.MpH9s6F5VyCpwAYb5ny9RhVQfp5Ry0N15EMzoUY9wCuPdR6m1-XfE1m8InNe88Lahx7TMnjnxjLMhGG4hUrjfw';
let regionOptions = 'centralindia';
let languageOptions = 'es-ES'; 
let reco;
let referenceText = 'Hola, me llamo Jorge';
let authorizationEndpoint = 'Speech/GetAuthorizationKey';
let saveSpeechEndPoint = 'Speech/SaveSpeech';
let lanugaeEndPoint = 'Speech/GetLanguage'
let soundContext;

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
        const res = await fetch (lanugaeEndPoint);
        const token = await res.json();
        console.log('Token fetched from back-end: ' + token);
    } catch (err) {
        console.log(err);
    }
}

function Initialize(onComplete) {
    if (window.SpeechSDK) {
        onComplete(window.SpeechSDK);
    }
}
try {
    let AudioContext = window.AudioContext // our preferred impl
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
    let pronunciationAssessmentConfig = new SpeechSDK.PronunciationAssessmentConfig(referenceText,
        SpeechSDK.PronunciationAssessmentGradingSystem.HundredMark,
        SpeechSDK.PronunciationAssessmentGranularity.Word, true);
    return pronunciationAssessmentConfig;
}

function onRecognizing(sender, recognitionEventArgs) {
   // for getting inbetween results
}

function onRecognized(sender, recognitionEventArgs) {
    let result = recognitionEventArgs.result;
    onRecognizedResult(result);
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
    let audioConfig = getAudioConfig();
    let speechConfig = getSpeechConfig(SpeechSDK.SpeechConfig);
    let pronunciationAssessmentConfig = getPronunciationAssessmentConfig();
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
            const res = await fetch(saveSpeechEndPoint, {
                method: 'POST',
                body: JSON.stringify(data) 
            });
            const response = await res.json();
            console.log(response);
        } catch (err) {
            console.log(err);
        }
    }
}