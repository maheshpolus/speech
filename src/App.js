import './App.css';

function App() {

  const shoot = () => {
    window.doPronunciationAssessmentOnceAsync()
  }
  return (
    <div className="container">
      <div className="card">
      <span className="text">Hola, me llamo Jorge.</span>
      <div> 
        <button className="button slide" id='scenarioStartButton' onClick={shoot}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" id="microphone">
          <path d="M17 5h-2c0-.3 0-.5-.1-.7C14.6 2.9 13.4 2 12 2s-2.6.9-2.9 2.2c-.1.3-.1.5-.1.8H7c0-.5.1-.9.2-1.3C7.7 1.5 9.7 0 12 0s4.3 1.5 4.8 3.8c.1.3.2.7.2 1.2zm-5 11c-2.8 0-5-2.2-5-5h2c0 1.7 1.3 3 3 3s3-1.3 3-3h2c0 2.8-2.2 5-5 5z"></path>
          <path d="M9 5H7c0-.5.1-.9.2-1.3l1.9.5c-.1.3-.1.5-.1.8zm3 15c-5 0-9-4-9-9 0-.6.4-1 1-1s1 .4 1 1c0 3.9 3.1 7 7 7s7-3.1 7-7c0-.6.4-1 1-1s1 .4 1 1c0 5-4 9-9 9zm4 4H8c-.6 0-1-.4-1-1s.4-1 1-1h8c.6 0 1 .4 1 1s-.4 1-1 1z"></path>
          <path d="M12 24c-.6 0-1-.4-1-1v-4c0-.6.4-1 1-1s1 .4 1 1v4c0 .6-.4 1-1 1zM8 12c-.6 0-1-.4-1-1V5c0-.6.4-1 1-1s1 .4 1 1v6c0 .6-.4 1-1 1zm8 0c-.6 0-1-.4-1-1V5c0-.6.4-1 1-1s1 .4 1 1v6c0 .6-.4 1-1 1z"></path>
        </svg>
        <span >Tap to speak</span>
        </button>
      </div>
      </div>
    </div>
  );
}

export default App;
