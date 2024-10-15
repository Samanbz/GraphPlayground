import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from "@angular/core";
import { GraphCanvas, GraphNode } from "@models/index";

@Component({
  selector: "app-canvas-container",
  standalone: true,
  imports: [],
  templateUrl: "./canvas-container.component.html",
  styleUrl: "./canvas-container.component.scss",
})
export class CanvasContainerComponent implements AfterViewInit {
  @ViewChild("canvas", { static: false })
  canvasElement!: ElementRef<HTMLCanvasElement>;
  private canvas!: GraphCanvas;

  @HostListener("mousedown", ["$event"])
  onMouseDown(event: MouseEvent) {
    const clickedNode: GraphNode | undefined = this.canvas.getClickedNode(event);
    this.canvas.selectNode(clickedNode);
  }

  @HostListener("mouseup", ["$event"])
  onMouseUp(event: MouseEvent) {
    const clickedNode: GraphNode | undefined = this.canvas.getClickedNode(event);
    if (!clickedNode) {
      this.canvas.deselectNode();
    } else {
      this.canvas.secondaryNodeClick(clickedNode);
    }
  }

  @HostListener("mousemove", ["$event"])
  onMouseMove(event: MouseEvent) {
    this.canvas.moveSelectedNode(event);
  }

  @HostListener("dblclick", ["$event"])
  onDoubleClick(event: MouseEvent) {
    const clickedNode: GraphNode | undefined = this.canvas.getClickedNode(event);
    this.canvas.handleDoubleClick(event, clickedNode);
  }
  ngAfterViewInit() {
    this.canvas = new GraphCanvas(this.canvasElement.nativeElement);
    this.canvas.render();

    new GraphNode(this.canvas, 100, 100);
    new GraphNode(this.canvas, 200, 200);
  }
}
