import mutationType from './enum/mutationType';
import Population from './models/Population';
import objectiveFn from './objective/ObjectiveFn';
import * as fs from 'fs';

const objFn = { objectiveFunction: objectiveFn };
const min = [-500, 500];
const max = [500, 500];
const decimalPrecision = 2;
const mttType = mutationType.perINDIVIDUAL;
const mutationRate = 5;

Population.setPopulationParams(objFn, min, max, decimalPrecision, mttType, mutationRate);

const populationLength = 30;
const dimensions = min.length;
const individualLength = 18;
const generations = 100;

const ag = new Population(populationLength, dimensions, individualLength, generations);
ag.printMetricsHistory(decimalPrecision);

try {
    fs.writeFile('population.txt', ag.getGroupLog, (err) => {
        if (err) throw new Error('File writing Erro:', err);
    });
} catch (e) {
    console.error((e as Error).message);
}
