import Two from "two.js";
import { Group } from "two.js/src/group";

import { CoordUtils } from "utils/CoordUtils";
import { Coordinate } from "./base/Coordinate";
import { Graph } from "./base/Graph";
import { GraphNode } from "./GraphNode";
import { GraphEdge } from "./GraphEdge";
import { Grid } from "./Grid";
import { Point } from "./Point";

export class GraphCanvasRenderer extends Graph {
  readonly graphics: Two;
  readonly coordUtils: CoordUtils;

  private grid: Grid;
  private nodeGroup: Group;
  private edgeGroup: Group;
  private entityGroup: Group;

  private zoomFactor: number = 1;
  private readonly zoomStep: number = 0.1;
  private panOffset: Coordinate = Coordinate.fromXY(0, 0);

  constructor(container: HTMLDivElement) {
    super();

    this.graphics = new Two({ type: Two.Types.webgl, fullscreen: true, autostart: true }).appendTo(container);
    this.initGraphics();

    this.coordUtils = new CoordUtils(this);
    this.grid = new Grid(this, 40);

    const centerPoint = new Point(this, 0, 0, 4);
    this.nodeGroup = this.graphics.makeGroup(centerPoint.shape);
    this.edgeGroup = this.graphics.makeGroup();
    this.entityGroup = this.graphics.makeGroup(this.nodeGroup, this.edgeGroup, this.grid.gridPointsGroup);
  }

  get width(): number {
    return this.graphics.width;
  }

  get height(): number {
    return this.graphics.height;
  }

  /**
   * Returns the center of the canvas in canvas coordinates.
   */
  get center(): Coordinate {
    return Coordinate.fromXY(this.width, this.height).times(0.5);
  }

  override addNode(node: GraphNode): void {
    super.addNode(node);
    this.nodeGroup.add(node.shape);
  }

  override removeNode(node: GraphNode): void {
    this.edges.forEach((edge) => edge.containsNode(node) && this.removeEdge(edge));
    super.removeNode(node);
    this.nodeGroup.remove(node.shape);
  }

  override addEdge(edge: GraphEdge): void {
    super.addEdge(edge);
    this.edgeGroup.add(edge.shape);
  }

  override removeEdge(edge: GraphEdge): void {
    super.removeEdge(edge);
    this.edgeGroup.remove(edge.shape);
  }

  pan(offset: Coordinate): void {
    this.graphics.scene.translation.add(offset.x, offset.y);
    this.panOffset = this.panOffset.plus(offset);
    this.coordUtils.adaptToPan(offset);
  }

  zoom(increment: boolean, origin: Coordinate): void {
    if ((this.zoomFactor < 0.4 && !increment) || (this.zoomFactor > 5 && increment)) return;
    const zoomDelta = increment ? this.zoomStep : -this.zoomStep;
    this.zoomFactor += zoomDelta;

    const originCoords = this.coordUtils.canvasToCoords(origin);
    const delta = originCoords.minus(this.coordUtils.canvasOrigin).times(-zoomDelta);

    this.entityGroup.translation.add(delta.x, delta.y);
    this.entityGroup.scale = this.zoomFactor;

    this.coordUtils.adaptToZoom(this.zoomFactor, origin);
  }

  private initGraphics(): void {
    this.graphics.renderer.domElement.style.background = "#070708";

    this.graphics.bind("update", () => {
      this.nodes.forEach((node) => node.update());
      this.edges.forEach((edge) => edge.update());
      this.grid.updateGridPoints(this.zoomFactor, this.panOffset);
    });
  }
}
