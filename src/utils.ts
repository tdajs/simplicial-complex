export function choose<T>(arr: T[], k: number, offset: number = 0) {
    if(k > arr.length)
        throw new Error('k is larger than number of elements.');
        
    if(k === arr.length)
        return [arr];

    let result = Array<T[]>();
    for(let i = offset; i < arr.length; i++)
        result = choose(arr.slice(0,i).concat(arr.slice(i+1)),k,i).concat(result)

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