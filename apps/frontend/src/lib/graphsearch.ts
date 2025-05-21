import {PathfinderStrategy} from "@/lib/SetPathfinderStrategy.ts";
import {Waypoint, Edge} from "./MapPathfinder.ts";

class GraphSearch implements PathfinderStrategy {
    private dfs: boolean;

    constructor(dfs: boolean) {
        this.dfs = dfs;
    }

    findPath(startingNode: Waypoint, destination: Waypoint, allWaypoints: Waypoint[]): [Edge[], number]  {
        const queue: Waypoint[] = [];
        const visited = new Set<Waypoint>();
        const edgeTo = new Map<Waypoint, Edge | null>();

        queue.push(startingNode);
        visited.add(startingNode);
        edgeTo.set(startingNode, null);

        while (queue.length > 0) {
            let current_node = null
            if(!this.dfs) {
                // BFS
                current_node = queue.shift();
            } else {
                // DFS
                current_node = queue.pop();
            }


            if (!current_node) continue;

            if (current_node === destination) {
                // Reconstruct the path using edges
                const path: Edge[] = [];
                let node: Waypoint | null = destination;
                let edge = edgeTo.get(node);

                while (edge !== null) {
                    path.unshift(edge!);
                    node = edge!.origin;
                    edge = edgeTo.get(node);
                }

                const totalDistance = path.reduce((sum, edge) => sum + edge.distance, 0);
                return [path, totalDistance];
            }

            for (const edge of current_node.edges) {
                const neighbor = edge.destination;

                if (!visited.has(neighbor)) {
                    queue.push(neighbor);
                    visited.add(neighbor);
                    edgeTo.set(neighbor, edge);
                }
            }
        }

        return [[], -1]
    }


}

export default GraphSearch;