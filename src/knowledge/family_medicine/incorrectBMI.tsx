import {
  ExpertEngine,
  EngineCalculation,
  SelectorType,
  NodeType,
} from '../../engine';

const CalculateBMIIncorrectNodeId: EngineCalculation = {
  displayName: 'Incorrect BMI Calculator',
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
      selector: '#$#%#%$THIS NODE ID DOES NOT EXIST IN THE TEMPLATE',
    },
  ],
  calculate: () => {
    const weight = parseFloat(
      ExpertEngine.Template.getNodeByConstId('weight').data.text,
    );
    const height = parseFloat(
      ExpertEngine.Template.getNodeByConstId('height').data.text,
    );

    console.log(
      'calculating BMI and inserting it into target node in the template.',
    );
    ExpertEngine.Template.setNumberNodeValue('BMI', weight / (height * height));
  },
};

ExpertEngine.register(CalculateBMIIncorrectNodeId);
