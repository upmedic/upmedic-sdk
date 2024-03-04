import { StopCalculationError } from './engine';

export class NodeSource {
  data: any;
  constructor(data: any) {
    this.data = data;
  }
  getRoot() {
    return this.data.nodes.filter((n: any) => n.parent === null)[0];
  }

  public setNumberNodeValue(id: string, value: number) {
    this.getNodeByConstId(id);
    console.log(`setting number node ${id} to ${value}`);
  }

  public getNodesByClass(className: string): Array<any> {
    return this.data['nodes'].filter((n: any) =>
      n.data['classes']?.includes(className),
    );
  }

  public getNodeByConstId(id: string): any {
    const nodes = this.data['nodes'].filter((n: any) => n.data['const_id'] === id);
    if (nodes.length === 0) {
      throw new StopCalculationError(
        `Node with id ${id} does not exist in this NodeSource`,
      );
    }
    if (nodes.length > 1) {
      console.error('Trying to get more than 1 node with id ' + id);
    }
    return nodes[0];
  }
}
