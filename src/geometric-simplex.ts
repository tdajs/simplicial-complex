import { Simplex } from ".";

export class GeometricSimplex extends Simplex {
    options: any;
    constructor(simplex: Simplex, opts: any) {
        super(simplex);
        this.options = opts;
    }
}