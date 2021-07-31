import { Simplex } from "./simplex";
import { choose, dist } from "./utils";

class Complex {
    vertices: any[];
    simplices: Simplex[][];

    constructor(vertices?: any[]) {
        this.vertices = vertices || Array();
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

    facesOf(simplex: Simplex) {
        const s = this.simplices[simplex.dim].find(s => s === simplex );
        
        if(!s)
            throw new Error('simplex does not exist.');
        
        if(simplex.dim === 0)
            return [];

        return simplex.faces.map( vSet => 
            this.simplices[simplex.dim - 1].find( s => s.hasVSet(vSet) )
        ) as Simplex[];            
    }

    add(simplex: Simplex | number[]) {
        if(Array.isArray(simplex))
            simplex = new Simplex(simplex);
        
        let s = this.findSimplex(simplex.vSet);
        if(s) {
            s = simplex;
            return this;
        }

        if(!simplex.faces.every( face => this.findSimplex(face)))
            throw new Error('Face does not exist.');
        
        if(simplex.dim === 0) {
            const idx = simplex.vSet[0];
            for(let i = this.n; i < idx; i++)
                this.simplices[0].push(new Simplex([i]));
            this.vertices = 
                this.vertices.concat(new Array(idx - this.n + 1));
        }
        

        this.simplices[simplex.dim] ||= new Array<Simplex>();
        this.simplices[simplex.dim].push(simplex);
        return this;
    }
    
    findSimplex(vSet: number[]) {
        const simplices = this.simplices[vSet.length - 1];
        return simplices && simplices.find(simp => simp.hasVSet(vSet));
    }

    bdMat(dim: number) {
        if((!this.simplices[dim] || this.simplices[dim].length === 0) ||
            (!this.simplices[dim - 1] || this.simplices[dim - 1].length === 0))
            throw new Error('dimension not valid.')

        let mat = Array(this.simplices[dim -1].length).fill(
            Array(this.simplices[dim].length).fill(0)
        );

        this.simplices[dim].forEach( (simplex, j) => {
            this.facesOf(simplex).forEach( (face,k) => {
                const idx = this.simplices[dim - 1].indexOf(face);
                mat[idx][j] = Math.pow(-1,k);
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
        
        const complex = new Complex(vertices);
        
        for(let i = 0; i < distMat.length; i++)
            for(let j = 0; j < i; j++) {
                if(distMat[i][j] <= scale) {
                    complex.add([i,j]);
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
                .every( face => complex.findSimplex(face) )
            });
            
            simplices.forEach( simplex => complex.add(simplex));
        }
        return complex; 
    }

    static cech() {

    }
    // realizationOf(simplex: Simplex) {
    // 
    // }
}

export { Complex };