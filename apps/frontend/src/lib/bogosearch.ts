import { PathfinderStrategy } from "@/lib/SetPathfinderStrategy.ts";
import { Waypoint, Edge } from "./MapPathfinder.ts";

function choice<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

class BogoSearch implements PathfinderStrategy {
    findPath(
        startingNode: Waypoint,
        destination: Waypoint,
        _allWaypoints: Waypoint[]
    ): [Edge[], number] {
        const path: Edge[] = [];
        let current_node = startingNode;
        let totalDistance = 0;

        while (true) {
            if (current_node === destination) {
                return [path, totalDistance];
            }

            const nextEdge = choice(current_node.edges);
            path.push(nextEdge);
            current_node = nextEdge.destination;
            totalDistance += nextEdge.distance;
        }
    }
}

export default BogoSearch;
