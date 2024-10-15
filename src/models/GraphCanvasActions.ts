import { GraphCanvasRenderer } from "./GraphCanvasRenderer";
import { GraphEdge } from "./GraphEdge";
import { GraphNode } from "./GraphNode";
import { Point } from "./Point";

/**
 * Singleton class that represents the canvas element.
 * Responsible for rendering all nodes and edges.
 * Passed to all nodes and edges to allow them to render themselves.
 */
export class GraphCanvasActions extends GraphCanvasRenderer {
  protected selectedNode: GraphNode | undefined;
  protected nodeMovementAllowed: boolean = false;
  protected shiftDown: boolean = false;
  protected strayEdge: GraphEdge | undefined;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
  }
  /**
   * @param event mouse click event
   * @returns the clicked node or undefined if no node was clicked
   */
  protected getClickedNode(event: MouseEvent): GraphNode | undefined {
    return this.nodes.find((node) => {
      const dx = event.clientX - this.canvas.offsetLeft - node.x;
      const dy = event.clientY - this.canvas.offsetTop - node.y;
      return dx * dx + dy * dy <= node.radius * node.radius;
    });
  }

  /**
   * @param node the node to select
   */
  protected selectNode(node: GraphNode | undefined): void {
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
  protected deselectNode(): void {
    if (this.selectedNode) {
      this.selectedNode.deselect();
      this.selectedNode = undefined;
    }
  }

  protected edgeExists(from: Point, to: Point): boolean {
    return !!this.edges.find((edge) => edge.from === from && edge.to === to);
  }

  protected connectStrayEdge(node: GraphNode): void {
    if (this.strayEdge && !this.edgeExists(this.strayEdge.from, node)) {
      this.strayEdge.setDestination(node);
      this.strayEdge.setLineWidth(4);
      this.strayEdge = undefined;
    }
  }

  protected handleSecondaryNodeMouseUp(node: GraphNode) {
    if (node == this.selectedNode) {
      this.nodeMovementAllowed = false;
    } else if (this.strayEdge) {
      this.strayEdge.setDestination(node);
      this.strayEdge.setLineWidth(4);
      this.strayEdge = undefined;
    }
  }
}
