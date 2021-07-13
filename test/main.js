const sc = require('../dist/index');
c = new sc.Complex();
c.addSimplex(new sc.Simplex([0,1]));
console.log(c);