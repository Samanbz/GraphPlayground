import { GraphEdge } from "../GraphEdge";
import { GraphNode } from "../GraphNode";

export abstract class Graph {
  protected nodes: GraphNode[];
  protected edges: GraphEdge[];

  addNode(node: GraphNode): void {
    this.nodes.push(node);
  }

  removeNode(node: GraphNode): void {
    this.nodes = this.nodes.filter((n) => n !== node);
    this.edges = this.edges.filter((edge) => !edge.containsNode(node));
  }

  addEdge(edge: GraphEdge): void {
    this.edges.push(edge);
  }

  removeEdge(edge: GraphEdge): void {
    this.edges = this.edges.filter((e) => e !== edge);
  }

  constructor() {
    this.nodes = [];
    this.edges = [];
  }
}
