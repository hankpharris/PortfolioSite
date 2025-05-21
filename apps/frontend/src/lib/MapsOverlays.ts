export class ImageOverlay extends google.maps.OverlayView {
    div: HTMLDivElement = document.createElement("div");
    img: HTMLImageElement = document.createElement("img");

    rotation = 0;
    metersWide = 100; // meters

    divMouseDownHandler: ((e: MouseEvent) => void) | null = null;
    divMouseUpHandler: ((e: MouseEvent) => void) | null = null;
    moveHandler: ((e: MouseEvent) => void) | null = null;
    rotateHandler: ((e: MouseEvent) => void) | null = null;

    handles: HTMLDivElement[] = [];

    heightIsThisManyWidths = 1;

    constructor(
        public position: google.maps.LatLng,
        public imageUrl: string,
        public map: google.maps.Map,
        private _editable: boolean
    ) {
        super();
    }

    get editable() {
        return this._editable;
    }

    set editable(value: boolean) {
        if (this._editable === value) return;
        this._editable = value;
        this.updateEditable();
    }

    private updateEditable() {
        if (this._editable) {
            this.makeEditable();
        } else {
            this.makeUneditable();
        }
    }

    private makeEditable() {
        this.div.style.outline = "3px solid #000";
        this.img.style.opacity = "0.5";

        this.addHandle("left", "top");
        this.addHandle("right", "top");
        this.addHandle("left", "bottom");
        this.addHandle("right", "bottom");

        this.divMouseDownHandler = (origin: MouseEvent) => {
            this.div.style.cursor = "move";
            this.map.set("draggable", false);
            this.handles.forEach(h => (h.style.opacity = "0"));

            this.moveHandler = e => {
                const left = origin.clientX - e.clientX;
                const top = origin.clientY - e.clientY;

                const pos = this.getProjection().fromLatLngToDivPixel(this.position)!;
                this.position = this.getProjection().fromDivPixelToLatLng(
                    new google.maps.Point(pos.x - left, pos.y - top)
                )!;
                origin = e;

                this.draw();
            };

            this.map.getDiv().addEventListener("mousemove", this.moveHandler);
        };

        this.divMouseUpHandler = () => {
            this.map.set("draggable", true);
            this.div.style.cursor = "default";
            this.handles.forEach(h => (h.style.opacity = "1"));

            this.map.getDiv().removeEventListener("mousemove", this.moveHandler!);
        };

        this.div.addEventListener("mousedown", this.divMouseDownHandler);
        this.div.addEventListener("mouseup", this.divMouseUpHandler);

        const panes = this.getPanes()!;
        panes.floatPane.appendChild(this.div);
    }

    private makeUneditable() {
        this.div.style.outline = "none";
        this.img.style.opacity = "1";

        for (const handle of this.handles) {
            handle.remove();
        }

        if (this.moveHandler) this.map.getDiv().removeEventListener("mousemove", this.moveHandler);
        this.div.removeEventListener("mousedown", this.divMouseDownHandler!);
        this.div.removeEventListener("mouseup", this.divMouseUpHandler!);

        const panes = this.getPanes()!;
        panes.overlayLayer.appendChild(this.div);
    }

    onAdd() {
        this.div.style.position = "absolute";
        this.div.style.userSelect = "none";

        this.img.src = this.imageUrl;
        this.img.draggable = false;
        this.img.style.pointerEvents = "none";
        this.img.style.userSelect = "none";
        this.img.style.width = "100%";
        this.img.style.height = "100%";
        this.img.style.position = "absolute";
        this.img.addEventListener("dragstart", e => e.preventDefault());

        this.img.addEventListener("load", () => {
            this.heightIsThisManyWidths = this.img.naturalHeight / this.img.naturalWidth;
            this.draw();
        });

        this.div.appendChild(this.img);

        this.updateEditable();
    }

    addHandle(horizontal: "left" | "right", vertical: "top" | "bottom") {
        const handle = document.createElement("div");
        handle.style.position = "absolute";
        handle.style[horizontal] = "0px";
        handle.style[vertical] = "0px";
        handle.style.transform = `translate(${horizontal === "left" ? "-50%" : "50%"}, ${vertical === "top" ? "-50%" : "50%"})`;
        handle.style.width = "9px";
        handle.style.height = "9px";
        handle.style.borderWidth = "1px";
        handle.style.borderStyle = "solid";
        handle.style.borderRadius = "6px";
        handle.style.backgroundColor = "white";
        handle.style.borderColor = "rgb(0, 0, 0)";
        this.handles.push(handle);

        this.div.appendChild(handle);

        handle.addEventListener("mousedown", e => {
            e.stopPropagation();

            const rect = this.div.getBoundingClientRect();
            const center = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
            };

            const dx = e.clientX - center.x;
            const dy = e.clientY - center.y;
            const startAngle = Math.atan2(dy, dx);
            const startRadius = Math.hypot(dy, dx);
            const initialRotation = this.rotation;
            const initialMetersWide = this.metersWide;

            this.rotateHandler = e => {
                this.map.set("draggable", false);

                const rect = this.div.getBoundingClientRect();
                const center = {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                };

                const dx = e.clientX - center.x;
                const dy = e.clientY - center.y;
                const currentAngle = Math.atan2(dy, dx);
                const currentRadius = Math.hypot(dy, dx);

                const deltaAngle = currentAngle - startAngle;
                const degrees = (initialRotation + (deltaAngle * 180) / Math.PI) % 360;

                this.rotation = degrees;

                const scaleFactor = currentRadius / startRadius;
                this.metersWide = initialMetersWide * scaleFactor;
                this.div.style.transform = `rotate(${degrees}deg)`;
                this.draw();
            };

            this.map.getDiv().addEventListener("mousemove", this.rotateHandler);
        });

        this.map.getDiv().addEventListener("mouseup", () => {
            if (!this.rotateHandler) return;
            this.map.set("draggable", true);
            this.map.getDiv().removeEventListener("mousemove", this.rotateHandler!);
        });
    }

    draw() {
        const overlayProjection = this.getProjection();

        const endLatLng = google.maps.geometry.spherical.computeOffset(
            this.position,
            this.metersWide / 2,
            90
        );

        const pos = overlayProjection.fromLatLngToDivPixel(this.position)!;
        const endPoint = overlayProjection.fromLatLngToDivPixel(endLatLng)!;

        // calculate the heading, width, and height
        const heading = (Math.atan2(endPoint.y - pos.y, endPoint.x - pos.x) * 180) / Math.PI;

        const pixelWidth = Math.hypot(endPoint.y - pos.y, endPoint.x - pos.x) * 2;
        const pixelHeight = pixelWidth * this.heightIsThisManyWidths;

        if (this.div) {
            this.div.style.left = `${pos.x - pixelWidth / 2}px`;
            this.div.style.top = `${pos.y - pixelHeight / 2}px`;

            this.div.style.width = `${pixelWidth}px`;
            this.div.style.height = `${pixelHeight}px`;

            this.div.style.transform = `rotate(${this.rotation + heading}deg)`;
        }
    }

    onRemove() {
        if (this.div) {
            this.div.parentNode!.removeChild(this.div);
        }
    }
}

// waypoint name popover

export class WaypointOverlay extends google.maps.OverlayView {
    div: HTMLElement = document.createElement("div");
    selected = false;

    constructor(
        public position: google.maps.LatLng,
        public value: string | undefined,
        public onSave: (name: string | undefined) => void,
        public map: google.maps.Map
    ) {
        super();
    }

    onAdd() {
        const div = this.div;
        div.style.position = "absolute";
        div.style.zIndex = "9999";

        this.unselect();

        const panes = this.getPanes()!;
        panes.overlayMouseTarget.appendChild(this.div);
    }

    unselect() {
        this.selected = false;

        const span = document.createElement("span");
        span.style.position = "absolute";
        span.style.left = "0px";
        span.style.top = "0px";
        span.style.whiteSpace = "nowrap";
        span.style.padding = "4px";
        span.style.fontSize = "12px";
        span.style.color = "#fff";
        span.style.fontWeight = "800";
        span.style.fontSize = "12px";
        span.style.webkitTextStroke = "2px #000";
        span.style.paintOrder = "stroke fill";
        span.style.transform = "translate(-50%, -120%)";

        span.innerText = this.value || "";

        this.div.replaceChildren(span);
        this.draw();
    }

    select() {
        this.selected = true;

        const input = document.createElement("input");
        input.type = "text";
        input.value = this.value || "";
        input.style.padding = "4px";
        input.style.fontSize = "12px";
        input.style.border = "1px solid #aaa";
        input.style.background = "white";
        input.style.transform = "translate(-50%, -120%)";

        this.div.replaceChildren(input);
        this.draw();

        // saving logic
        input.addEventListener("blur", () => {
            this.onSave(input.value);
            this.value = input.value === "" ? undefined : input.value;
            this.unselect();
        });

        input.addEventListener("keydown", e => {
            if (e.key === "Enter") input.blur();
        });

        setTimeout(() => {
            input.focus();
            input.select();
        }, 0);
    }

    draw() {
        if (!this.value && !this.selected) return;
        const projection = this.getProjection();
        const point = projection.fromLatLngToDivPixel(this.position);
        if (this.div && point) {
            this.div.style.left = `${point.x}px`;
            this.div.style.top = `${point.y}px`;
        }
    }

    onRemove() {
        if (this.div) {
            this.div.remove();
        }
    }
}
