import { ExpertEngine } from "../../engine";


function calculateBMI (reportJson:any)  {
    const weight = parseFloat(ExpertEngine.getNodeByConstId('weight').data.text);
    const height = parseFloat(ExpertEngine.getNodeByConstId('height').data.text);

    console.log('calculating BMI and inserting it into target node in the template.')
    ExpertEngine.setNumberNodeValue('BMI', weight/(height*height));

}
ExpertEngine.register(calculateBMI, 'POZ', 'family medicine');

