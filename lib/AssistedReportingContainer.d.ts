import { Report } from './Report';
import { Template } from './Template';
export declare enum SelectorType {
    CLASS = "class",
    CONST_ID = "const_id"
}
export declare enum NodeType {
    NUMBER = "Number",
    PROPERTY = "Property",
    CONCEPT = "Concept",
    SECTION = "Section",
    SUBSECTION = "Subsection"
}
declare class _AssistedReportingContainer {
    report: Report;
    template: Template;
    private static _instance;
    registeredAssistancePlugins: Array<AssistancePlugin>;
    private constructor();
    static get Instance(): _AssistedReportingContainer;
    private shouldExecute;
    execute(): void;
    register: (calc: AssistancePlugin) => void;
    checkRequirementsForAssistancePlugins(assistancePlugin: AssistancePlugin): Record<string, Record<string, boolean>>;
    areAssistancePluginsRequirementsSatisfiedByTemplate(assistancePlugin: AssistancePlugin): boolean;
    checkRequirements(): Record<string, boolean>;
}
export declare class StopAssistancePluginError extends Error {
    constructor(msg: string);
    sayHello(): string;
}
export interface AssistancePlugin {
    displayName: string;
    description: string;
    matchingSections: MatchingSections;
    nodeRequirements: NodeRequirement[];
    calculate(): void;
}
interface MatchingSections {
    /** wildcard '*' allows to use AssistancePlugin for all categories or disciplines */
    categories: '*' | string[];
    disciplines: '*' | string[];
    languages: '*' | string[];
}
export interface NodeRequirement {
    selectorType: SelectorType;
    nodeType: NodeType;
    selector: string;
}
export declare const AssistedReportingContainer: _AssistedReportingContainer;
export {};
