let SpeechSDK;
let record;
let referenceText = 'Hola, me llamo Jorge';

function Initialize(onComplete) {
    if (window.SpeechSDK) {
        onComplete(window.SpeechSDK);
    }
}
document.addEventListener("DOMContentLoaded", function () {
    Initialize(async function (speechSdk) {
        SpeechSDK = speechSdk;
    });
});

function getAudioConfig() {
    return SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
}

function getSpeechConfig(sdkConfigType, authorizationToken, language) {
    let speechConfig;
    speechConfig = sdkConfigType.fromAuthorizationToken(authorizationToken, 'centralindia');
    speechConfig.outputFormat = SpeechSDK.OutputFormat.Detailed;
    speechConfig.speechRecognitionLanguage = language;
    return speechConfig;
}

function getPronunciationAssessmentConfig() {
    let pronunciationAssessmentConfig = new SpeechSDK.PronunciationAssessmentConfig(referenceText,
        SpeechSDK.PronunciationAssessmentGradingSystem.HundredMark,
        SpeechSDK.PronunciationAssessmentGranularity.Word, true);
    return pronunciationAssessmentConfig;
}

function applyCommonConfigurationTo(recognizer) {
    recognizer.recognizing = (sender, recognitionEventArgs) => { console.log(recognitionEventArgs)};;
    recognizer.recognized = (sender, recognitionEventArgs)=> { console.log(recognitionEventArgs)};
    recognizer.canceled = (sender, cancellationEventArgs) => { console.log(cancellationEventArgs)};
    recognizer.sessionStarted = (sender, sessionEventArgs) => { console.log(sessionEventArgs.sessionId)};
    recognizer.sessionStopped = (sender, sessionEventArgs) => { console.log(sessionEventArgs)};
}

function doPronunciationAssessmentOnceAsync(authorizationToken, language) {
    return new Promise((resolve, reject) => {
        let audioConfig = getAudioConfig();
        let speechConfig = getSpeechConfig(SpeechSDK.SpeechConfig, authorizationToken, language);
        let pronunciationAssessmentConfig = getPronunciationAssessmentConfig();
        if (!audioConfig || !speechConfig || !pronunciationAssessmentConfig) return;
        record = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
        applyCommonConfigurationTo(record);
        pronunciationAssessmentConfig.applyTo(record);
        record.recognized = undefined;
        record.recognizeOnceAsync(
             (successfulResult) => resolve(successfulResult) ,
             (err) => reject(err)
        );
    });
}

