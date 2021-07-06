import { Simplex } from "./simplex";
import { Vertex } from "./vertex";
import { NormalForm } from './normal-form';

class Complex {
    nVertices: number;
    vertices?: Vertex[];
    simplices: Simplex[][];

    constructor(nVertices: number, vertices?: Vertex[]) {
        this.nVertices = nVertices;
        this.simplices = new Array<Simplex[]>();
        
        let vertexSet = new Array<Simplex>();
        for(let i = 0; i < nVertices; i++)
            vertexSet.push(new Simplex([i]));
        this.simplices.push(vertexSet);    
    }

    get dim() {
        return this.simplices.length;
    }

    addVertex( ) {
        //
    }

    addSimplex(simplex: Simplex | number[]) {
        if(Array.isArray(simplex))
            simplex = new Simplex(simplex);

        if(simplex.dim === 0) {
            // this.addVertex();
            return;
        }

        if(!this.valid(simplex)) {
            console.log('simplex is not valid.');
            return;
        }
        
        if(this.hasSimplex(simplex)) {
            return;
        }

        for(let face of simplex.faces()) {
            this.addSimplex(face);
        }

        this.simplices[simplex.dim] ||= new Array<Simplex>();
        this.simplices[simplex.dim].push(simplex);
    }

    
    valid(simplex: Simplex) {
        return simplex.vSet.every( value => 0 <= value && value < this.nVertices );
    }

    hasSimplex(simplex: Simplex) {
        let simplices = this.simplices[simplex.dim];
        if(!simplices)
            return false;
        
        for(let i = 0; i < simplices.length; i++) {
            if(simplex.equals(simplices[i]))
                return i;
        }
        return false;
    }

    bdMat(dim: number) {
        if((!this.simplices[dim] || this.simplices[dim].length === 0) ||
            (!this.simplices[dim - 1] || this.simplices[dim - 1].length === 0))
            throw new Error('dimension not valid.')
        let n = this.simplices[dim -1].length;
        let m = this.simplices[dim].length;
        
        let mat = new Array<number[]>(n);
        for(let i = 0; i < n; i++) {
            mat[i] = new Array<number>(m);
            for( let j = 0; j < m; j++) {
                mat[i][j] = 0;
            }
        }

        for(let j = 0; j < m; j++) {
            let simplex = this.simplices[dim][j];
            let faces = simplex.faces();
            for(let k = 0; k < faces.length; k++) {
                let i = this.hasSimplex(faces[k]);
                if(i || i === 0)
                    mat[i][j] = Math.pow(-1,k);
            }
        }
        return mat;
    }
}

export { Complex };