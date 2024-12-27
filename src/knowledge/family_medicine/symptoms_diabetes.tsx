import {
  AssistancePlugin,
  AssistedReportingContainer,
  NodeType,
  SelectorType,
} from '../../AssistedReportingContainer';

const symptoms2: AssistancePlugin = {
  displayName: 'POZ objawy cukrzycy',
  description: 'Obsługa objawów chorobowych dla cukrzycy',
  matchingSections: {
    disciplines: '*',
    categories: '*',
    languages: '*',
  },
  nodeRequirements: [
    // {
    //   selectorType: SelectorType.CLASS,
    //   selector: 'pchn',
    //   nodeType: NodeType.PROPERTY,
    // },
    {
      selectorType: SelectorType.CLASS,
      selector: 'cukrzyca',
      nodeType: NodeType.PROPERTY,
    },
    {
      selectorType: SelectorType.CONST_ID,
      nodeType: NodeType.NUMBER,
      selector: 'glucose_blood',
    },
  ],
  calculate: () => {
    const symptomsInTemplate = AssistedReportingContainer.template.getNodesByClass('cukrzyca');
    const symptomsInReport = [];
    for (let i = 0; i < symptomsInTemplate.length; i++) {
      const symptom = symptomsInTemplate[i];
      if (AssistedReportingContainer.report.isNodeIdInReport(symptom.data.const_id)) {
        symptomsInReport.push(symptom);
      }
    }
    AssistedReportingContainer.report.addToConclusions(
      'liczba objawów cukrzycy to ',
      symptomsInReport.length.toString(),
    );
    const glucose_blood = parseFloat(
      AssistedReportingContainer.report.getNodeByConstId('glucose_blood').data.text,
    );
    if (glucose_blood > 70 && glucose_blood <= 100) {
      // do nothing, we focus only on abnormal
    } else if (glucose_blood < 70) {
      AssistedReportingContainer.report.addToConclusions('hipoglikemia', glucose_blood.toString());
    } else {
      AssistedReportingContainer.report.addToConclusions(
        'hiperglikemia, rozważ dalsze badania',
        glucose_blood.toString(),
      );
    }
  },
};
AssistedReportingContainer.register(symptoms2);
