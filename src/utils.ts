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

export function rips(vertices: number[][], scale: number, max_dim?: number){
    max_dim = max_dim || vertices.length - 1;

    const complex = new Complex(vertices.length);
    const idxSet = vertices.map( (e, i) => i);
    let dim = 0;

    while(dim < max_dim && dim < complex.n - 1 && complex.simplices[dim] 
            && complex.simplices[dim].length !== 0) {
        dim += 1;

        combinations(idxSet, dim + 1)
        .filter(combo => diameter(combo.map(idx => vertices[idx])) < scale)
        .forEach(combo => complex.add(new Simplex(combo)));
    }
    return complex; 
}

export function diameter(set: number[][]) {
    return combinations(set, 2).reduce((prev, current) => 
        Math.max(prev, dist(current[0], current[1])), -Infinity);
}

export function combinations(set: any[], k: number) {
    let i, j, head, tailcombs;
    const combs: any[][] = [];

    if (k > set.length || k <= 0) {
	return [];
    }
    if (k == set.length) {
	return [set];
    }
    if (k == 1) {
	for (i = 0; i < set.length; i++) {
	    combs.push([set[i]]);
	}
	return combs;
    }
    for (i = 0; i < set.length - k + 1; i++) {
	head = set.slice(i, i + 1);
	tailcombs = combinations(set.slice(i + 1), k - 1);
	for (j = 0; j < tailcombs.length; j++) {
	    combs.push(head.concat(tailcombs[j]));
	}
    }
    return combs;
}
