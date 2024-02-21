import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ExpertEngine } from './engine';
import './knowledge/knowledgeBase' 

ExpertEngine.setTemplateJson({
  category: 'POZ', discipline:'family medicine', nodes:[]
});
function App() {
  return (
    <div className="App">
        <h1>
          upmedic medical knowledge base engine simulator.
        </h1>
        <p><a href='https://developer.chrome.com/docs/devtools/console/' target='blank'>Open devtools</a> console log to see results of analysis</p>
      <button onClick={(e)=>ExpertEngine.execute()}> RUN ANALYSIS</button>
    </div>
  );
}

export default App;
