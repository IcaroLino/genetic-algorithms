import Individual from './models/Individual';
import objectiveFn from './objective/ObjectiveFn';

const objFn = {objectiveFunction: objectiveFn };
const min = [0, 0];
const max = [31, 31];
const decimalPrecision = 3;

Individual.setGroupParams(objFn, min, max, decimalPrecision);
const a = new Individual(2, 5);
const b = new Individual(2, 7);
const c = new Individual(2, 9);

console.log('a:', a);
console.log('b:', b);
console.log('c:', c);
