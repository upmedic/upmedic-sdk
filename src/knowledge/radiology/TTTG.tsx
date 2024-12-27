import {
  AssistancePlugin,
  AssistedReportingContainer,
  NodeType,
  SelectorType,
} from '../../AssistedReportingContainer';

const TTTG: AssistancePlugin = {
  displayName: 'TT-TG',
  description: 'Tibial tuberosity to trochlear groove (TT-TG) distance',
  matchingSections: {
    disciplines: '*',
    categories: '*',
    languages: '*',
  },
  nodeRequirements: [
    {
      selectorType: SelectorType.CONST_ID,
      selector: 'TT-TG',
      nodeType: NodeType.NUMBER,
    },
  ],
  calculate: () => {
    const tttg = parseFloat(AssistedReportingContainer.template.getNodeByConstId('TT-TG'));
    if (tttg <= 15) {
      // do nothing, we focus only on abnormal
    } else if (tttg > 15 && tttg <= 20) {
      AssistedReportingContainer.report.addToConclusions('TT-TG', `TT-TG: borderline`);
    } else {
      AssistedReportingContainer.report.addToConclusions('TT-TG', `TT-TG: abnormal`);
    }
  },
};
AssistedReportingContainer.register(TTTG);
