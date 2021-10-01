export class Simplex extends Array<number> {    
    constructor(vSet: number[]) {        
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

        vSet.push(-1);
        super(...vSet);
        this.pop();
    }

    static get [Symbol.species]() {
        return Array;
    }

    get dim() {
        return this.length - 1;
    }

    get faces() { 
        if(this.dim === 0)
            return [];

        let result = new Array<Simplex>();
        for(let i = 0; i <= this.dim; i++) {
            let face = this.slice(0,i);
            if(i < this.dim)
                face = face.concat(this.slice(i - this.dim));
            result.push(new Simplex(face));
        }
        return result;
    };
    
    equals(simplex: number[]) { 
        return Array.isArray(this) &&
            Array.isArray(simplex) &&
            this.length === simplex.length &&
            this.every((val, index) => val === simplex[index]);
    };
}