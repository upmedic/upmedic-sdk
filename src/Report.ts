import { NodeSource } from './NodeSource';

export class Report extends NodeSource {
  addToConclusions(sourceNodeId: string, conclusionText: string): void {
    console.log(
      `Node id: "${sourceNodeId}" adds to conclusions "${conclusionText}"`,
    );
  }

  public deselectNodeWithId(id: string) {
    console.log(`Deselecting node with id ${id}`, this.getNodeByConstId(id));
  }

  public isNodeIdInReport(id: string): boolean {
    const nodes = this.data['nodes'].filter((n: any) => n.data['const_id'] === id);
    if (nodes.length === 0) {
      return false;
    }
    if (nodes.length > 1) {
      console.error('Trying to get more than 1 node with id ' + id);
    }
    return true;
  }
}
