import {
  ExpertEngine,
  EngineCalculation,
  SelectorType,
  NodeType,
} from '../../engine';

const CorrectCalculateBMI: EngineCalculation = {
  displayName: 'BMI Calculator',
  description: 'BMI = weight [kg]/(height [m]^2)',
  matchingSections: { categories: '*', disciplines: '*', languages: ['pl'] },
  nodeRequirements: [
    {
      selectorType: SelectorType.CONST_ID,
      nodeType: NodeType.NUMBER,
      selector: 'weight',
    },
    {
      selectorType: SelectorType.CONST_ID,
      nodeType: NodeType.NUMBER,
      selector: 'height',
    },
    {
      selectorType: SelectorType.CONST_ID,
      nodeType: NodeType.NUMBER,
      selector: 'BMI',
    },
  ],
  calculate: () => {
    const weight = parseFloat(
      ExpertEngine.template.getNodeByConstId('weight').data.text,
    );
    const height = parseFloat(
      ExpertEngine.template.getNodeByConstId('height').data.text,
    );

    console.log(
      'correct calculating BMI and inserting it into target node in the template.',
    );
    ExpertEngine.template.setNumberNodeValue('BMI', weight / (height * height));
    ExpertEngine.template.selectNodeWithId('BMI');
  },
};

ExpertEngine.register(CorrectCalculateBMI);
