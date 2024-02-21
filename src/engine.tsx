
class _ExpertEngine
{
    private static _instance: _ExpertEngine;
    public registeredFunctions:Array<EngineFunction> = [];
    public templateJson:any;
    private constructor()
    {
    }
    public static get Instance()
    {
        // Do you need arguments? Make it a regular static method instead.
        return this._instance || (this._instance = new this());
    }

    public execute(){
        console.info('STARTING CALCULATING')
        const templateCategory = this.templateJson['category'];
        const templateDiscipline = this.templateJson['discipline'];
        let functionsCount = 0;

        for (let i = 0; i < this.registeredFunctions.length; i++) {
            const element: EngineFunction = this.registeredFunctions[i];
            if ((element.category === templateCategory || element.category==='*') && (element.discipline === templateDiscipline || element.discipline==='*'))
            element.func(this.templateJson);
            functionsCount++;
        }
        console.info(`Engine finished calculations. ${functionsCount} out of ${this.registeredFunctions.length} function applied!`)
    }

    public setTemplateJson(templateJson:any){
        this.templateJson = templateJson;
    }

    public register = (func:Function, category: string, discipline: string='radiology') => {
            console.log(`registering function ${func.name} for ${discipline} ${category}` )
            ExpertEngine.registeredFunctions.push(new EngineFunction(func, category, discipline));
    };

    public getNodesByClass (className:string):Array<any>{
        return this.templateJson['nodes'].filter((n:any)=>n.data['class'] === className);
    }


    public getNodeByConstId (id:string):any{
        const nodes = this.templateJson['nodes'].filter((n:any)=>n.data['const_id'] === id);
        if (nodes.length === 0){
            return null;
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

    }
    public deselectNodeWithId(id:string){
        console.log(`Deselecting node with id ${id}`, this.getNodeByConstId(id));
    }

    public selectNodesWithClass(className: string){
            console.log(`Selecting node with class ${className}`, this.getNodesByClass(className));
        }

}

class EngineFunction {
    public func;
    public category: string;
    public discipline: string;
    public constructor(func:Function, modality:string, discipline:string){
        this.func = func;
        this.category = modality;
        this.discipline = discipline;
    }
    
}

export const ExpertEngine = _ExpertEngine.Instance;




