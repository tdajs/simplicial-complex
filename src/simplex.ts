import { Complex } from "./complex";

class Simplex {    
    vSet: number[];
    label?: string;
    vertices?: any;
    anchor?: string; 
    offset?: number;

    constructor(vSet: number[], 
        opts?: {label?: string, vertices?: any[], anchor?: string, offset?: number}) {        
        
        if(!vSet || vSet.length === 0)
            throw new Error('vertex set required.');
        
        vSet.sort((num1, num2) => {
            if(num1 < num2)
                return -1;
            else if(num1 > num2)
                return +1;
            else
                return 0;    
        });
        
        const is_distinct = vSet.every( (val,index,arr) => Number.isInteger(val) 
                    && (!arr[index - 1] || arr[index - 1] !== val ));
        if(!is_distinct)
            throw new Error('bad simplex.');
        
        this.vSet = vSet;
        this.label = opts?.label;
        this.vertices = opts?.vertices;
        this.anchor = opts?.anchor;
        this.offset = opts?.offset;
    }

        
    getVerticesFrom(complex: Complex) {
        if(!complex.findSimplex(this.vSet)) 
            throw new Error('simplex does not belong to complex.');
            
        return this.vertices ||
            this.vSet.map( v => complex.simplices[0][v].vertices[0] );
    }

    get dim() {
        return this.vSet.length - 1;
    }

    get faces() { 
        if(this.dim === 0)
            return [];

        let result = new Array<number[]>();
        for(let i = 0; i <= this.dim; i++) {
            let face = this.vSet.slice(0,i);
            if(i < this.dim)
                face = face.concat(this.vSet.slice(i - this.dim));
            result.push(face);
        }
        return result;
    };
    
    hasVSet(vSet: number[]) { 
        return Array.isArray(this.vSet) &&
            Array.isArray(vSet) &&
            this.vSet.length === vSet.length &&
            this.vSet.every((val, index) => val === vSet[index]);
    };
}
export { Simplex };