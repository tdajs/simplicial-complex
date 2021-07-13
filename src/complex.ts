import { Simplex } from "./simplex";
import { Vertex } from "./vertex";
import * as nj from "numjs";
import { NormalForm } from './normal-form';

class Complex {
    vertices?: Vertex[];
    simplices: Simplex[][];

    constructor(vertices?: Vertex[]) {
        this.vertices = vertices;
        this.simplices = new Array<Simplex[]>();
    }

    get dim(): number {
        return this.simplices.length;
    }

    addSimplex(simplex: Simplex): void {
        if(this.hasSimplex(simplex)) {
            return;
        }

        for(let face of simplex.faces()) {
            this.addSimplex(face);
        }

        this.simplices[simplex.dim] ||= new Array<Simplex>();
        this.simplices[simplex.dim].push(simplex);
        return;
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