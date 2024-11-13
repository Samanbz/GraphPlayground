import { Coordinate } from "./base";
import { GraphCanvasActions } from "./GraphCanvasActions";
import { GraphEdge } from "./GraphEdge";
import { GraphNode } from "./GraphNode";
import { Point } from "./Point";

export class GraphCanvasHandlers extends GraphCanvasActions {
  protected shiftDown: boolean = false;
  protected spaceDown: boolean = false;

  private panning: boolean = false;
  private panStart: Coordinate | undefined;
  private panEnd: Coordinate | undefined;

  constructor(container: HTMLDivElement) {
    super(container);
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

  handleMouseDown(event: MouseEvent): void {
    const mouseCoords = this.coordUtils.getMouseEventCoords(event);

    if (this.spaceDown) {
      this.panning = true;
      this.panStart = mouseCoords;
    }

    const clickedNode: GraphNode | undefined = this.getClickedNode(event);
    if (clickedNode) {
      if (this.shiftDown && !this.strayEdge) {
        const strayEdgeEndCoords = this.coordUtils.canvasToCoords(mouseCoords);
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
    if (this.panning) {
      this.panning = false;
      this.panStart = undefined;
    }

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

    if (this.panning && this.panStart) {
      this.panEnd = mouseCoords;
      const delta = this.panEnd.minus(this.panStart);
      this.pan(delta);
      this.panStart = this.panEnd;
    }
    if (this.strayEdge && this.strayEdgeEnd && this.shiftDown) {
      this.strayEdgeEnd.move(mouseCoords);
      this.strayEdge.setDestination(this.strayEdgeEnd);
    }
    if (this.selectedNode && this.nodeMovementAllowed) {
      this.selectedNode.move(mouseCoords);
    }
  }

  handleDoubleClick(event: MouseEvent) {
    const mouseCoords = this.coordUtils.getMouseEventCoords(event);
    const node = this.getClickedNode(event);

    if (node) {
      this.removeNode(node);
    } else {
      const coords = this.coordUtils.canvasToCoords(mouseCoords);
      new GraphNode(this, coords.x, coords.y);
    }
  }

  handleShiftDown() {
    this.shiftDown = true;
  }

  handleShiftUp() {
    this.shiftDown = false;
    if (this.strayEdge) {
      this.removeEdge(this.strayEdge);
      this.strayEdge = undefined;
    }
  }

  handleSpaceDown() {
    this.spaceDown = true;
  }

  handleSpaceUp() {
    this.spaceDown = false;
    if (this.panning) {
      this.panning = false;
      this.panStart = undefined;
    }
  }

  handleScroll(event: WheelEvent) {
    const increment = event.deltaY < 0;
    const zoomOrigin = this.coordUtils.getMouseEventCoords(event);
    event.shiftKey && this.zoom(increment, zoomOrigin);
  }
}
