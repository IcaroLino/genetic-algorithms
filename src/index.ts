import mutationType from './enum/mutationType';
import Group from './models/Group';
import objectiveFn from './objective/ObjectiveFn';
import * as fs from 'fs';

const objFn = { objectiveFunction: objectiveFn };
const min = [-500, 500];
const max = [500, 500];
const decimalPrecision = 2;
const mttType = mutationType.perINDIVIDUAL;
const mutationRate = 5;

Group.setGroupParams(objFn, min, max, decimalPrecision, mttType, mutationRate);

const groupLength = 30;
const dimensions = min.length;
const individualLength = 18;
const generations = 60;

const ag = new Group(groupLength, dimensions, individualLength, generations);
ag.printMetricsHistory(decimalPrecision);

try {
    fs.writeFile('group.txt', ag.getGroupLog, (err) => {
        if (err) throw new Error('File writing Erro:', err);
    });
} catch (e) {
    console.error((e as Error).message);
}
