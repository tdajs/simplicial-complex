import { copyMat } from "@tdajs/normal-form/dist/utils";
import { Complex } from "./complex";
import { Simplex } from "./simplex";

export function choose<T>(arr: T[], k: number, offset: number = 0) {
    if(k > arr.length)
        throw new Error('k is larger than number of elements.');
        
    if(k === arr.length)
        return [arr];

    let result = Array<T[]>();
    for(let i = offset; i < arr.length; i++)
        result = choose(arr.slice(0,i).concat(arr.slice(i+1)),k,i).concat(result);

    return result;
}
export function dist(p1: number[], p2: number[]) {
    if(p1.length !== p2.length)
        throw new Error('Dimension mismatch.');

    let dist = 0;
    for(let i = 0; i < p1.length; i++) {
        dist += (p1[i] - p2[i]) * (p1[i] - p2[i]);
    }
    return Math.sqrt(dist);
}

export function rips(vertices: number[][], scale: number, distMat?: number[][]){
    if(!distMat) {
        distMat = Array(vertices.length).fill(0).map( (r,i) => {
            return Array(vertices.length).fill(0).map( (c,j) => {
                return dist(vertices[i], vertices[j]);
            });
        });
    }

    const complex = new Complex(vertices.length);
    
    for(let i = 0; i < distMat.length; i++) {
        for(let j = 0; j < i; j++) {
            if(distMat[i][j] <= scale) {
                complex.add(new Simplex([i,j]));
            }
        }
    }

    const idxSet = vertices.map( (e, i) => i);
    let dim = 1;

    while(dim < complex.n - 1 && complex.simplices[dim] 
            && complex.simplices[dim].length !== 0) {
        dim += 1;

        const simplices = choose(idxSet, dim + 1).map(vSet => new Simplex(vSet));        
        simplices.forEach( simplex => {
            if( simplex.faces.every( f => complex.findIndex(f) !== -1) )
                complex.add(simplex);
        });
    }
    return complex; 
}