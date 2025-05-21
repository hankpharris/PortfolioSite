import { PathfinderStrategy } from "@/lib/SetPathfinderStrategy.ts";
import { Waypoint, Edge } from "./MapPathfinder.ts";

function choice<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

class BogoBogoSearch implements PathfinderStrategy {
    findPath(
        startingNode: Waypoint,
        destination: Waypoint,
        _allWaypoints: Waypoint[]
    ): [Edge[], number] {
        const visited = new Set<Waypoint>();
        let path: Edge[] = [];

        while (true) {
            let current_node = startingNode;
            let totalDistance = 0;

            while (true) {
                visited.add(current_node);
                if (current_node === destination) {
                    return [path, totalDistance];
                }

                const nextEdge = choice(
                    current_node.edges.filter(edge => !visited.has(edge.destination))
                );

                if (nextEdge === undefined) {
                    visited.clear();
                    path = [];
                    break;
                }

                path.push(nextEdge);
                current_node = nextEdge.destination;
                totalDistance += nextEdge.distance;
            }
        }
    }
}

export default BogoBogoSearch;
