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

class _AssistedReportingContainer {
  report: Report;
  template: Template;

  private static _instance: _AssistedReportingContainer;
  public registeredAssistancePlugins: Array<AssistancePlugin> = [];

  private constructor() {
    this.report = new Report(report);
    this.template = new Template(template);
  }

  public static get Instance() {
    // Do you need arguments? Make it a regular static method instead.
    return this._instance || (this._instance = new this());
  }
  private shouldExecute(assistancePlugin: AssistancePlugin): boolean {
    const templateRoot = this.template.getRoot();
    const templateLanguagesSet = new Set(this.template.data.languages);

    const isCategoryOk =
      assistancePlugin.matchingSections.categories === '*' ||
      assistancePlugin.matchingSections.categories.includes(
        templateRoot.data.category,
      );
    const isDisciplineOk =
      assistancePlugin.matchingSections.disciplines === '*' ||
      assistancePlugin.matchingSections.disciplines.includes(
        templateRoot.data.discipline,
      );
    const isLanguageOk =
      assistancePlugin.matchingSections.languages === '*' ||
      assistancePlugin.matchingSections.languages.some((l: string) =>
        templateLanguagesSet.has(l),
      );
    const isMetadataOk = isCategoryOk && isDisciplineOk && isLanguageOk;

    const areTemplateRequirementsOk =
      this.areAssistancePluginsRequirementsSatisfiedByTemplate(assistancePlugin);
    const willBeRun = isMetadataOk && areTemplateRequirementsOk;
    if (!willBeRun) {
      console.info(
        `"${assistancePlugin.displayName}" will not be executed. Languages matching: ${isLanguageOk}, category: ${isCategoryOk}, discipline ${isDisciplineOk}, template requirements: ${areTemplateRequirementsOk}`,
      );
    }

    return willBeRun;
  }
  public execute() {
    console.info('STARTING CALCULATING');

    let functionsCount = 0;

    for (let i = 0; i < this.registeredAssistancePlugins.length; i++) {
      const assistancePlugin: AssistancePlugin = this.registeredAssistancePlugins[i];
      if (this.shouldExecute(assistancePlugin)) {
        try {
          console.info(`start processing ${assistancePlugin.displayName}`);
          assistancePlugin.calculate();
          functionsCount++;
        } catch (ex) {
          console.info(
            `processing ${assistancePlugin.displayName} was interrupted by an error:`,
          );
          console.error(ex);
        }
        console.info(`end processing ${assistancePlugin.displayName}`);
      }
    }
    console.info(
      `Engine finished AssistancePlugin execution. ${functionsCount} out of ${this.registeredAssistancePlugins.length} function applied!`,
    );
  }

  public register = (calc: AssistancePlugin) => {
    console.log(calc);
    console.log(
      `Registering function ${calc.displayName} for ${calc.matchingSections.categories} ${calc.matchingSections.disciplines}`,
    );
    AssistedReportingContainer.registeredAssistancePlugins.push(calc);
  };

  public checkRequirementsForAssistancePlugins(
    assistancePlugin: AssistancePlugin,
  ): Record<string, Record<string, boolean>> {
    let ret: Record<string, Record<string, boolean>> = {};
    for (let cIdx = 0; cIdx < assistancePlugin.nodeRequirements.length; cIdx++) {
      const requirement = assistancePlugin.nodeRequirements[cIdx];
      const requirementId = `${requirement.selector} ${requirement.nodeType} ${requirement.selectorType}`;
      ret[requirementId] = {};
      if (requirement.selectorType === SelectorType.CLASS) {
        const nodes = this.template.getNodesByClass(requirement.selector);
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
          const node = this.template.getNodeByConstId(requirement.selector);
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

  public areAssistancePluginsRequirementsSatisfiedByTemplate(
    assistancePlugin: AssistancePlugin,
  ): boolean {
    return Object.values(
      this.checkRequirementsForAssistancePlugins(assistancePlugin),
    ).every((val) => Object.values(val).every((v) => v));
  }

  public checkRequirements(): Record<string, boolean> {
    let ret: Record<string, boolean> = {};
    for (let i = 0; i < this.registeredAssistancePlugins.length; i++) {
      const assistancePlugin = this.registeredAssistancePlugins[i];
      ret[assistancePlugin.displayName] =
        this.areAssistancePluginsRequirementsSatisfiedByTemplate(assistancePlugin);
    }
    return ret;
  }
}

export class StopAssistancePluginError extends Error {
  constructor(msg: string) {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, StopAssistancePluginError.prototype);
  }

  sayHello() {
    return 'AssistancePlugin Stopped ' + this.message;
  }
}

export interface AssistancePlugin {
  displayName: string;
  description: string;
  matchingSections: MatchingSections;
  nodeRequirements: NodeRequirement[];
  calculate(): void;
}

export interface MatchingSections {
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

export const AssistedReportingContainer = _AssistedReportingContainer.Instance;
