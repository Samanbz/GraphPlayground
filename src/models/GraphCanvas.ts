import { GraphEdge } from "./GraphEdge";
import { GraphNode } from "./GraphNode";
import { Point } from "./Point";

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
  private shiftDown: boolean = false;
  private strayEdge: GraphEdge | undefined;

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
    this.edges = this.edges.filter((edge) => !edge.containsNode(node));
  }

  addEdge(edge: GraphEdge): void {
    this.edges.push(edge);
  }

  removeEdge(edge: GraphEdge): void {
    this.edges = this.edges.filter((e) => e !== edge);
  }

  /**
   * Adapt the canvas scale to the device pixel ratio.
   */
  private adaptToDPR() {
    const dpr = window.devicePixelRatio || 1;
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;

    this.ctx.scale(dpr, dpr);
  }

  private renderGridPoint(x: number, y: number) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, 2, 0, 2 * Math.PI);
    this.ctx.fillStyle = "#FFFFFF20";
    this.ctx.fill();
    this.ctx.closePath();
  }
  private renderGrid() {
    const gridSepration = 40;

    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    const gridWidth = Math.floor(width / gridSepration) + 1;
    const gridHeight = Math.floor(height / gridSepration) + 1;

    for (let i = -gridWidth / 2; i < gridWidth / 2; i++) {
      for (let j = -gridHeight / 2; j < gridHeight / 2; j++) {
        this.renderGridPoint(i * gridSepration + width / 2, j * gridSepration + height / 2);
      }
    }
  }

  /**
   * Main rendering engine for the canvas.
   */
  render(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.renderGrid();
    this.edges.forEach((edge) => edge.render());
    this.nodes.forEach((node) => node.render());
    requestAnimationFrame(this.render.bind(this));
  }

  /**
   * @param event mouse click event
   * @returns the clicked node or undefined if no node was clicked
   */
  private getClickedNode(event: MouseEvent): GraphNode | undefined {
    return this.nodes.find((node) => {
      const dx = event.clientX - this.canvas.offsetLeft - node.x;
      const dy = event.clientY - this.canvas.offsetTop - node.y;
      return dx * dx + dy * dy <= node.radius * node.radius;
    });
  }

  /**
   * @param node the node to select
   */
  private selectNode(node: GraphNode | undefined): void {
    if (this.selectedNode) {
      this.selectedNode.deselect();
    }

    this.selectedNode = node;

    if (this.selectedNode) {
      this.selectedNode.select();
    }
  }

  /**
   * deselects the currently selected node
   */
  private deselectNode(): void {
    if (this.selectedNode) {
      this.selectedNode.deselect();
      this.selectedNode = undefined;
    }
  }

  private edgeExists(from: Point, to: Point): boolean {
    return !!this.edges.find((edge) => edge.from === from && edge.to === to);
  }

  private connectStrayEdge(node: GraphNode): void {
    if (this.strayEdge && !this.edgeExists(this.strayEdge.from, node)) {
      this.strayEdge.setDestination(node);
      this.strayEdge.setLineWidth(4);
      this.strayEdge = undefined;
    }
  }

  private handleSecondaryNodeMouseUp(node: GraphNode) {
    if (node == this.selectedNode) {
      this.nodeMovementAllowed = false;
    } else if (this.strayEdge) {
      this.strayEdge.setDestination(node);
      this.strayEdge.setLineWidth(4);
      this.strayEdge = undefined;
    }
  }

  handleMouseDown(event: MouseEvent): void {
    const clickedNode: GraphNode | undefined = this.getClickedNode(event);
    if (clickedNode) {
      if (this.shiftDown && !this.strayEdge) {
        this.strayEdge = new GraphEdge(this, clickedNode, new Point(event.clientX, event.clientY));
      } else if (this.shiftDown && this.strayEdge) {
        this.connectStrayEdge(clickedNode);
      } else {
        this.nodeMovementAllowed = true;
      }
    }
    this.selectNode(clickedNode);
  }

  handleMouseUp(event: MouseEvent): void {
    const clickedNode: GraphNode | undefined = this.getClickedNode(event);
    if (!clickedNode) {
      if (this.strayEdge) {
        this.removeEdge(this.strayEdge);
        this.strayEdge = undefined;
      }
      this.deselectNode();
    } else {
      this.handleSecondaryNodeMouseUp(clickedNode);
    }
  }

  /**
   * updates the position of the selected node
   * @param event mouse move event
   */
  handleMouseMove(event: MouseEvent): void {
    if (this.strayEdge && this.shiftDown) {
      const strayEnd = new Point(event.clientX - this.canvas.offsetLeft, event.clientY - this.canvas.offsetTop);
      this.strayEdge.setDestination(strayEnd);
    }
    if (this.selectedNode && this.nodeMovementAllowed) {
      this.selectedNode.x = event.clientX - this.canvas.offsetLeft;
      this.selectedNode.y = event.clientY - this.canvas.offsetTop;
    }
  }

  handleDoubleClick(event: MouseEvent) {
    const node = this.getClickedNode(event);
    if (node) {
      this.removeNode(node);
    } else {
      new GraphNode(this, event.clientX, event.clientY);
    }
  }

  handleShiftDown() {
    this.shiftDown = true;
  }

  handleShiftUp() {
    this.shiftDown = false;
    this.removeEdge(this.strayEdge!);
    this.strayEdge = undefined;
  }
}
