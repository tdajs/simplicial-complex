import { Complex } from "./complex";


class Simplex {
    vSet: number[] | [number];

    constructor(vSet: [number]) {
        this.vSet = vSet;
    }
    
    get dim() {
        return this.vSet.length - 1;
    }

    faces(): [Simplex] | Simplex[] { 
        let result = new Array<Simplex>();
        
        for(let i=0;i<=this.dim;i++) {
            let face = this.vSet.slice(0,i);
            
            if(i<this.dim)
                face = face.concat(this.vSet.slice(i-this.dim));
            
            result.push(new Simplex(face as [number]));
        }
        return result;
    };
    
    equals(simplex: Simplex) { 
        return Array.isArray(this.vSet) &&
        Array.isArray(simplex.vSet) &&
        this.vSet.length === simplex.vSet.length &&
        this.vSet.every((val, index) => val === simplex.vSet[index]);
    };
    
    validFor(complex: Complex) {
        return this.vSet.filter(value => 
            Number.isInteger(value) && 0 <= value && value < complex.nVertices)
            .length === this.vSet.length
    }
        // equalsUptoOrientation( ) { }
}


export { Simplex };