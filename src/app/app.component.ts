import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { CanvasContainerComponent } from "../elements/canvas-container/canvas-container.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, CanvasContainerComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {}
