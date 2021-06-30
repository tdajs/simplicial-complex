import { Complex } from "./complex";

class Simplex {
    vertices: [number];

    constructor(vertices: [number]) {
        // vertices.sort();
        this.vertices = vertices;
    }

    dim( ) {
        return this.vertices.length - 1;
    }
    
    sort( ) {
        this.vertices.sort();
    }

    faces(dim?: number): Set<Simplex> { 
        let result: Set<Simplex> = new Set<Simplex>();
        
        for(let i=0;i<=this.dim();i++) {
            let face = this.vertices.slice(0,i);
            if(i<this.dim())
                face = face.concat(this.vertices.slice(i-this.dim()));
            
            result.add(new Simplex(face as [number]));
        }
        return result;
    };


    equals(simplex: Simplex) { 
        return Array.isArray(this.vertices) &&
        Array.isArray(simplex.vertices) &&
        this.vertices.length === simplex.vertices.length &&
        this.vertices.every((val, index) => val === simplex.vertices[index]);
    };

    validFor(complex: Complex) {
        return this.vertices.filter(value => 
            Number.isInteger(value) && 0 <= value && value < complex.nVertices)
            .length === this.vertices.length
    }
    // equalsUptoOrientation( ) { }
}

export { Simplex };