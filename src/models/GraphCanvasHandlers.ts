import { GraphCanvasActions } from "./GraphCanvasActions";
import { GraphEdge } from "./GraphEdge";
import { GraphNode } from "./GraphNode";
import { Point } from "./Point";

export class GraphCanvasHandlers extends GraphCanvasActions {
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
  }

  handleMouseDown(event: MouseEvent): void {
    const clickedNode: GraphNode | undefined = this.getClickedNode(event);
    if (clickedNode) {
      if (this.shiftDown && !this.strayEdge) {
        this.strayEdgeEnd = new Point(this, event.clientX, event.clientY);
        this.strayEdge = new GraphEdge(this, clickedNode, this.strayEdgeEnd);
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
    if (this.strayEdge && this.strayEdgeEnd && this.shiftDown) {
      this.strayEdgeEnd.move(event.clientX, event.clientY);
      this.strayEdge.setDestination(this.strayEdgeEnd);
    }
    if (this.selectedNode && this.nodeMovementAllowed) {
      this.selectedNode.move(event.clientX, event.clientY);
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
