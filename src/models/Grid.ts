import { Group } from "two.js/src/group";
import { GraphCanvasRenderer } from "./GraphCanvasRenderer";
import { Coordinate } from "./base";
import { Point } from "./Point";

export class Grid {
  private readonly gridUnit: number;
  private _gridPointsGroup: Group;

  constructor(
    public canvas: GraphCanvasRenderer,
    private _gridSeparation: number,
    private _pointRadius: number = 2,
    private gridPoints: Point[] = [],
  ) {
    this.gridUnit = this.gridSeparation + this.pointRadius / 2;
    this._gridPointsGroup = this.canvas.graphics.makeGroup();
    this.generateGridPoints();
  }

  get gridPointsGroup(): Group {
    return this._gridPointsGroup;
  }

  get gridSeparation(): number {
    return this._gridSeparation;
  }

  get pointRadius(): number {
    return this._pointRadius;
  }

  private generateGridPoints() {
    let numOfColumns = Math.ceil(this.canvas.width / this.gridUnit);
    numOfColumns = numOfColumns % 2 === 1 ? numOfColumns + 1 : numOfColumns;
    for (let i = -numOfColumns / 2; i < numOfColumns / 2; i++) {
      const x = i * this.gridUnit;
      this.generateColumnPoints(x);
    }
  }

  private generateColumnPoints(x: number) {
    let numOfPoints = Math.ceil(this.canvas.height / this.gridUnit);
    numOfPoints = numOfPoints % 2 === 1 ? numOfPoints + 1 : numOfPoints;
    for (let i = -numOfPoints / 2; i < numOfPoints / 2; i++) {
      const y = i * this.gridUnit;
      const point = new Point(this.canvas, x, y, this.pointRadius);
      this.addPoint(point);
    }
  }

  addPoint(point: Point): void {
    this.gridPoints.push(point);
    this._gridPointsGroup.add(point.shape);
  }

  updateGridPoints(zoomFactor: number, panOffset: Coordinate): void {
    const gridOffset = panOffset
      .times(-1 / this.gridUnit)
      .apply(Math.floor)
      .times(this.gridUnit);

    this._gridPointsGroup.translation.set(gridOffset.x, gridOffset.y);
  }
}
