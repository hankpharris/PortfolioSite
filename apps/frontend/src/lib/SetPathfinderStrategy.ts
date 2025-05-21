import { Waypoint, Edge } from "./MapPathfinder.ts";

export interface PathfinderStrategy {
    findPath(
        start: Waypoint, 
        end: Waypoint, 
        allWaypoints: Waypoint[]
    ): [Edge[], number];
}

class SetPathfinderStrategy {
    constructor(private pathStrat: PathfinderStrategy) {}

    setPathfinderStrategy(pathStrat: PathfinderStrategy) {
        this.pathStrat = pathStrat;
    }

    findPath(start: Waypoint, end: Waypoint, allWaypoints: Waypoint[]) {
        return this.pathStrat.findPath(start, end, allWaypoints);
    }
}

export default SetPathfinderStrategy;
