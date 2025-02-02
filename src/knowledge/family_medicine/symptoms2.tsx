import {
  AssistancePlugin,
  AssistedReportingContainer,
  NodeType,
  SelectorType,
} from '../../AssistedReportingContainer';

const symptoms2: AssistancePlugin = {
  displayName: 'POZ objawy',
  description: 'Obsługa objawów chorobowych dla upmedic',
  matchingSections: {
    disciplines: '*',
    categories: '*',
    languages: '*',
  },
  nodeRequirements: [
    {
      selectorType: SelectorType.CLASS,
      selector: 'pchn',
      nodeType: NodeType.PROPERTY,
    },
    {
      selectorType: SelectorType.CLASS,
      selector: 'cukrzyca',
      nodeType: NodeType.PROPERTY,
    },
    {
      selectorType: SelectorType.CLASS,
      selector: 'niedoczynność tarczycy',
      nodeType: NodeType.PROPERTY,
    },
  ],
  calculate: () => {
    //   const cukrzycaInTemplate = ExpertEngine.getNodesByClass('cukrzyca');
    //   const cukrzycaInReport = [];
    //   for (let i = 0; i < cukrzycaInTemplate.length; i++) {
    //     const cukrzycaSymptom = cukrzycaInTemplate[i];
    //     if (ExpertEngine.isNodeIdInReport(cukrzycaSymptom.data.const_id)) {
    //         cukrzycaInReport.push(cukrzycaSymptom);
    //     }
    //   }

    // const symptomsInTemplate = ExpertEngine.getNodesByClass('symptom');
    // const symptomsInReport = [];
    // for (let i = 0; i < symptomsInTemplate.length; i++) {
    //   const symptom = symptomsInTemplate[i];
    //   if (ExpertEngine.isNodeIdInReport(symptom.data.const_id)) {
    //     symptomsInReport.push(symptom);
    //   }
    // }

    if (AssistedReportingContainer.report.isNodeIdInReport('cukrzyca')) {
      AssistedReportingContainer.report.addToConclusions(
        'cukrzyca',
        'To jest objaw cukrzycy, wykonaj badania',
      );
    }
  },
};
AssistedReportingContainer.register(symptoms2);
