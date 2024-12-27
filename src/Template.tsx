import { NodeSource } from './NodeSource';
import { ExpertEngine } from './engine';

export class Template extends NodeSource {
  public selectNodesWithClass(className: string) {
    console.log(
      `Selecting node with class ${className}`,
      this.getNodesByClass(className),
    );
  }
  public selectNodeWithId(id: string) {
    console.log(`Selecting node with id ${id}`, this.getNodeByConstId(id));
    const node = this.getNodeByConstId(id);
    ExpertEngine.report.data.nodes.push(node);
  }
}
