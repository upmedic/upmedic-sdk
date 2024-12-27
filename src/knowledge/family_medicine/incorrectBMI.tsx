import {
  AssistedReportingContainer,
  AssistancePlugin,
  SelectorType,
  NodeType,
} from '../../AssistedReportingContainer';

const CalculateBMIIncorrectNodeId: AssistancePlugin = {
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
      AssistedReportingContainer.template.getNodeByConstId('weight').data.text,
    );
    const height = parseFloat(
      AssistedReportingContainer.template.getNodeByConstId('height').data.text,
    );

    console.log(
      'calculating BMI and inserting it into target node in the template.',
    );
    AssistedReportingContainer.template.setNumberNodeValue('BMI', weight / (height * height));
  },
};

AssistedReportingContainer.register(CalculateBMIIncorrectNodeId);
