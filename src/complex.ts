import { Simplex } from "./simplex";
import { choose, dist } from "./utils";
import { NormalForm, changeBasis } from '@tdajs/normal-form';

class Complex {
    simplices: Simplex[][];

    constructor(n?: number) {
        this.simplices = new Array<Simplex[]>();
        this.simplices[0] = new Array<Simplex>();

        for(let i = 0; i < (n || 0); i++)
            this.simplices[0].push(new Simplex([i]));
    }

    get n() {
        return this.simplices[0].length;
    }

    get dim(): number {
        return this.simplices.length - 1;
    }
    
    findIndex(simplex: Simplex) {
        if(!this.simplices[simplex.dim])
            return -1;
        
        return this.simplices[simplex.dim].findIndex(s => s.equals(simplex));
    }
    
    add(simplex: Simplex) {
        if(!(simplex instanceof Simplex))
          simplex = new Simplex(simplex);
        
        if(this.findIndex(simplex) !== -1)
            return this;
        
        if(simplex.dim === 0) {
            const idx = simplex[0];
            for(let i = this.n; i < idx; i++) {
                this.simplices[0].push(new Simplex([i]));
            }
        }
        
        simplex.faces
        .filter( f => this.findIndex(f) === -1)
        .map( f=> this.add(new Simplex(f)) )
        ;
        
        this.simplices[simplex.dim] ||= new Array<Simplex>();
        this.simplices[simplex.dim].push(simplex);
        return this;
    }    

    bdMat(dim: number) {
        if((!this.simplices[dim] || this.simplices[dim].length === 0) ||
            (!this.simplices[dim - 1] || this.simplices[dim - 1].length === 0))
            throw new Error('dimension not valid.')

        let mat = Array(this.simplices[dim -1].length).fill(0)
            .map( r => Array(this.simplices[dim].length).fill(0) );
            
        this.simplices[dim].forEach( (simplex, j) => {
            simplex.faces.forEach( (face, k) => {
                mat[this.findIndex(face)][j] = Math.pow(-1, k);
            });
        });
        return mat;
    }

    static rips(vertices: number[][], scale: number, distMat: number[][] = Array<number[]>(),  distance?: string) {
        if(distMat.length === 0) {
            distMat = Array(vertices.length).fill(0).map( (r,i) => {
                return Array(vertices.length).fill(0).map( (c,j) => {
                    return dist(vertices[i], vertices[j]);
                });
            });
        }
        
        const complex = new Complex();
        
        for(let i = 0; i < distMat.length; i++)
            for(let j = 0; j < i; j++) {
                if(distMat[i][j] <= scale) {
                    complex.add(new Simplex([i,j]));
                }
            }

        const idxSet = vertices.map((e,i) => i);
        let dim = 1;
        while(dim < complex.n - 1 && complex.simplices[dim] 
                && complex.simplices[dim].length !== 0) {
            dim += 1;

            const simplices = choose(idxSet, dim + 1).filter( combo => {
                return new Simplex(combo)
                .faces
                //.every( face => complex.findIndex(face) ) //
            }) as Simplex[];
            
            simplices.forEach( simplex => complex.add(simplex));
        }
        return complex; 
    }

    // remove(simplex: Simplex) {}

    // compute the homology groups
    ker_basis(dim: number) {
        const nf = new NormalForm(this.bdMat(dim));
        const basis = changeBasis(this.simplices[dim].map( s => s.toString()), nf.P);
        return basis.slice(nf.diag.length);
    }

    bd_basis(dim: number) {
        const nf = new NormalForm(this.bdMat(dim + 1));
        const basis = changeBasis(this.simplices[dim].map( s => s.toString()), nf.Q);
        return nf.diag.map( (d, idx) => {
            if(d === 1)
                return basis[idx];
            else if(d === -1)
                return "-(" + basis[idx] + ")";
            else
                return d + "(" + basis[idx] + ")";
        });
    }

    wbd_basis(dim: number) {
        const nf = new NormalForm(this.bdMat(dim + 1));
        const basis = changeBasis(this.simplices[dim].map( s => s.toString()), nf.Q);
        return basis.slice(0, nf.diag.length);

    }

    betti(dim: number) {
        return this.ker_basis(dim).length - this.wbd_basis(dim).length;
    }

    torsion(dim: number) {
        const nf =  new NormalForm(this.bdMat(dim + 1));
        return nf.diag.filter( d => d > 1 );
    }
}

export { Complex };