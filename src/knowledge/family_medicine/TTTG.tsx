import {
  EngineCalculation,
  ExpertEngine,
  NodeType,
  SelectorType,
} from '../../engine';

const TTTG: EngineCalculation = {
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
    const tttg = parseFloat(ExpertEngine.getNodeByConstId('TT-TG'));
    if (tttg <= 15) {
      // do nothing, we focus only on abnormal
    } else if (tttg > 15 && tttg <= 20) {
      ExpertEngine.addToConclusions('TT-TG', `TT-TG: borderline`);
    } else {
      ExpertEngine.addToConclusions('TT-TG', `TT-TG: abnormal`);
    }
  },
};
ExpertEngine.register(TTTG);