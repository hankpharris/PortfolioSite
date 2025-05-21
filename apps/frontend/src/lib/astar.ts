import { PathfinderStrategy } from "./SetPathfinderStrategy.ts";
import { Waypoint, Edge, getClosestWaypoint } from "./MapPathfinder.ts";
import { get } from "http";

/**
 * Implements the A* search algorithm to find the shortest path
 * between two waypoints on a map.
 * 
 * A* is a pathfinding algorithm that uses heuristics to
 * efficiently find the shortest path in a weighted graph.
 * It combines features of Dijkstra's algorithm and Greedy Best-First Search.
 */
class AStar implements PathfinderStrategy {
    /**
     * Finds the shortest path between two waypoints using the A* algorithm.
     * 
     * @param startingNode The starting waypoint.
     * @param destination The destination waypoint.
     * @param allWaypoints An array of all waypoints on the map.
     * @returns A tuple [pathEdges, totalDistance]:
     *      - pathEdges: an array of edges representing the path from the starting node to the destination.
     *      - totalDistance: sum of all edge distances, or -1 if no path found.
     */
    findPath (
        startingNode: Waypoint,
        destination: Waypoint,
        allWaypoints: Waypoint[]
    ): [Edge[], number] {
        const openSet = new Set<Waypoint>();            // Set of waypoints to be evaluated
        const cameFrom = new Map<Waypoint, Edge>();     // Map to reconstruct the path; for each node, which edge led to it.
        const gScore = new Map<Waypoint, number>();     // Cost from start to current waypoint
        const fScore = new Map<Waypoint, number>();     // Estimated cost from start -> this node -> goal

        // Initialize gScore and fScore for all waypoints
        for (const waypoint of allWaypoints) {
            gScore.set(waypoint, Infinity);
            fScore.set(waypoint, Infinity);
        }
        
        gScore.set(startingNode, 0);                                            // Cost from start to start is 0
        fScore.set(startingNode, this.heuristic(startingNode, destination));    // Estimated cost from start to goal through start
        openSet.add(startingNode);                                              // Add starting node to open set

        // Main loop of the A* algorithm
        while (openSet.size > 0) {
            // Get the waypoint in openSet with the lowest fScore
            const closest = getClosestWaypoint(openSet, waypoint => fScore.get(waypoint)!);

            // If no closest waypoint is found, break the loop, indicating no path was found
            if (closest === null) {
                break;
            }
            const current = closest[0];

            // If we've reached the goal, reconstruct and return the path
            if (current === destination) {
                return this.reconstructPath(cameFrom, current);
            }

            // Remove current waypoint from consideration
            openSet.delete(current);

            // Evaluate each neighbor from the current waypoint
            for (const edge of current.edges) {
                const neighbor = edge.destination;
                // Tentative gScore: cost to neighbor through current node
                const tentativeGScore = gScore.get(current)! + edge.distance;

                // If this path to neighbor is better than any previous one
                if (tentativeGScore < gScore.get(neighbor)!) {
                    cameFrom.set(neighbor, edge);                                                       // Record the edge leading to neighbor
                    gScore.set(neighbor, tentativeGScore);                                              // Update best known cost to reach neighbor
                    fScore.set(neighbor, tentativeGScore + this.heuristic(neighbor, destination));      // Update estimated cost to reach goal through neighbor; fScore = gScore + heuristic(neighbor, goal)
                    openSet.add(neighbor);                                                              // Make sure neighbor is evaluated
                }
            }
        }

        // No path was found
        return [[], -1];
    }

    /**
     * Heuristic function to estimate the distance between two waypoints.
     * Uses the Haversine distance via Google Maps spherical utilities.
     * 
     * @param a The first waypoint.
     * @param b The second waypoint.
     * @returns Straight-line distance in meters.
     */
    private heuristic(a: Waypoint, b: Waypoint): number {
        return google.maps.geometry.spherical.computeDistanceBetween(a.location, b.location);
    }

    /**
     * Reconstructs the path by walking backwards from the goal node
     * to the start node using the cameFrom map.
     * 
     * @param cameFrom Map of waypoints to edges leading to them.
     * @param current The destination waypoint.
     * @returns A tuple [pathEdges, totalDistance].
     */
    private reconstructPath(cameFrom: Map<Waypoint, Edge>, current: Waypoint): [Edge[], number] {
        const path: Edge[] = [];
        let totalDistance = 0;

        // Walk backwards until we reach the start (which won’t be in cameFrom)
        while (cameFrom.has(current)) {
            const edge = cameFrom.get(current)!;
            path.unshift(edge);                     // Prepend the edge so that path goes from start -> destination
            totalDistance += edge.distance;
            current = edge.origin;                  // Move to the previous waypoint
        }

        return [path, totalDistance];
    }
}

export default AStar;