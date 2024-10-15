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
