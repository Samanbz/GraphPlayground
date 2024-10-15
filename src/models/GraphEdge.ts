import { GraphCanvas } from "./GraphCanvas";
import { GraphEntity } from "./GraphEntity";
import { GraphNode } from "./GraphNode";


export class GraphEdge implements GraphEntity {
    canvas: GraphCanvas;

    private from: GraphNode;
    private to: GraphNode;
    private lineWidth: number = 2;
    private strokeColor: string = 'gray';

    constructor(canvas: GraphCanvas, from: GraphNode, to: GraphNode) {
        this.canvas = canvas;
        canvas.addEdge(this);

        this.from = from;
        this.to = to;
    }

    render(): void {
        let ctx = this.canvas.ctx;

        ctx.beginPath();
        ctx.moveTo(this.from.x, this.from.y);
        ctx.lineTo(this.to.x, this.to.y);
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.strokeColor;
        ctx.stroke();
        ctx.closePath();

    }
}