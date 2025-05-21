import {PathfinderStrategy} from "@/lib/SetPathfinderStrategy.ts";
import {Waypoint, Edge, getClosestWaypoint} from "./MapPathfinder.ts";

class Dijkstra implements PathfinderStrategy {

    constructor () {}

    findPath(startingNode: Waypoint, destination: Waypoint, allWaypoints: Waypoint[]): [Edge[], number] {
        const bestDistance = new Map<Waypoint, number>();
        const bestPreviousEdge = new Map<Waypoint, Edge>();
        const queue = new Set<Waypoint>();

        for (const waypoint of allWaypoints) {
            bestDistance.set(waypoint, Infinity);
            queue.add(waypoint);
        }

        bestDistance.set(startingNode, 0);

        while (queue.size > 0) {
            const [closest, minDistance] = getClosestWaypoint(
                queue,
                waypoint => bestDistance.get(waypoint)!
            )!;
            if (closest == destination) {
                break;
            }

            queue.delete(closest);

            for (const edge of closest.edges) {
                if (!queue.has(edge.destination)) {
                    continue;
                }
                const alt = minDistance + edge.distance;
                if (
                    !bestPreviousEdge.has(edge.destination) ||
                    alt < bestDistance.get(edge.destination)!
                ) {
                    bestDistance.set(edge.destination, alt);
                    bestPreviousEdge.set(edge.destination, edge);
                }
            }
        }

        const path: Edge[] = [];
        let currentWaypoint: Waypoint | undefined = destination;

        while (true) {
            const edge = bestPreviousEdge.get(currentWaypoint);
            if (!edge) break;
            path.push(edge);
            currentWaypoint = edge.origin;
        }

        return [path.reverse(), bestDistance.get(destination)!] as const;
    }
}

export default Dijkstra;