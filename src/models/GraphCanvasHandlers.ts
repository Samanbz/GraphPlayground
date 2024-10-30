import { GraphCanvasActions } from "./GraphCanvasActions";
import { GraphEdge } from "./GraphEdge";
import { GraphNode } from "./GraphNode";
import { Point } from "./Point";

export class GraphCanvasHandlers extends GraphCanvasActions {
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
  }

  handleMouseDown(event: MouseEvent): void {
    const mouseCoords = this.coordUtils.getMouseEventCoords(event);
    const clickedNode: GraphNode | undefined = this.getClickedNode(event);

    if (clickedNode) {
      if (this.shiftDown && !this.strayEdge) {
        const strayEdgeEndCoords = this.coordUtils.clientToCoords(mouseCoords);
        this.strayEdgeEnd = new Point(this, strayEdgeEndCoords.x, strayEdgeEndCoords.y);
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
    const mouseCoords = this.coordUtils.getMouseEventCoords(event);

    if (this.strayEdge && this.strayEdgeEnd && this.shiftDown) {
      this.strayEdgeEnd.move(this.coordUtils.clientToCanvas(mouseCoords));
      this.strayEdge.setDestination(this.strayEdgeEnd);
    }
    if (this.selectedNode && this.nodeMovementAllowed) {
      this.selectedNode.move(this.coordUtils.clientToCanvas(mouseCoords));
    }
  }

  handleDoubleClick(event: MouseEvent) {
    const mouseCoords = this.coordUtils.getMouseEventCoords(event);
    const node = this.getClickedNode(event);

    if (node) {
      this.removeNode(node);
    } else {
      const coords = this.coordUtils.clientToCoords(mouseCoords);
      new GraphNode(this, coords.x, coords.y);
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

  handleScroll(event: WheelEvent) {
    const increment = event.deltaY < 0;
    event.shiftKey && this.zoom(increment);
  }
}
