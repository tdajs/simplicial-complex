import { Simplex } from "./simplex";
import { Vertex } from "./vertex";

class Complex {
    nVertices: number;
    vertices?: Vertex[];
    simplices: Set<Simplex>[];

    constructor(nVertices: number, vertices?: Vertex[]) {
        this.nVertices = nVertices;
        
        let vertexSet = new Set<Simplex>();
        for(let i=0;i<nVertices;i++)
            vertexSet.add(new Simplex([i]));

        this.simplices = new Array(vertexSet);
    }

    addVertex( ) {
        //
    }

    addSimplex(simplex: Simplex) {
        if(simplex.dim() === 0) {
            // this.addVertex();
            return;
        }

        if(!this.canAdd(simplex)) {
            console.log('can not add this simplex');
            return;
        }
        
        if(this.hasSimplex(simplex))
            return;

        for(let face of simplex.faces()) {
            this.addSimplex(face);
        }

        this.simplices[simplex.dim()] ||= new Set<Simplex>();
        this.simplices[simplex.dim()].add(simplex);
    }

    canAdd(simplex: Simplex) {
        return false;
    }

    hasSimplex(simplex: Simplex) {
        let flag = false;
        let collection = this.simplices[simplex.vertices.length - 1];
        if(!collection)
            return false;

        collection.forEach(key => {
                //if(this.simplexEquals(key,simplex))
                //    flag = true;
            }
        )
        return flag;
    }

    hasFaces(simplex: Simplex) {
        return false;
    }

    flagify( ) {
        return;
    }

    ifFlag( ) {
        return false;
    } 
}

export { Complex };