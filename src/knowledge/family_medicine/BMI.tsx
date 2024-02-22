import { ExpertEngine, EngineCalculation, SelectorType, NodeType } from "../../engine";


const CorrectCalculateBMI: EngineCalculation = {
    displayName: 'BMI Calculator',
    description: 'BMI = weight [kg]/(height [m]^2)',
    matchingSections: { category: '*', discipline: '*', language: 'pl'},
    nodeRequirements: [{
        selectorType: SelectorType.CONST_ID,
        nodeType: NodeType.NUMBER,
        selector: 'weight'
    },
    {
        selectorType: SelectorType.CONST_ID,
        nodeType: NodeType.NUMBER,
        selector: 'height'
    },
    {
        selectorType: SelectorType.CONST_ID,
        nodeType: NodeType.NUMBER,
        selector: 'BMI'
    }
], 
    calculate: () => {
        const weight = parseFloat(ExpertEngine.getNodeByConstId('weight').data.text);
        const height = parseFloat(ExpertEngine.getNodeByConstId('height').data.text);
    
        console.log('correct calculating BMI and inserting it into target node in the template.')
        ExpertEngine.setNumberNodeValue('BMI', weight/(height*height));
        ExpertEngine.selectNodeWithId('BMI');
    }
}

ExpertEngine.register(CorrectCalculateBMI);


