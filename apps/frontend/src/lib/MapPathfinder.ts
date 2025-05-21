import { ImageOverlay } from "./MapsOverlays.ts";
import type { MapSave } from "@/lib/MapEditor.ts";
import SetPathfinderStrategy from "@/lib/SetPathfinderStrategy.ts";
import Dijkstra from "@/lib/dijkstra.ts";
import type { PathStore } from "@/components/pathfinding/PathTextDirections.tsx";
import { create, StoreApi, UseBoundStore } from "zustand";
import { lineSymbols } from "@/lib/pathStyles.ts";

export interface Layer {
    name: string;
    waypoints: Waypoint[];
    lines: Set<Edge>;
    image: ImageOverlay;
}

export interface Edge {
    origin: Waypoint;
    destination: Waypoint;
    distance: number;
    overlay: google.maps.Polyline;
}

export interface Waypoint {
    name?: string;
    location: google.maps.LatLng;
    layer: Layer;
    edges: Edge[];
}

export type SuppliedLayer = {
    name: string;
    waypoints: {
        id: string;
        name: string;
    }[];
};

export type Hospital = "patriot-place" | "chestnut-hill" | "faulkner" | "bwh";

const hospitalLayers = {
    "patriot-place": [0, 1, 2],
    "chestnut-hill": [3],
    faulkner: [4],
    bwh: [5, 6],
};

export class MapPathfinder {
    private layers: Layer[] = [];
    private currentLayer: Layer | null = null;
    private activeLayers: SuppliedLayer[] = [];
    private allWaypoints: Waypoint[] = [];
    private currentLocationMarker: google.maps.Marker | null = null;
    private destinationWaypoint: Waypoint | null = null;
    private _pathLine: google.maps.Polyline | null = null;
    private offset = 0;
    private _currentHospital: Hospital | null = null;
    public pathfinder = new SetPathfinderStrategy(new Dijkstra());
    public textDirections: string[] = [];
    private selectedSymbolId: string = "dashed";
    private isZooming = false;
    private newScale = 1;

    constructor(
        public drawingManager: google.maps.drawing.DrawingManager,
        public map: google.maps.Map,
        private setAvailableLayers: (layer: SuppliedLayer[]) => void,
        private pathStore: UseBoundStore<StoreApi<PathStore>>
    ) {
        google.maps.event.addListener(this.map, "zoom_changed", () => {
            const currentZoom = this.map.getZoom()!;

            this.newScale = 1.1 ** currentZoom / 10;
            console.log(this.newScale);
        });

        setInterval(() => {
            if (!this._pathLine) return;
            this.offset += 1;

            this._pathLine.setOptions({
                icons: this.selectedSymbol.icons(this.offset, this.newScale),
            });
        }, 20);
    }

    get selectedSymbol() {
        return lineSymbols.find(s => s.id === this.selectedSymbolId)!;
    }

    updateLineSymbol(id: string) {
        this.selectedSymbolId = id;
    }

    setHeading(aroundMarker: boolean = false) {
        if (!this.currentLayer) return;
        const currentHeading = this.map.getHeading() || 0;
        const deg = this.currentLayer.image.rotation;
        this.map.setHeading(deg);

        if (!aroundMarker) return;
        const drad = ((deg - currentHeading) * Math.PI) / 180;
        const center = this.map.getCenter()!;
        const fixedLatLng = this.currentLocationMarker?.getPosition() || center;
        const projection = this.currentLayer.image.getProjection();
        if(!projection) return;
        const fixedPoint = projection.fromLatLngToDivPixel(fixedLatLng)!;
        const centerPoint = projection.fromLatLngToDivPixel(center)!;
        const pxmcx = fixedPoint.x - centerPoint.x;
        const pymcy = fixedPoint.y - centerPoint.y;
        const xp = Math.cos(drad) * pxmcx - Math.sin(drad) * pymcy;
        const yp = Math.sin(drad) * pxmcx + Math.cos(drad) * pymcy;
        const dx = fixedPoint.x - xp;
        const dy = fixedPoint.y - yp;
        const newCenter = projection.fromDivPixelToLatLng(
            new google.maps.Point(centerPoint.x + dx, centerPoint.y + dy)
        )!;
        this.map.panTo(newCenter);
    }

    setHospital(hospital: Hospital) {
        this._currentHospital = hospital;
        this.allWaypoints = [];
        this.activeLayers = [];
        for (const layerIndex of hospitalLayers[hospital]) {
            const layer = this.layers[layerIndex];
            const suppliedWaypoints = [];
            for (const waypoint of layer.waypoints) {
                if (waypoint.name) {
                    suppliedWaypoints.push({
                        id: this.allWaypoints.length.toString(),
                        name: waypoint.name,
                    });
                }
                this.allWaypoints.push(waypoint);
            }
            this.activeLayers.push({ name: layer.name, waypoints: suppliedWaypoints });
        }
        this.setAvailableLayers(this.activeLayers);
        this.setLayer(this.layers[hospitalLayers[hospital][0]]);
    }

    private makePathLine(path: google.maps.LatLng[]) {
        if (!this._pathLine) {
            this._pathLine = new google.maps.Polyline({
                path: path,
                geodesic: true,
                strokeColor: "#003a96",
                strokeWeight: 5,
                strokeOpacity: 1,
                zIndex: 1,
                icons: this.selectedSymbol.icons(this.offset, this.newScale),
                map: this.map,
            });
        }
        return this._pathLine;
    }

    private setPathLine(path: google.maps.LatLng[]) {
        if (this._pathLine) {
            this._pathLine.setOptions({
                map: this.map,
                path,
            });
        } else {
            const line = this.makePathLine(path);
            if (line) {
                line.setMap(this.map);
            } else {
                console.warn("pathLine is null when calling setMap");
            }
        }
    }

    private makeCurrentLocationMarker(location: google.maps.LatLng) {
        this.currentLocationMarker = new google.maps.Marker({
            position: location,
            map: this.map,
            draggable: true,
        });

        google.maps.event.addListener(
            this.currentLocationMarker,
            "drag",
            (event: google.maps.MapMouseEvent) => {
                const latLng = event.latLng;
                if (!latLng) return;
                this.route();
            }
        );
    }

    setCurrentLocationMarker(location: google.maps.LatLng) {
        if (this.currentLocationMarker) {
            this.currentLocationMarker.setPosition(location);
        } else {
            this.makeCurrentLocationMarker(location);
        }
    }

    getCurrentPosition() {
        return this.currentLocationMarker?.getPosition();
    }

    setLayer(layer: Layer) {
        // unmount the current layer, if any
        if (this.currentLayer) {
            this.currentLayer.image.setMap(null);
            for (const line of this.currentLayer.lines) {
                line.overlay.setMap(null);
            }
        }

        this.currentLayer = layer;

        // mount the new layer
        this.currentLayer.image.setMap(this.map);
        if (this.pathStore.getState().routing) this.setHeading(true);
        // for (const line of this.currentLayer.lines) {
        //     line.overlay.setMap(this.map);
        // }
    }

    unmount() {
        for (const layer of this.layers) {
            layer.image.setMap(null);
            for (const line of layer.lines) {
                line.overlay.setMap(null);
            }
        }
        this._pathLine?.setMap(null);
        this.currentLocationMarker?.setMap(null);
        this.currentLocationMarker = null;
    }

    loadData(data: MapSave) {
        const waypoints = new Map<number, Waypoint>();

        for (const layerJSON of data.layers) {
            // add image overlay of layer
            const overlay = new ImageOverlay(
                new google.maps.LatLng(layerJSON.image.position.y, layerJSON.image.position.x),
                layerJSON.image.url,
                this.map,
                false
            );

            overlay.metersWide = layerJSON.image.metersWide;
            overlay.rotation = layerJSON.image.rotation;

            // make the actual layer
            const layer: Layer = {
                name: layerJSON.name,
                waypoints: [],
                lines: new Set(),
                image: overlay,
            };

            // iterate through waypoints of layer
            for (const waypointJSON of layerJSON.waypoints) {
                const waypoint = {
                    name: waypointJSON.name,
                    location: new google.maps.LatLng(waypointJSON.y, waypointJSON.x),
                    layer,
                    edges: [],
                };
                waypoints.set(waypointJSON.id, waypoint);
                layer.waypoints.push(waypoint);
            }

            this.layers.push(layer);
        }

        for (const line of data.lines) {
            const start = waypoints.get(line.start);
            const end = waypoints.get(line.end);
            if (!start || !end) {
                continue;
            }

            const distance = calculateDistanceBetween(start.location, end.location);
            const overlay = new google.maps.Polyline({
                path: [start.location, end.location],
            });

            const edge = { origin: start, destination: end, distance, overlay };
            start.edges.push(edge);
            end.edges.push({ origin: end, destination: start, distance, overlay });

            start.layer.lines.add(edge);
            end.layer.lines.add(edge);

            if (start.layer != this.currentLayer && end.layer != this.currentLayer) {
                continue;
            }
        }
    }

    setDestinationWaypoint(waypointIndex: number) {
        this.destinationWaypoint = this.allWaypoints[waypointIndex];
    }

    route() {
        if (this.currentLayer === null || this.destinationWaypoint === null) {
            return;
        }

        const currentLocation = this.getCurrentPosition()!; // NOTE: it's possible that getCurrentPosition is null here

        const [projectedPoint, startingLine] = getClosestLineAndProjPoint(
            [...this.currentLayer.lines].filter(
                line =>
                    line.origin.layer === this.currentLayer &&
                    line.destination.layer === this.currentLayer
            ),
            currentLocation
        );
        if (!projectedPoint || !startingLine) return;

        const distanceToProjectedPoint = calculateDistanceBetween(currentLocation, projectedPoint);

        let bestPath = null;
        let bestDistance = Infinity;
        for (const startingWaypoint of [startingLine.origin, startingLine.destination]) {
            const currentLayerWaypoints = this.allWaypoints.filter(
                waypoint => waypoint.layer == this.currentLayer
            );

            const distanceToStartingWaypoint = calculateDistanceBetween(
                projectedPoint,
                startingWaypoint.location
            );

            currentLayerWaypoints.splice(currentLayerWaypoints.indexOf(startingWaypoint), 1);

            const [path, distance] = this.pathfinder.findPath(
                startingWaypoint,
                this.destinationWaypoint,
                this.allWaypoints
            );

            const totalDistance = distanceToProjectedPoint + distanceToStartingWaypoint + distance;

            if (totalDistance < bestDistance) {
                bestPath = path;
                bestDistance = totalDistance;
            }
        }

        if (!bestPath) {
            return;
        }

        if (bestPath.length === 0) {
            this.setPathLine([currentLocation, this.destinationWaypoint.location]);
            if (bestDistance < 2) {
                this.destinationWaypoint = null;
                this._pathLine?.setMap(null);
                this.pathStore.setState({ routing: false });
            }
            return;
        }

        const checkShouldShiftLayer = (origin: Waypoint, destination: Waypoint) => {
            if (
                origin.layer === this.currentLayer &&
                destination.layer !== this.currentLayer &&
                calculateDistanceBetween(currentLocation, origin.location) < 2
            ) {
                this.setLayer(destination.layer);
            }
        };

        // sorry, confusing code, but we're basically finding the origin from the starting node,
        // the starting node is always the destination of the starting line
        const startingLineDestination = bestPath[0].origin;
        const startingLineOrigin =
            bestPath[0].origin === startingLine.origin
                ? startingLine.destination
                : startingLine.origin;
        checkShouldShiftLayer(startingLineOrigin, startingLineDestination);

        const path = [currentLocation, projectedPoint, startingLineDestination.location];

        // make selected lines red
        for (const edge of bestPath) {
            if (edge.destination.layer === this.currentLayer) path.push(edge.destination.location);
            checkShouldShiftLayer(edge.origin, edge.destination);
        }

        this.setPathLine(path);

        if (distanceToProjectedPoint >= 2) {
            const turnAngle = getTurnAngle(
                currentLocation,
                projectedPoint,
                startingLineDestination.location
            );

            this.pathStore.setState({
                routing: true,
                turnAngle: Math.floor(turnAngle),
                meters: Math.floor(distanceToProjectedPoint),
            });

            return;
        }

        let previous = projectedPoint;
        for (let i = 0; i < bestPath.length; i++) {
            const currentEdge = bestPath[i];

            const distanceToOriginWaypoint = calculateDistanceBetween(
                currentLocation,
                currentEdge.origin.location
            );

            if (distanceToOriginWaypoint >= 2) {
                const turnAngle = getTurnAngle(
                    previous,
                    currentEdge.origin.location,
                    currentEdge.destination.location
                );

                this.pathStore.setState({
                    routing: true,
                    turnAngle: Math.floor(turnAngle),
                    meters: Math.floor(distanceToOriginWaypoint),
                });

                return;
            }

            previous = currentEdge.origin.location;
        }
    }
}

function calculateDistanceBetween(start: google.maps.LatLng, end: google.maps.LatLng) {
    return google.maps.geometry.spherical.computeDistanceBetween(start, end);
}

function sub(a: google.maps.LatLng, b: google.maps.LatLng) {
    return new google.maps.LatLng(a.lat() - b.lat(), a.lng() - b.lng());
}

function dot(a: google.maps.LatLng, b: google.maps.LatLng) {
    return a.lat() * b.lat() + a.lng() * b.lng();
}

function lerpScalar(v0: number, v1: number, t: number) {
    return (1 - t) * v0 + t * v1;
}

function lerp(a: google.maps.LatLng, b: google.maps.LatLng, t: number) {
    return new google.maps.LatLng(lerpScalar(a.lat(), b.lat(), t), lerpScalar(a.lng(), b.lng(), t));
}

function getClosestLineAndProjPoint(iterator: Iterable<Edge>, position: google.maps.LatLng) {
    let closest: google.maps.LatLng | null = null;
    let closestLine: Edge | null = null;
    let minDistance = Infinity;

    for (const line of iterator) {
        // get the projected point on the line
        const A = line.origin.location;
        const B = line.destination.location;
        const P = position;

        // unfortunate mixing of coordinate spaces but hey, everything's locally euclidean :)
        const AB = sub(B, A);
        const dot_AB_AB = dot(AB, AB);

        const AP = sub(P, A);
        const dot_AP_AB = dot(AP, AB);

        const unclampedT = dot_AP_AB / dot_AB_AB;
        const t = Math.max(0, Math.min(1, unclampedT));

        const point = lerp(A, B, t);
        const distance = calculateDistanceBetween(position, point);

        if (closest === null || distance < minDistance) {
            minDistance = distance;
            closest = point;
            closestLine = line;
        }
    }

    return [closest, closestLine] as const;
}

export function getClosestWaypoint(
    iterator: Iterable<Waypoint>,
    comparator: (waypoint: Waypoint) => number
) {
    let closest: Waypoint | null = null;
    let minDistance = Infinity;
    for (const waypoint of iterator) {
        const totalDistance = comparator(waypoint);

        if (closest === null || totalDistance < minDistance) {
            minDistance = totalDistance;
            closest = waypoint;
        }
    }

    return closest ? ([closest, minDistance] as const) : null;
}

function getAngle(from: google.maps.LatLng, to: google.maps.LatLng) {
    const dx = to.lng() - from.lng();
    const dy = to.lat() - from.lat();
    return Math.atan2(dy, dx); // Angle is in radians !!!!
}

function getTurnAngle(
    from: google.maps.LatLng,
    current: google.maps.LatLng,
    to: google.maps.LatLng
) {
    const angle1 = getAngle(from, current);
    const angle2 = getAngle(current, to);
    let turn = angle2 - angle1;

    // Normalizes the angles between -180 and 180, lowk looked this up but it works
    while (turn > Math.PI) turn -= 2 * Math.PI;
    while (turn < -Math.PI) turn += 2 * Math.PI;

    return turn;
}
