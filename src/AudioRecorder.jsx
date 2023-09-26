import { useState, useRef, useEffect } from "react";
import Stopwatch from "./timer";


const mimeType = "audio/wav";

const AudioRecorder = () => {
	const [permission, setPermission] = useState(false);

	const mediaRecorder = useRef(null);

	const [recordingStatus, setRecordingStatus] = useState("inactive");

	const [stream, setStream] = useState(null);

	const [audio, setAudio] = useState(null);

	const [audioChunks, setAudioChunks] = useState([]);

	const [stopWatch, setStopWatch] = useState(false);

	const getMicrophonePermission = async () => {
		if ("MediaRecorder" in window) {
			try {
				const mediaStream = await navigator.mediaDevices.getUserMedia({
					audio: true,
					video: false,
				});
				setPermission(true);
				setStream(mediaStream);
			} catch (err) {
				alert(err.message);
			}
		} else {
			alert("The MediaRecorder API is not supported in your browser.");
		}
	};

	useEffect(() => {
		getMicrophonePermission();
	}, []);

	const startRecording = async () => {
		setRecordingStatus("recording");
		setStopWatch(true);
		const media = new MediaRecorder(stream, { type: mimeType });

		mediaRecorder.current = media;

		mediaRecorder.current.start();

		let localAudioChunks = [];

		mediaRecorder.current.ondataavailable = (event) => {
			if (typeof event.data === "undefined") return;
			if (event.data.size === 0) return;
			localAudioChunks.push(event.data);
		};

		setAudioChunks(localAudioChunks);
	};

	const stopRecording = () => {
		setRecordingStatus("inactive");
		setStopWatch(false);
		mediaRecorder.current.stop();

		mediaRecorder.current.onstop = () => {
			const audioBlob = new Blob(audioChunks, { type: mimeType });
			const audioUrl = URL.createObjectURL(audioBlob);
			setAudio(audioUrl);
			setAudioChunks([]);
		};
	};

	return (
		<div>
			<div className="card">
				<div className="text">
					<span>Hola, me llamo Jorge.</span>
				</div>
				<div>
					{permission && recordingStatus === "inactive" ? (
						<button onClick={startRecording} className="button slide start-button" id="scenarioStartButton">
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" id="microphone">
								<path d="M17 5h-2c0-.3 0-.5-.1-.7C14.6 2.9 13.4 2 12 2s-2.6.9-2.9 2.2c-.1.3-.1.5-.1.8H7c0-.5.1-.9.2-1.3C7.7 1.5 9.7 0 12 0s4.3 1.5 4.8 3.8c.1.3.2.7.2 1.2zm-5 11c-2.8 0-5-2.2-5-5h2c0 1.7 1.3 3 3 3s3-1.3 3-3h2c0 2.8-2.2 5-5 5z"></path>
								<path d="M9 5H7c0-.5.1-.9.2-1.3l1.9.5c-.1.3-.1.5-.1.8zm3 15c-5 0-9-4-9-9 0-.6.4-1 1-1s1 .4 1 1c0 3.9 3.1 7 7 7s7-3.1 7-7c0-.6.4-1 1-1s1 .4 1 1c0 5-4 9-9 9zm4 4H8c-.6 0-1-.4-1-1s.4-1 1-1h8c.6 0 1 .4 1 1s-.4 1-1 1z"></path>
								<path d="M12 24c-.6 0-1-.4-1-1v-4c0-.6.4-1 1-1s1 .4 1 1v4c0 .6-.4 1-1 1zM8 12c-.6 0-1-.4-1-1V5c0-.6.4-1 1-1s1 .4 1 1v6c0 .6-.4 1-1 1zm8 0c-.6 0-1-.4-1-1V5c0-.6.4-1 1-1s1 .4 1 1v6c0 .6-.4 1-1 1z"></path>
							</svg>
							<span className="ml">Tap to speak</span>
						</button>
					) : null}
					{recordingStatus === "recording" ? (
						<button onClick={stopRecording} className="button stop stop-button" id="scenarioStartButton">
							<svg  onClick={stopRecording} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" id="stop">
								<path d="M16 0C7.164 0 0 7.164 0 16s7.164 16 16 16 16-7.164 16-16S24.836 0 16 0zm0 30C8.28 30 2 23.72 2 16S8.28 2 16 2s14 6.28 14 14-6.28 14-14 14zm4-20h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2z"></path>
							</svg>
							<span className="ml">Stop</span>
						</button>
					) : null}
				</div>
				{recordingStatus === "recording" ? <Stopwatch start={stopWatch}/> : null }
			</div>
		</div>
	);
};

export default AudioRecorder;
