import { ExpertEngine } from "../../engine";


function calculateBMI (reportJson:any)  {
    const weight = ExpertEngine.getNodeByConstId('weight');
    const height = ExpertEngine.getNodeByConstId('height');

    console.log('calculating BMI and inserting it into target node in the template.')
    ExpertEngine.setNumberNodeValue('BMI', weight/(height*height));

}
ExpertEngine.register(calculateBMI, 'POZ', 'family medicine');

