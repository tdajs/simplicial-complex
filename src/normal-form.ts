class NormalForm {
    A: number[][];
    n: number; // rows
    m: number; // cols
    P: number[][];
    Q: number[][];
    diag: number[];
    D: number[][];
    
    constructor(mat: number[][],recordSteps: boolean = false) {
        if(mat && mat.length === 0)
            throw new Error('Matrix is empty.');
            
        for(let row of mat)
            if(row.length === 0 || row.length !== mat[0].length)
                throw new Error('Matrix is malformed.');

        if(isZero(mat))
            throw new Error('Matrix has all zero entries.');
            
        this.A = copyMat(mat);
        this.n = mat.length;
        this.m = mat[0].length;
        this.P = idMat(this.n);
        this.Q = idMat(this.m);
        this.diag = new Array<number>();
        this.D = mat;
        this.reduce( );

        //console.log(equalMatrix(multiplyMat( multiplyMat(this.S, this.D), this.T), this.A));
    }

    // Main reduction method
    private reduce( ) {
        let offset: number = 0;        
        
        while(offset < this.m && offset < this.n && !isZero(this.D,offset)) {
            let [i,j] = this.improvePivot(offset);
            this.movePivot([i,j],offset);
            this.diagonalizePivot(offset);
            
            this.diag.push(this.D[offset][offset]);
            offset++;
        }
    }

    private improvePivot(offset: number) {
        let i,j: number; // Pivot position

        while(true) {
            [i,j]  = minimalEntry(this.D, offset);
            // Position of the element non-divisible by pivot or false
            let position = isReducible([i,j], this.D, offset);
            if(!position)
                break;
            
            let [s,t] = position;
            if(j === t) {
                let q = - Math.floor(this.D[s][j] / this.D[i][j]);
                replaceRow(s, i, q, this.D, offset);
                replaceCol(i, s, - q, this.Q, 0); //
            }
            else if(i === s) {
                let q = - Math.floor(this.D[i][t] / this.D[i][j]);
                replaceCol(t, j, q, this.D, offset);
                replaceCol(t, j, q, this.P, 0); //
            }
            else {
                if(this.D[s][j] !== 0) {
                    let q = - Math.floor(this.D[s][j] / this.D[i][j]);
                    replaceRow(s, i, q, this.D, offset);
                    replaceCol(i, s, - q, this.Q, 0); //
                }
                
                replaceRow(i, s, 1, this.D, offset);
                replaceCol(s, i, - 1, this.Q, 0); //
                
                let q = - Math.floor(this.D[i][t] / this.D[i][j]);
                replaceCol(t, j, q, this.D, offset);
                replaceCol(t, j, q, this.P, 0); //
            }
        }
        return [i,j];
    }

    private movePivot([i,j]: [number,number], offset: number) {
        if(i !== offset) {
            exchangeRows(offset, i, this.D);
            exchangeCols(offset, i, this.Q); //
        }
        if(j !== offset) {
            exchangeCols(offset, j, this.D);
            exchangeCols(offset, j, this.P); //
        }
        if(this.D[offset][offset] < 0 ) {
            multiplyRow(offset, this.D);
            multiplyCol(offset, this.Q); //
        }
    }

    private diagonalizePivot(offset: number) {
        // Make offset col zero
        for(let i = offset + 1; i < this.n; i++) {
            if(this.D[i][offset] === 0)
                continue;
            let q = - Math.floor(this.D[i][offset] / this.D[offset][offset]);
            replaceRow(i, offset, q, this.D, offset);
            replaceCol(offset, i, - q, this.Q, 0); //
        }
    
        // Make offset row zero
        for(let j = offset + 1; j < this.m; j++) {
            if(this.D[offset][j] === 0)
                continue;
            let q = - Math.floor(this.D[offset][j] / this.D[offset][offset]);
            replaceCol(j,offset, q, this.D, offset);
            replaceCol(j,offset, q, this.P, 0); //
        }
    }
}
export { NormalForm };

function isZero(mat: number[][], offset: number = 0) {
    for(let i = offset; i <  mat.length; i++)
        for(let j = offset; j < mat[0].length; j++) {
            if(mat[i][j] !== 0)
            return false;
    }
    return true;    
}

function isReducible([s,t]: [number,number], mat: number[][], offset: number) {
    let alpha = Math.abs(mat[s][t]);
    for(let i = offset; i < mat.length; i++)
        for(let j = offset; j < mat[0].length; j++) {
            if(mat[i][j] % alpha !== 0) {
                return [i,j];
            }
        }
    return false;
}

function minimalEntry(mat: number[][], offset: number) {
    if(mat.length === offset)
        throw new Error('Matrix must be non-empty.');

    let min = Number.MAX_VALUE;
    let pos = new Array<number>(2);
        
    for(let i = offset; i < mat.length; i++) {
        if(mat[i].length === offset)
            throw new Error('Column must be non-empty.');
            
        for(let j = offset; j < mat[0].length; j++) {
            if(!Number.isInteger(mat[i][j]))
                throw new Error('Matrix can not have non-integer values.');
                
            let elm = mat[i][j];
            if(Math.abs(elm) > 0 && Math.abs(min) > Math.abs(elm)) {
                min = elm;
                pos = [i,j];
            }
        }
    }
        
    if(min === Number.MAX_VALUE)
        throw new Error('Matrix can not have all zeros.');
        
    return pos;
}
    
// Elementary operations
function replaceRow(i: number, k: number, q: number, mat: number[][], offset: number) {
    for(let j = offset; j < mat[0].length; j++)
        mat[i][j] += q * mat[k][j];
    
    return {
        operation: 'replaceRow',
        args: [i,k,q],
        output: copyMat(mat)
    };
}

function replaceCol(j: number, k: number, q: number, mat: number[][], offset: number) {
    for(let i = offset; i < mat.length; i++)
        mat[i][j] += q * mat[i][k];
    return {
        operation: 'replaceCol',
        args: [j,k,q],
        output: copyMat(mat)
    };
}

function exchangeRows(i: number, k: number, mat: number[][]) {
    let tmp = mat[i];
    mat[i] = mat[k];
    mat[k] = tmp;
    return {
        operation: 'exchangeRows',
        args: [i,k],
        output: copyMat(mat)
    };
}

function exchangeCols(j: number, k: number, mat: number[][]) {
    for(let i = 0; i < mat.length; i++) {
        let tmp = mat[i][j];
        mat[i][j] = mat[i][k];
        mat[i][k] = tmp;
    }
    return {
        operation: 'exchangeCols',
        args: [j,k],
        output: copyMat(mat)
    };
}

function multiplyRow(i: number, mat: number[][]) {
    mat[i] = mat[i].map(val => { return -val });
    return {
        operation: 'multiplyRow',
        args: [i],
        output: copyMat(mat)
    };
}

function multiplyCol(j: number, mat: number[][]) {
    for(let i = 0; i < mat.length; i++)
        mat[i][j] *= -1;

    return {
        operation: 'multiplyCol',
        args: [j],
        output: copyMat(mat)
    };
}

function idMat(size: number) {
    let mat = new Array<number[]>(size);
    for(let i = 0; i < size; i++) {
        let col = new Array<number>(size);
        for(let j = 0; j < size; j++)
            col[j] = 0;
        col[i] = 1;
        mat[i] = col;
    }
    return mat;
}

function copyMat(mat: number[][]) {
    return mat.map(col => {
        return col.slice();
    });
}

function printMat(mat: number[][]) {
    for(let row of mat)
        console.log(row.join(' '));
}

function multiplyMat(A: number[][], B: number[][]) {
    if(A[0].length !== B.length)
        throw new Error('Matrix dimension mismatch.');

    let prod = new Array<number[]>(A.length);
    for(let i = 0; i < A.length; i++) {
        prod[i] = new Array<number>(B[0].length);
    }

    for(let i = 0; i < A.length; i++)
        for(let j = 0; j < B[0].length; j++) {
            let sum = 0;  
            for(let k = 0; k < A[0].length; k++)
                sum += A[i][k] * B[k][j];
            prod[i][j] = sum;    
        }
    return prod;    
}

function equalMatrix(A: number[][], B: number[][]) {
    if(A.length !== B.length || A[0].length !== B[0].length) {
        return false;
    }

    for(let i = 0; i < A.length; i++)
        for(let j = 0; j < A[0].length; j++)
            if(A[i][j] !== B[i][j]) {
                console.log(A[i][j] + ':' + B[i][j]);
                return false;
            }
    return true;                
}