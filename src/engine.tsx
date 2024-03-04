import { Report } from './Report';
import { Template } from './Template';
import report from './simulationData/report.json';
import template from './simulationData/template.json';

export enum SelectorType {
  CLASS = 'class',
  CONST_ID = 'const_id',
}
export enum NodeType {
  NUMBER = 'Number',
  PROPERTY = 'Property',
  CONCEPT = 'Concept',
  SECTION = 'Section',
  SUBSECTION = 'Subsection',
}

class _ExpertEngine {
  Report: Report;
  Template: Template;

  private static _instance: _ExpertEngine;
  public registeredCalculations: Array<EngineCalculation> = [];

  private constructor() {
    this.Report = new Report(report);
    this.Template = new Template(template);
  }

  public static get Instance() {
    // Do you need arguments? Make it a regular static method instead.
    return this._instance || (this._instance = new this());
  }
  private shouldCalculate(calculation: EngineCalculation): boolean {
    const templateRoot = this.Template.getRoot();
    const templateLanguagesSet = new Set(this.Template.data.languages);

    const isCategoryOk =
      calculation.matchingSections.categories === '*' ||
      calculation.matchingSections.categories.includes(templateRoot.data.category);
    const isDisciplineOk =
      calculation.matchingSections.disciplines === '*' ||
      calculation.matchingSections.disciplines.includes(
        templateRoot.data.discipline,
      );
    const isLanguageOk =
      calculation.matchingSections.languages === '*' ||
      calculation.matchingSections.languages.some((l: string) =>
        templateLanguagesSet.has(l),
      );
    const isMetadataOk = isCategoryOk && isDisciplineOk && isLanguageOk;

    const areTemplateRequirementsOk =
      this.areCalculationRequirementsSatisfiedByTemplate(calculation);
    const willBeRun = isMetadataOk && areTemplateRequirementsOk;
    if (!willBeRun) {
      console.info(
        `"${calculation.displayName}" will not be executed. Languages matching: ${isLanguageOk}, category: ${isCategoryOk}, discipline ${isDisciplineOk}, template requirements: ${areTemplateRequirementsOk}`,
      );
    }

    return willBeRun;
  }
  public execute() {
    console.info('STARTING CALCULATING');

    let functionsCount = 0;

    for (let i = 0; i < this.registeredCalculations.length; i++) {
      const calculation: EngineCalculation = this.registeredCalculations[i];
      if (this.shouldCalculate(calculation)) {
        try {
          console.info(`start processing ${calculation.displayName}`);
          calculation.calculate();
          functionsCount++;
        } catch (ex) {
          console.info(
            `processing ${calculation.displayName} was interrupted by an error:`,
          );
          console.error(ex);
        }
        console.info(`end processing ${calculation.displayName}`);
      }
    }
    console.info(
      `Engine finished calculations. ${functionsCount} out of ${this.registeredCalculations.length} function applied!`,
    );
  }

  public register = (calc: EngineCalculation) => {
    console.log(calc);
    console.log(
      `Registering function ${calc.displayName} for ${calc.matchingSections.categories} ${calc.matchingSections.disciplines}`,
    );
    ExpertEngine.registeredCalculations.push(calc);
  };

  public checkRequirementsForCalculation(
    calculation: EngineCalculation,
  ): Record<string, Record<string, boolean>> {
    let ret: Record<string, Record<string, boolean>> = {};
    for (let cIdx = 0; cIdx < calculation.nodeRequirements.length; cIdx++) {
      const requirement = calculation.nodeRequirements[cIdx];
      const requirementId = `${requirement.selector} ${requirement.nodeType} ${requirement.selectorType}`;
      ret[requirementId] = {};
      if (requirement.selectorType === SelectorType.CLASS) {
        const nodes = this.Template.getNodesByClass(requirement.selector);
        if (nodes.length > 0) {
          ret[requirementId][requirement.selector] = true;
          let allNodesOk = true;
          for (let nIdx = 0; nIdx < nodes.length; nIdx++) {
            const node = nodes[nIdx];
            if (requirement.nodeType.toString() !== node.type) {
              allNodesOk = false;
            }
          }
          ret[requirementId]['all nodes have correct type?'] = allNodesOk;
        } else {
          ret[requirementId]['was found?'] = false;
        }
      } else if (requirement.selectorType === SelectorType.CONST_ID) {
        try {
          const node = this.Template.getNodeByConstId(requirement.selector);
          ret[requirementId]['was found?'] = true;
          ret[requirementId]['node has correct type?'] =
            requirement.nodeType.toString() === node.type;
        } catch (ex) {
          ret[requirementId]['was found?'] = false;
        }
      } else {
        ret[requirementId]['valid selector type'] = false;
      }
    }
    return ret;
  }

  public areCalculationRequirementsSatisfiedByTemplate(
    calculation: EngineCalculation,
  ): boolean {
    return Object.values(this.checkRequirementsForCalculation(calculation)).every(
      (val) => Object.values(val).every((v) => v),
    );
  }

  public checkRequirements(): Record<string, boolean> {
    let ret: Record<string, boolean> = {};
    for (let i = 0; i < this.registeredCalculations.length; i++) {
      const calculation = this.registeredCalculations[i];
      ret[calculation.displayName] =
        this.areCalculationRequirementsSatisfiedByTemplate(calculation);
    }
    return ret;
  }
}

export class StopCalculationError extends Error {
  constructor(msg: string) {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, StopCalculationError.prototype);
  }

  sayHello() {
    return 'Calculation Stopped ' + this.message;
  }
}

export interface EngineCalculation {
  displayName: string;
  description: string;
  matchingSections: MatchingSections;
  nodeRequirements: NodeRequirement[];
  calculate(): void;
}

interface MatchingSections {
  /** wildcard '*' allows to use calculation for all categories or disciplines */
  categories: '*' | string[];
  disciplines: '*' | string[];
  languages: '*' | string[];
}

export interface NodeRequirement {
  selectorType: SelectorType;
  nodeType: NodeType;
  selector: string;
}

export const ExpertEngine = _ExpertEngine.Instance;
