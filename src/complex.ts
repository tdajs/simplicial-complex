import { Vertex } from "./vertex";

class Complex {
    nVertices: number;
    vertices: Array<Vertex>;
    simplices: Array<Set<[number]>>;

    constructor(nVertices: number, vertices?: Array<Vertex>) {
        this.nVertices = nVertices;
        this.vertices = vertices || new Array<Vertex>(nVertices);
        
        for(let i=0;i<this.vertices.length;i++) {
            this.vertices[i] = this.vertices[i] || new Vertex();
            this.vertices[i].index ||= i;
        }

        let vertexSet = new Set<[number]>();
        for(let i=0;i<nVertices;i++)
            vertexSet.add([i]);

        this.simplices = new Array(vertexSet);
    }

    addVertex( ) {
        //
    }

    addSimplex(simplex: [number]) {
        let dim = simplex.length - 1;

        simplex.sort();
        if(dim === 0 || !this.validSimplex(simplex) || this.hasSimplex(simplex))
            return;

        for(let i=0;i<=dim;i++) {
            let face = simplex.slice(0,i) as [number];
            if(i<dim)
                face = face.concat(simplex.slice(i-dim)) as [number];
            this.addSimplex(face);
        }
        this.simplices[dim] ||= new Set<[number]>();
        this.simplices[dim].add(simplex);
    }

    validSimplex(simplex: [number]) {
        return simplex.filter(value => 
            Number.isInteger(value) && 0 <= value && value < this.nVertices)
            .length === simplex.length

    }

    hasSimplex(simplex: [number]) {
        let flag = false;
        let collection = this.simplices[simplex.length - 1];
        if(!collection)
            return false;

        collection.forEach(key => {
                if(this.simplexEquals(key,simplex))
                    flag = true;
            }
        )
        return flag;
    }

    simplexEquals(a: [number], b: [number]) {
        return Array.isArray(a) &&
          Array.isArray(b) &&
          a.length === b.length &&
          a.every((val, index) => val === b[index]);
    }
}

export { Complex };