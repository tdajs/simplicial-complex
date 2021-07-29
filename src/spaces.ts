import { Complex } from "./complex";
import { Simplex } from "./simplex";

export class Spaces {
    static Sphere(dim: number = 2) {
        const vertices: any[] = [
            [0,0],
            [[1,0],[0,1]],
            [1,1]
        ];
        return new Complex(vertices)
            .add(new Simplex([0,1]))
            .add(new Simplex([1,2]))
            .add(new Simplex([0,2]));
    }

    static Torus(genus: number = 1) {

    }

    static MobiusBand() {
        
    }
}