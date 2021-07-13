import { Simplex } from "./simplex";
import { Vertex } from "./vertex";
import * as nj from "numjs";
import { NormalForm } from './normal-form';

class Complex {
    vertices: Vertex[];
    simplices: Simplex[][];

    constructor(n: number, vertices?: Vertex[]) {
        this.vertices = vertices || Array<Vertex>(n);
        this.simplices = new Array<Simplex[]>();
        this.simplices[0] = new Array<Simplex>();
        for(let i = 0; i < this.n; i++)
            this.simplices[0].push(new Simplex([i]));
    }

    get n() {
        return this.vertices.length;
    }

    get dim(): number {
        return this.simplices.length;
    }

    addVertex(index: number) {
        if(!Number.isInteger(index) || index < 0 || index < this.n)
            return;

        this.vertices.concat(new Array<Vertex>(index - this.n + 1));
        for(let i = this.n; i <= index ; i++)
            this.simplices[0].push(new Simplex([i]));
    }

    addSimplex(simplex: Simplex) {
        if(this.hasSimplex(simplex)) {
            return;
        }

        if(simplex.dim === 0) {
            this.addVertex(simplex[0]);
            return;
        }

        for(let face of simplex.faces()) {
            this.addSimplex(face);
        }

        this.simplices[simplex.dim] ||= new Array<Simplex>();
        this.simplices[simplex.dim].push(simplex);
        return this;
    }

    indexOf(simplex: Simplex): number {
        let simplices = this.simplices[simplex.dim];
        if(!simplices)
            return -1;
        return simplices.findIndex(simp => simp.equals(simplex));
    }

    hasSimplex(simplex: Simplex): boolean {
        if(this.indexOf(simplex) === -1)
            return false;
        return true;
    }

    bdMat(dim: number) {
        if((!this.simplices[dim] || this.simplices[dim].length === 0) ||
            (!this.simplices[dim - 1] || this.simplices[dim - 1].length === 0))
            throw new Error('dimension not valid.')

        let mat = nj.zeros([
            this.simplices[dim -1].length,
            this.simplices[dim].length
        ]);

        this.simplices[dim].forEach( (simplex,j) => {
            simplex.faces().forEach( (face,k) => {
                mat.set(this.indexOf(face),j,Math.pow(-1,k));
            });
        });

        return mat;
    }
}

export { Complex };