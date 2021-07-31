class Simplex {    
    vSet: number[];
    label?: string;


    constructor(vSet: number[], 
        opts?: {label?: string}) {        
        
        if(vSet.length === 0)
            throw new Error('bad simplex.');
        
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