import {
  EngineCalculation,
  ExpertEngine,
  NodeType,
  SelectorType,
} from '../../engine';

const symptoms: EngineCalculation = {
  displayName: 'POZ objawy',
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

    if (ExpertEngine.isNodeIdInReport('sleepiness')) {
      ExpertEngine.addToConclusions(
        'sleepiness',
        'This will add some conclusion related to sleepines',
      );
    }
  },
};
ExpertEngine.register(symptoms);
