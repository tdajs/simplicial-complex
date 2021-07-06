import { Complex } from "./complex";


class Simplex {
    vSet: number[];
    constructor(vSet: number[]) {
        if(vSet.length === 0)
            throw new Error('bad simplex');

        vSet.sort();
        let flag = vSet.every( (val,index,arr) => Number.isInteger(val) 
            && (!arr[index - 1] || arr[index - 1] !== val ));
        if(flag)
            this.vSet = vSet;
        else    
            throw new Error('bad simplex');
    }
    
    get dim() {
        return this.vSet.length - 1;
    }

    faces(): Simplex[] { 
        let result = new Array<Simplex>();
        
        for(let i = 0; i <= this.dim; i++) {
            let face = this.vSet.slice(0,i);
            
            if(i < this.dim)
                face = face.concat(this.vSet.slice(i - this.dim));
            
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
}


export { Simplex };