import { ImageOverlay, WaypointOverlay } from "@/lib/MapsOverlays";
import { useEditStore } from "@/routes/MapEdit";

interface DrawResult {
    type: google.maps.drawing.OverlayType;
    overlay: google.maps.Polyline;
}

const SNAP_DISTANCE = 2; // meters
const WAYPOINT_CLICK_DISTANCE = 10; // pixels

class Layer {
    waypoints: Set<Waypoint> = new Set();
    lines: Set<Line> = new Set();

    constructor(
        public name: string,
        public image: ImageOverlay
    ) {}

    addWaypoint(location: google.maps.LatLng, show: boolean, name?: string) {
        const waypoint = new Waypoint(
            this,
            name,
            location,
            // possible refactoring: put this in Waypoint
            new WaypointOverlay(
                location,
                name,
                newName => (waypoint.name = newName),
                this.image.map
            )
        );
        if (show) waypoint.overlay.setMap(this.image.map);
        this.waypoints.add(waypoint);
        return waypoint;
    }

    removeWaypoint(waypoint: Waypoint) {
        this.waypoints.delete(waypoint);
        waypoint.overlay.setMap(null);
    }
}

class Waypoint {
    dependencies: Set<Line> = new Set();
    constructor(
        public layer: Layer,
        public name: string | undefined,
        public location: google.maps.LatLng,
        public overlay: WaypointOverlay
    ) {}

    distTo(location: google.maps.LatLng) {
        return google.maps.geometry.spherical.computeDistanceBetween(this.location, location);
    }

    removeDependency(line: Line) {
        if (!this.dependencies.has(line)) console.warn("dependency not found!");
        this.dependencies.delete(line);

        if (this.dependencies.size === 0) {
            this.layer.removeWaypoint(this);
        }
    }

    addDependency(line: Line) {
        this.dependencies.add(line);
    }
}

class Line {
    constructor(
        public overlay: google.maps.Polyline,
        public start: Waypoint,
        public end: Waypoint
    ) {
        start.addDependency(this);
        end.addDependency(this);
    }

    isDependentOn(waypoint: Waypoint) {
        const path = this.overlay.getPath();
        return (
            waypoint.distTo(path.getAt(0)) < SNAP_DISTANCE ||
            waypoint.distTo(path.getAt(path.getLength() - 1)) < SNAP_DISTANCE
        );
    }

    change(which: "start" | "end", changeTo: Waypoint) {
        if (changeTo === this[which]) return;
        const changingFrom = this[which];
        this[which] = changeTo;
        changeTo.addDependency(this);
        this.safelyRemoveDependency(changingFrom);
    }

    safelyRemoveDependency(waypoint: Waypoint) {
        if (this.isDependentOn(waypoint)) return;
        waypoint.removeDependency(this);
    }

    delete() {
        this.overlay.setMap(null);
        this.start.removeDependency(this);
        this.end.removeDependency(this);
    }
}

export class MapEditor {
    layers: Layer[] = [];
    currentLayer?: Layer;

    selected: Set<Line> = new Set();
    preservedLines: Set<Line> = new Set();
    preservedWaypoints: Set<Waypoint> = new Set();

    constructor(
        public drawingManager: google.maps.drawing.DrawingManager,
        public map: google.maps.Map,
        public geometry: google.maps.GeometryLibrary
    ) {
        google.maps.event.addListener(drawingManager, "overlaycomplete", (result: DrawResult) =>
            this.onLineDrawn(result)
        );
        document.addEventListener("keydown", e => this.onKeyDown(e));
        // this.addLayer().then(layer => this.setLayer(layer));
    }

    newLine(p1: google.maps.LatLng, p2: google.maps.LatLng, start: Waypoint, end: Waypoint) {
        const line = new google.maps.Polyline({
            path: [p1, p2],
            editable: true,
            draggable: true,
        });

        if (this.currentLayer === start.layer || this.currentLayer === end.layer) {
            line.setMap(this.map);
        }

        return this.handleNewLine(line, start, end);
    }

    handleNewLine(overlay: google.maps.Polyline, start: Waypoint, end: Waypoint) {
        const line = new Line(overlay, start, end);
        start.layer.lines.add(line);
        end.layer.lines.add(line);
        google.maps.event.addListener(overlay, "click", (e: google.maps.MapMouseEvent) =>
            this.onLineClick(line, e)
        );
        google.maps.event.addListener(overlay, "dblclick", (e: google.maps.MapMouseEvent) =>
            this.onLineDoubleClick(line, e)
        );
        this.handlePath(line);
        this.colorLineProperly(line);
        return line;
    }

    handlePath(
        line: Line,
        path: google.maps.MVCArray<google.maps.LatLng> = line.overlay.getPath()
    ) {
        google.maps.event.addListener(path, "insert_at", (i: number) => {
            const p1 = path.getAt(i - 1);
            const p2Raw = path.getAt(i);
            const p3 = path.getAt(i + 1);

            const middleWaypoint = this.makeWaypointOrSnap(p2Raw);
            const p2 = middleWaypoint.location;

            this.newLine(p2, p3, middleWaypoint, line.end);

            const newPath = new google.maps.MVCArray([p1, p2]);
            line.overlay.setPath(newPath);
            line.change("end", middleWaypoint);
            this.handlePath(line, newPath);
        });

        let moving = false;
        google.maps.event.addListener(path, "set_at", (i: number) => {
            if (moving) return;
            let which: "start" | "end";
            if (i === 0) which = "start";
            else if (i === path.getLength() - 1) which = "end";
            else return;

            moving = true;
            line[which].removeDependency(line); // here be dragons 🐉
            const waypoint = this.snapLineEnd(which, line.overlay);
            line.change(which, waypoint);
            moving = false;
        });
    }

    private selectedWaypoint: Waypoint | null = null;

    isClickingOnWaypoint(line: Line, e: google.maps.MapMouseEvent): Waypoint | null {
        for (const waypoint of [line.start, line.end]) {
            if (waypoint.layer !== this.currentLayer || !e.latLng) continue;

            const clickPoint = this.latLng2Point(e.latLng); // a bit redundant but it works
            const waypointPoint = this.latLng2Point(waypoint.location);

            if (
                clickPoint &&
                waypointPoint &&
                Math.hypot(waypointPoint.x - clickPoint.x, waypointPoint.y - clickPoint.y) <
                    WAYPOINT_CLICK_DISTANCE
            ) {
                return waypoint;
            }
        }
        return null;
    }

    onLineDoubleClick(line: Line, e: google.maps.MapMouseEvent) {
        const waypoint = this.isClickingOnWaypoint(line, e);
        if (waypoint) {
            waypoint.overlay.select();
        }
    }

    onLineClick(line: Line, e: google.maps.MapMouseEvent) {
        const waypoint = this.isClickingOnWaypoint(line, e);
        if (waypoint) {
            if (!(e.domEvent as MouseEvent).ctrlKey) {
                this.clearSelection();
            }
            for (const line of waypoint.dependencies) {
                this.selected.add(line);
                this.colorLineProperly(line);
            }
            return;
        }

        if (!(e.domEvent as MouseEvent).ctrlKey) {
            this.clearSelection();
        }
        this.selected.add(line);
        this.colorLineProperly(line);
    }

    clearSelection() {
        const selected = this.selected;
        this.selected = new Set();
        for (const line of selected) {
            this.colorLineProperly(line);
        }
    }

    colorLineProperly(line: Line) {
        let color = "#003a96";
        if (this.selected.has(line)) {
            color = "#ff0000";
        } else if (this.preservedLines.has(line)) {
            color = "#de2a90";
        } else if (line.start.layer !== line.end.layer) {
            color = "#00ff00";
        }
        line.overlay.setOptions({ strokeColor: color });
    }

    onLineDrawn(drawResult: DrawResult) {
        if (drawResult.type !== google.maps.drawing.OverlayType.POLYLINE) return;
        const line = drawResult.overlay;
        const path = line.getPath();
        const length = path.getLength();

        const start = this.snapLineEnd("start", line);
        const end = this.snapLineEnd("end", line);

        if (length === 1) {
            this.handleNewLine(line, start, end);
            return;
        }

        let prev = this.makeWaypointOrSnap(path.getAt(1));
        line.setPath([start.location, prev.location]);
        this.handleNewLine(line, start, prev);

        for (let i = 1; i < path.getLength() - 1; i++) {
            const p1 = path.getAt(i);
            const p2 = path.getAt(i + 1);
            const next = this.makeWaypointOrSnap(p2);
            this.newLine(p1, p2, prev, next);
            prev = next;
        }
    }

    *allWaypoints() {
        if (!this.currentLayer) return;
        for (const w1 of this.currentLayer.waypoints) {
            yield w1;
        }
        for (const w2 of this.preservedWaypoints) {
            yield w2;
        }
    }

    makeWaypointOrSnap(latLng: google.maps.LatLng) {
        if (!this.currentLayer) {
            throw new Error("No current layer");
        }

        let closest = null;
        let minDist = SNAP_DISTANCE;

        for (const waypoint of this.allWaypoints()) {
            const dist = waypoint.distTo(latLng);
            if (dist < minDist) {
                closest = waypoint;
                minDist = dist;
            }
        }

        return closest ?? this.currentLayer.addWaypoint(latLng, true);
    }

    // does not do line.change
    snapLineEnd(which: "start" | "end", line: google.maps.Polyline): Waypoint {
        const path = line.getPath();
        const length = path.getLength();
        const index = which === "start" ? 0 : length - 1;
        const point = path.getAt(index);
        const waypoint = this.makeWaypointOrSnap(point);
        path.setAt(index, waypoint.location);
        return waypoint;
    }

    onKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape") {
            this.drawingManager.setDrawingMode(null);
        } else if (e.key === "l" && this.currentLayer) {
            if (e.ctrlKey) {
                // lock unlock image
                this.currentLayer.image.editable = !this.currentLayer.image.editable;
                e.preventDefault();
            } else {
                this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
            }
        }

        if (!this.selected) return;
        if (e.key === "Delete") {
            for (const line of this.selected) {
                line.delete();

                // could be refactored
                for (const layer of this.layers) {
                    layer.lines.delete(line);
                }
            }

            this.selected.clear();
        } else if (e.ctrlKey && e.key === "d") {
            this.clearSelection();
            e.preventDefault();
        }
    }

    addLayer(imageUrl: string): Layer {
        const center = this.map.getCenter()!;
        const layer: Layer = new Layer(
            `Layer ${this.layers.length + 1}`,
            new ImageOverlay(center, imageUrl, this.map, true)
        );

        this.layers.push(layer);
        this.updateLayerControl();
        return layer;
    }

    selectLayer(index: number) {
        this.setLayer(this.layers[index]);
    }

    refreshPreservedWaypoints() {
        this.preservedWaypoints.clear();
        for (const line of this.preservedLines) {
            this.preservedWaypoints.add(line.start);
            this.preservedWaypoints.add(line.end);
        }
    }

    setLayer(layer?: Layer) {
        if (this.currentLayer === layer) return;

        if (layer) {
            // unmount old preserved lines/waypoints
            for (const line of this.preservedLines) {
                line.overlay.setMap(null);
            }
            for (const waypoint of this.preservedWaypoints) {
                waypoint.overlay.setMap(null);
            }

            // preserve selected lines
            const newPreserved = this.selected;

            // reuse, clear selection
            this.selected = this.preservedLines;
            this.selected.clear();

            this.preservedLines = newPreserved;
            this.refreshPreservedWaypoints();
        }

        if (this.currentLayer) this.unmountLayer(this.currentLayer);

        if (layer) {
            this.drawingManager.setOptions({
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: [google.maps.drawing.OverlayType.POLYLINE],
                },
            });

            for (const line of this.preservedLines) {
                this.colorLineProperly(line);
            }

            this.map.setCenter(layer.image.position);
            this.map.setZoom(19);

            layer.image.setMap(this.map);
            for (const line of layer.lines) {
                line.overlay.setMap(this.map);
                this.colorLineProperly(line);
            }
            for (const waypoint of layer.waypoints) {
                waypoint.overlay.setMap(this.map);
            }
        } else {
            this.drawingManager.setOptions({
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: [],
                },
            });
        }

        this.currentLayer = layer;
        this.updateLayerControl();
    }

    removeLayer(index: number) {
        const [deleted] = this.layers.splice(index, 1);
        this.unmountLayer(deleted);
        this.updateLayerControl();
    }

    renameLayer(index: number, newName: string) {
        this.layers[index].name = newName;
        this.updateLayerControl();
    }

    private unmountLayer(layer: Layer) {
        layer.image?.setMap(null);
        for (const line of layer.lines) {
            if (this.preservedLines.has(line)) continue;
            line.overlay.setMap(null);
        }
        for (const waypoint of layer.waypoints) {
            if (this.preservedWaypoints.has(waypoint)) continue;
            waypoint.overlay.setMap(null);
        }
    }

    private updateLayerControl() {
        useEditStore.setState({ layers: this.layers.map(layer => layer.name) });
    }

    clearLayers() {
        this.preservedLines.clear();
        this.preservedWaypoints.clear();
        for (const layer of this.layers) {
            this.unmountLayer(layer);
        }
        this.layers = [];
        this.updateLayerControl();
    }

    deserialize(json: ReturnType<typeof this.serialize>) {
        this.clearLayers();

        const waypoints = new Map<number, Waypoint>();

        for (const layerJSON of json.layers) {
            const image = new ImageOverlay(
                new google.maps.LatLng(layerJSON.image.position.y, layerJSON.image.position.x),
                layerJSON.image.url,
                this.map,
                false
            );
            image.rotation = layerJSON.image.rotation;
            image.metersWide = layerJSON.image.metersWide;
            const layer: Layer = new Layer(layerJSON.name, image);

            for (const waypointJSON of layerJSON.waypoints) {
                const waypoint = layer.addWaypoint(
                    new google.maps.LatLng(waypointJSON.y, waypointJSON.x),
                    false,
                    waypointJSON.name
                );
                waypoints.set(waypointJSON.id, waypoint);
            }

            this.layers.push(layer);
            this.updateLayerControl();
        }

        for (const line of json.lines) {
            const start = waypoints.get(line.start);
            const end = waypoints.get(line.end);
            if (start && end) {
                const line = this.newLine(start.location, end.location, start, end);
                start.layer.lines.add(line);
                end.layer.lines.add(line);
                console.log(start.layer);
            }
        }
    }

    serialize() {
        const waypointIds = new WeakMap();
        let nextId = 0;
        for (const layer of this.layers) {
            for (const waypoint of layer.waypoints) {
                waypointIds.set(waypoint, nextId++);
            }
        }

        const lineSet = new Set<Line>();
        for (const layer of this.layers) {
            for (const line of layer.lines) {
                lineSet.add(line);
            }
        }

        const lines = [];
        for (const line of lineSet) {
            lines.push({ start: waypointIds.get(line.start), end: waypointIds.get(line.end) });
        }

        return {
            layers: this.layers.map(layer => ({
                name: layer.name,
                image: {
                    url: layer.image.imageUrl,
                    position: {
                        x: layer.image.position.lng(),
                        y: layer.image.position.lat(),
                    },
                    metersWide: layer.image.metersWide,
                    rotation: layer.image.rotation,
                },
                waypoints: Array.from(layer.waypoints).map(wp => {
                    return {
                        id: waypointIds.get(wp),
                        name: wp.name,
                        x: wp.location.lng(),
                        y: wp.location.lat(),
                    };
                }),
            })),
            lines,
        };
    }

    // https://stackoverflow.com/a/32784450
    latLng2Point(latLng: google.maps.LatLng) {
        const map = this.map;
        const projection = map.getProjection();
        const bounds = map.getBounds();
        const zoom = map.getZoom();
        if (!projection || !bounds || !zoom) return;

        const topRight = projection.fromLatLngToPoint(bounds.getNorthEast());
        const bottomLeft = projection.fromLatLngToPoint(bounds.getSouthWest());
        const scale = Math.pow(2, zoom);
        const worldPoint = projection.fromLatLngToPoint(latLng);
        if (!worldPoint || !topRight || !bottomLeft) return;
        return new google.maps.Point(
            (worldPoint.x - bottomLeft.x) * scale,
            (worldPoint.y - topRight.y) * scale
        );
    }
}

export type MapSave = ReturnType<typeof MapEditor.prototype.serialize>;
