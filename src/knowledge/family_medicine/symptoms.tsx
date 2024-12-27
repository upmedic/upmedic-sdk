import {
  AssistancePlugin,
  AssistedReportingContainer,
  NodeType,
  SelectorType,
} from '../../AssistedReportingContainer';

const symptoms: AssistancePlugin = {
  displayName: 'POZ symptoms',
  description: 'Obsługa objawów chorobowych dla upmedic',
  matchingSections: {
    disciplines: '*',
    categories: '*',
    languages: '*',
  },
  nodeRequirements: [
    {
      selectorType: SelectorType.CONST_ID,
      selector: 'sleepiness',
      nodeType: NodeType.PROPERTY,
    },
  ],
  calculate: () => {
    // const symptomsInTemplate = ExpertEngine.getNodesByClass('symptom');
    // const symptomsInReport = [];
    // for (let i = 0; i < symptomsInTemplate.length; i++) {
    //   const symptom = symptomsInTemplate[i];
    //   if (ExpertEngine.isNodeIdInReport(symptom.data.const_id)) {
    //     symptomsInReport.push(symptom);
    //   }
    // }

    if (AssistedReportingContainer.report.isNodeIdInReport('sleepiness')) {
      AssistedReportingContainer.report.addToConclusions(
        'sleepiness',
        'This will add some conclusion related to sleepines',
      );
    }
  },
};
AssistedReportingContainer.register(symptoms);
