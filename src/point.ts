class Point {
    coordinates: [number];

    constructor(coordinates: [number]) {
        this.coordinates = coordinates;
    }
    
    distanceTo(other: Point): number {
        return 0;
    }
}

export { Point };