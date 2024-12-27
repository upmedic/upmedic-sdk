import './App.css';
import { AssistedReportingContainer } from './AssistedReportingContainer';
import './knowledge/knowledgeBase';

function App() {
  return (
    <>
      <div className='App'>
        <h1>upmedic medical knowledge base engine simulator.</h1>
        <p>
          <a
            href='https://developer.chrome.com/docs/devtools/console/'
            target='blank'
          >
            Open devtools
          </a>{' '}
          console log to see results of analysis
        </p>
        <button onClick={(e) => AssistedReportingContainer.execute()}>
          RUN Assistance Plugins
        </button>
      </div>
      <div>
        <h2>Requirements status for the template and report:</h2>
        {JSON.stringify(AssistedReportingContainer.checkRequirements(), null, 2)}
        <h3>Debug info for requirements:</h3>
        <pre>
          {AssistedReportingContainer.registeredAssistancePlugins.map((c) =>
            JSON.stringify(
              AssistedReportingContainer.checkRequirementsForAssistancePlugins(c),
              null,
              2,
            ),
          )}
        </pre>
      </div>
      <div>
        <h2>Report (can be modified in simulationData/report.json)</h2>
        <pre>{JSON.stringify(AssistedReportingContainer.report.data, null, 2)}</pre>
      </div>
      <div>
        <h2>Template (can be modified in simulationData/template.json)</h2>
        <pre>
          {JSON.stringify(AssistedReportingContainer.template.data, null, 2)}
        </pre>
      </div>
    </>
  );
}

export default App;
