import { Point } from './point';

class Vertex {
    location?: Point;
    index: number;

    constructor(index: number, location?: Point){
        this.index = index;
        this.location = location;
    }
}

export { Vertex }