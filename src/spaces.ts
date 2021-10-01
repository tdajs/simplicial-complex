import { Complex } from "./complex";
import { Simplex } from "./simplex";

export class Spaces {
    static Cylinder() {
        const vertices: any[] = [
            [
                { v: [-15,-5], l: "a"},
                { v: [15,-5], l: "a"}
            ],
            [{ v: [-5,-5], l: "b"}],
            [{ v: [5,-5], l: "c"}],
            [{ v: [-5,5], l: "d"}],
            [{ v: [5,5], l: "e"}],
            [
                { v: [-15,5], l: "f"},
                { v: [15,5], l: "f"}
            ]
        ];

        const edges = [
            [{v: [[-15,-5],[-5,-5]], l: "ab"}]
        ];

        const complex = new Complex()
            .add(new Simplex([0,1,3]))
            .add(new Simplex([1,2,3]))
            .add(new Simplex([2,3,4]))
            .add(new Simplex([0,2,4]))
            .add(new Simplex([0,4,5]))
            .add(new Simplex([0,3,5]))
        ;

            return [complex, edges,[]]
    }

    static Sphere(dim: number = 2) {
        const vertices: any[] = [
            { v: [[-10,10],[10,-10]], l: "e_0"},
            { v: [[-10,-10]], l: "e_1"},
            { v: [[10,10]], l: "e_2"},
            { v: [[0,0]], l: "e_3"}
        ];

        const complex = new Complex()

        
        return [complex, [], this.triangles(complex)];
    }

    static Torus(genus: number = 1) {

    }

    static MobiusBand() {
        
    }


    static triangles(complex: Complex) {
        return [];
    }
}