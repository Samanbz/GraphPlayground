import { GraphEdge, GraphNode } from "@models/index";

/**
 * Singleton class that represents the canvas element.
 * Responsible for rendering all nodes and edges.
 * Passed to all nodes and edges to allow them to render themselves.
 */
export class GraphCanvas {
  private canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;

  private nodes: GraphNode[];
  private edges: GraphEdge[];

  private selectedNode: GraphNode | undefined;
  private nodeMovementAllowed: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;

    this.nodes = [];
    this.edges = [];

    this.adaptToDPR();
  }

  addNode(node: GraphNode): void {
    this.nodes.push(node);
  }

  removeNode(node: GraphNode): void {
    this.nodes = this.nodes.filter((n) => n !== node);
  }

  addEdge(edge: GraphEdge): void {
    this.edges.push(edge);
  }

  /**
   * Adapt the canvas scale to the device pixel ratio.
   */
  adaptToDPR() {
    const dpr = window.devicePixelRatio || 1;
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;

    this.ctx.scale(dpr, dpr);
  }

  /**
   * Main rendering engine for the canvas.
   */
  render(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.nodes.forEach((node) => node.render());
    this.edges.forEach((edge) => edge.render());
    requestAnimationFrame(this.render.bind(this));
  }

  /**
   * @param event mouse click event
   * @returns the clicked node or undefined if no node was clicked
   */
  getClickedNode(event: MouseEvent): GraphNode | undefined {
    return this.nodes.find((node) => {
      const dx = event.clientX - this.canvas.offsetLeft - node.x;
      const dy = event.clientY - this.canvas.offsetTop - node.y;
      return dx * dx + dy * dy <= node.radius * node.radius;
    });
  }

  /**
   * @param node the node to select
   */
  selectNode(node: GraphNode | undefined): void {
    if (this.selectedNode) {
      this.selectedNode.deselect();
    }

    this.selectedNode = node;
    this.nodeMovementAllowed = true;

    if (this.selectedNode) {
      this.selectedNode.select();
    }
  }

  /**
   * deselects the currently selected node
   */
  deselectNode(): void {
    if (this.selectedNode) {
      this.selectedNode.deselect();
      this.selectedNode = undefined;
    }
  }

  /**
   * updates the position of the selected node
   * @param event mouse move event
   */
  moveSelectedNode(event: MouseEvent): void {
    if (this.selectedNode && this.nodeMovementAllowed) {
      this.selectedNode.x = event.clientX - this.canvas.offsetLeft;
      this.selectedNode.y = event.clientY - this.canvas.offsetTop;
    }
  }

  secondaryNodeClick(node: GraphNode) {
    if (node == this.selectedNode) {
      this.nodeMovementAllowed = false;
    } else {
      return; //ADD EDGE
    }
  }

  handleDoubleClick(event: MouseEvent, node: GraphNode | undefined) {
    if (node) {
      this.removeNode(node);
    } else {
      new GraphNode(this, event.clientX, event.clientY);
    }
  }
}
