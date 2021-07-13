class Simplex extends Array<number> {    

    constructor(vSet: number[]) {        
        if(vSet.length === 0)
            throw new Error('bad simplex');
        
        vSet.sort((num1, num2) => {
            if(num1 < num2)
                return -1;
            else if(num1 > num2)
                return +1;
            else
                return 0;    
        });
        
        let is_distinct = vSet.every( (val,index,arr) => Number.isInteger(val) 
                    && (!arr[index - 1] || arr[index - 1] !== val ));
        if(is_distinct) {
            if(vSet.length === 1) {
                super(1);
                this[0] = vSet[0];
            }
            else {
                super(...vSet);
            }
        }
        else    
            throw new Error('bad simplex');
    }
    
    static get [Symbol.species]() {
        return Array;
    }

    get dim() {
        return this.length - 1;
    }

    faces() { 
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
    
    equals(simplex: Simplex) { 
        return Array.isArray(this) &&
            Array.isArray(simplex) &&
            this.length === simplex.length &&
            this.every((val, index) => val === simplex[index]);
    };
}
export { Simplex };