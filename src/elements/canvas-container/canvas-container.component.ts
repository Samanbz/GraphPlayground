import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from "@angular/core";
import { GraphCanvasHandlers, GraphEdge, GraphNode } from "@models/index";

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
  private canvas!: GraphCanvasHandlers;

  @HostListener("mousedown", ["$event"])
  onMouseDown(event: MouseEvent) {
    this.canvas.handleMouseDown(event);
  }

  @HostListener("mouseup", ["$event"])
  onMouseUp(event: MouseEvent) {
    this.canvas.handleMouseUp(event);
  }

  @HostListener("mousemove", ["$event"])
  onMouseMove(event: MouseEvent) {
    this.canvas.handleMouseMove(event);
  }

  @HostListener("dblclick", ["$event"])
  onDoubleClick(event: MouseEvent) {
    this.canvas.handleDoubleClick(event);
  }

  @HostListener("document:keydown.shift")
  onShiftDown() {
    this.canvas.handleShiftDown();
  }

  @HostListener("document:keyup.shift")
  onShiftUp() {
    this.canvas.handleShiftUp();
  }

  // @HostListener("document:wheel", ["$event"])
  // onScroll(event: WheelEvent) {
  //   this.canvas.handleScroll(event);
  // }

  ngAfterViewInit() {
    this.canvas = new GraphCanvasHandlers(this.canvasElement.nativeElement);
    this.canvas.render();

  }
}
