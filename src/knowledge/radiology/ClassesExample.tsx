import {
  EngineCalculation,
  ExpertEngine,
  NodeType,
  SelectorType,
} from '../../engine';

const TECHNIQUE_CLASS_NAME = 'technique';

const ClassesExample: EngineCalculation = {
  displayName: 'Classes example',
  description: 'Tests selectors for classes',
  matchingSections: {
    disciplines: '*',
    categories: '*',
    languages: '*',
  },
  nodeRequirements: [
    {
      selectorType: SelectorType.CLASS,
      selector: TECHNIQUE_CLASS_NAME,
      nodeType: NodeType.PROPERTY,
    },
  ],
  calculate: () => {
    const templateTechniqueNodes =
      ExpertEngine.Template.getNodesByClass(TECHNIQUE_CLASS_NAME);
    if (templateTechniqueNodes.length === 1) {
      ExpertEngine.Report.addToConclusions(
        templateTechniqueNodes[0].data.const_id,
        `This conclusion is added when template has a node with ${TECHNIQUE_CLASS_NAME} class`,
      );
    } else {
      console.error(
        `There should be only one node in the template with ${TECHNIQUE_CLASS_NAME} class`,
      );
    }
    const reportTechnniqueNodes =
      ExpertEngine.Report.getNodesByClass(TECHNIQUE_CLASS_NAME);
  },
};
ExpertEngine.register(ClassesExample);
