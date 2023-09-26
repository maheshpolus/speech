import './App.css';
import { speechService} from './service';
import { useEffect, useState } from "react";
import AudioRecorder from "./AudioRecorder";



function App() {
	const base = 'http://localhost:44322/';
	const [token, setToken] = useState();
	const [language, setLanguage] = useState(false);
	const [confidence, setConfidence] = useState(false);

	useEffect(() => {
		speechService.getLanguage(base)
			.then(res => setLanguage(res))
			.catch(e => console.error(e));
		speechService.requestAuthorizationToken(base)
			.then(lang => setToken(lang))
			.catch(e => console.error(e));
	}, []);

	function Status() {
		if(!confidence) {
			return null;
		} else if(confidence && confidence >= 70) {
			return <span>Great Job!</span>
		} else if(confidence && confidence < 70) {
			return <span>Please say it again.</span>
		}
	}


	return (
		<div className="container">
			 <AudioRecorder />
		</div>
	);
}

export default App;
