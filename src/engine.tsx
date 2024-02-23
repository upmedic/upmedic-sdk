import report from './simulationData/report.json';
import template from './simulationData/template.json'



export enum SelectorType {
    CLASS='class',
    CONST_ID='const_id',
}
export enum NodeType {
    NUMBER = 'Number',
    PROPERTY = 'Property',
    CONCEPT = 'Concept',
    SECTION = 'Section',
    SUBSECTION = 'Subsection',
}

class _ExpertEngine
{
    private static _instance: _ExpertEngine;
    public registeredCalculations:Array<EngineCalculation> = [];
    public template:any;
    public report:any;
    
    private constructor()
    {
        this.report = report;
        this.template = template;
    }
    public static get Instance()
    {
        // Do you need arguments? Make it a regular static method instead.
        return this._instance || (this._instance = new this());
    }

    private getRoot(upmedicObject:any):any{
        return upmedicObject?.nodes.filter((n:any)=>n.parent === null)[0];
    }
    private shouldCalculate(calculation:EngineCalculation, templateCategory:string, templateDiscipline:string):boolean{
        const templateMetadataCheck =  (calculation.matchingSections.category === templateCategory || calculation.matchingSections.category==='*') && (calculation.matchingSections.discipline === templateDiscipline || calculation.matchingSections.discipline==='*');
        const canBeRun = this.canCalculationBeRun(calculation);
        return templateMetadataCheck&&canBeRun;
    }
    public execute(){
        console.info('STARTING CALCULATING')
        const templateRoot = this.getRoot(this.template)
        console.log(this.template);
        console.log(templateRoot);
        const templateCategory = templateRoot.data.category;
        const templateDiscipline = templateRoot.data.discipline;
        let functionsCount = 0;

        for (let i = 0; i < this.registeredCalculations.length; i++) {
            const calculation: EngineCalculation = this.registeredCalculations[i];
            if (this.shouldCalculate(calculation, templateCategory, templateDiscipline)){
                try {
                console.info(`start processing ${calculation.displayName}`)
                calculation.calculate();
                functionsCount++;
                }
                catch (ex){
                    console.info(`processing ${calculation.displayName} was interrupted by an error:`)
                    console.error(ex);
                }
                console.info(`end processing ${calculation.displayName}`)
            }
        }
        console.info(`Engine finished calculations. ${functionsCount} out of ${this.registeredCalculations.length} function applied!`)
    }

    public register = (calc: EngineCalculation) => {
            console.log(calc);
            console.log(`Registering function ${calc.displayName} for ${calc.matchingSections.category} ${calc.matchingSections.discipline}` )
            ExpertEngine.registeredCalculations.push(calc);
    };

    public getNodesByClass (className:string):Array<any>{
        return this.template['nodes'].filter((n:any)=>n.data['class'] === className);
    }


    public getNodeByConstId (id:string):any{
        const nodes = this.template['nodes'].filter((n:any)=>n.data['const_id'] === id);
        if (nodes.length === 0){
           throw new StopCalculationError(`Node with id ${id} does not exist in the template`)
        }
        if (nodes.length > 1 ){
            console.error("Trying to get more than 1 node with id "+id);
        }
        return nodes[0];
    }

    public setNumberNodeValue(id:string, value:number){
        this.getNodeByConstId(id);
        console.log(`setting number node ${id} to ${value}`);
    }

    public selectNodeWithId(id:string){
        console.log(`Selecting node with id ${id}`, this.getNodeByConstId(id));
        const node = this.getNodeByConstId(id);
        report.nodes.push(node);

    }
    
    public deselectNodeWithId(id:string){
        console.log(`Deselecting node with id ${id}`, this.getNodeByConstId(id));
    }

    public selectNodesWithClass(className: string){
            console.log(`Selecting node with class ${className}`, this.getNodesByClass(className));
    }

    public isNodeIdInReport(id:string):boolean {
        const nodes = this.report['nodes'].filter((n:any)=>n.data['const_id'] === id);
        if (nodes.length === 0){
            return false;
        }
        if (nodes.length > 1 ){
            console.error("Trying to get more than 1 node with id "+id);
            
        }
        return true;
    }

    
    public checkRequirementsForCalculation(calculation: EngineCalculation): Record<string, Record<string, boolean>> {
        let ret:Record<string, Record<string, boolean>> = {};
        for (let cIdx = 0; cIdx < calculation.nodeRequirements.length; cIdx++) {
            const requirement = calculation.nodeRequirements[cIdx];
            const requirementId = `${requirement.selector} ${requirement.nodeType} ${requirement.selectorType}`
            ret[requirementId]={};
            if (requirement.selectorType === SelectorType.CLASS){
                const nodes = this.getNodesByClass(requirement.selector)
                if (nodes.length > 0){
                    ret[requirementId][requirement.selector] = true;
                    let allNodesOk = true;
                    for (let nIdx = 0; nIdx < nodes.length; nIdx++) {
                        const node = nodes[nIdx];
                        const nodeType: keyof typeof NodeType = node.type;
                        if (requirement.nodeType !== NodeType[nodeType]){
                            allNodesOk =false;
                        }                            
                    }
                    ret[requirementId]['all nodes have correct type?'] = allNodesOk;                
                }
                else{
                    ret[requirementId]['was found?'] = false;
                }
                }
            else if (requirement.selectorType === SelectorType.CONST_ID){
                try {
                    const node =this.getNodeByConstId(requirement.selector);
                    ret[requirementId]['was found?'] = true;
                    ret[requirementId]['node has correct type?'] = requirement.nodeType.toString() === node.type;
                    }
                catch(ex){
                    ret[requirementId]['was found?'] = false;
                }
            }
            else {
                ret[requirementId]['valid selector type'] = false;
            }
        }
            return ret;
    }

    public canCalculationBeRun(calculation:EngineCalculation):boolean{
        return Object.values(this.checkRequirementsForCalculation(calculation)).every(
            val => Object.values(val).every(v=>v)
        )
    }

    
    public checkRequirements():Record<string, boolean> {
        let ret:Record<string, boolean>= {}
        for (let i = 0; i < this.registeredCalculations.length; i++) {
            const calculation = this.registeredCalculations[i];
            ret[calculation.displayName] = this.canCalculationBeRun(calculation);
        }
        return ret;
    }
}

class StopCalculationError extends Error {
    constructor(msg: string) {
        super(msg);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, StopCalculationError.prototype);
    }

    sayHello() {
        return "Calculation Stopped " + this.message;
    }
}

export interface EngineCalculation {
    displayName: string;
    description: string;
    matchingSections: MatchingSections;
    nodeRequirements: NodeRequirement[];
    calculate() :void;

}


interface MatchingSections {
    /** wildcard '*' allows to use calculation for all categories or disciplines */
    category: string;
    discipline: string;
    language: string;
}

export interface NodeRequirement {   
    selectorType: SelectorType;
    nodeType: NodeType;
    selector: string;
}


export const ExpertEngine = _ExpertEngine.Instance;




