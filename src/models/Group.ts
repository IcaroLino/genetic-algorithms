import Individual from './Individual';

export default class Group {

    private _group: Individual[];
    private _groupLog: string[][] = [];
    private _metrics: { highestValue: number; average: number, position: number[] }[] = [];

    constructor(groupLength: number, dimensions: number, individualLength: number, generations: number) {
        this._group = new Array(groupLength).fill(undefined).map(() => new Individual(dimensions, individualLength));
        this._groupLog.push(this._group.map((individual) => JSON.stringify(individual)));
        this._metrics.push(this.getMetrics());

        for (let i = 0; i < generations; i++) {
            const binaryPositionsArray = this._group.map((individual) => individual.binaryPosition.slice());
            const probabilitiesArray = this.getPopProbabilityArray();
            const crossoverPoint = Math.floor((this._group[0].binaryPosition[0].length - 1) * Math.random()) + 1;
            let parent1: number[][];
            let parent2: number[][];

            this._group.forEach((individual, j) => {
                if (j % 2 === 0) {
                    parent1 = this.selectParents(probabilitiesArray, binaryPositionsArray);
                    parent2 = this.selectParents(probabilitiesArray, binaryPositionsArray);
                }
                individual.updateIndividual(parent1, parent2, crossoverPoint, j);
            });

            this._groupLog.push(this._group.map((individual) => JSON.stringify(individual)));
            this._metrics.push(this.getMetrics());
        }
    }

    private correctionFactor(objectiveValueArray: number[]): number {
        const factor = objectiveValueArray.filter((v) => v < 0).sort((a, b) => a - b).shift();
        return factor ? -1 * factor : 0;
    }

    private getPopProbabilityArray(): number[] {
        const factor = this.correctionFactor(this._group.map((individual) => individual.objectiveValue));
        const total = this._group.reduce((acc, cur) => acc + cur.objectiveValue, this._group.length * factor);
        return this._group.map((individual) => (individual.objectiveValue + factor) / total);
    }

    private selectParents(probabilitiesArray: number[], group: number[][][]): number[][] {
        const parentDrawn = Math.random();
        let probabilityValue = 0;
        let selectedIndex = probabilitiesArray.length - 1;

        for (let index = 0; index < probabilitiesArray.length; index++) {
            probabilityValue = probabilityValue + probabilitiesArray[index];
            if (parentDrawn < probabilityValue) {
                selectedIndex = index;
                break;
            }
        }
        return group[selectedIndex];
    }

    private getMetrics(): { highestValue: number; average: number, position: number[] } {
        const total = this._group.reduce((acc, cur) => acc + cur.objectiveValue, 0);
        const average =  total / this._group.length;

        let highestValue = this._group[0].objectiveValue;
        let highestIndex = 0;

        this._group.forEach((individual, index) => {
            if (individual.objectiveValue > highestValue) {
                highestValue = individual.objectiveValue;
                highestIndex = index;
            }
        });

        return { highestValue, average, position: this._group[highestIndex].position };
    }

    public get getGroupLog(): string {
        return this._groupLog.map((row, gen) => `Generation ${gen} \n`
            + row.map((individual, id) => `Individual ${id}: ` + individual).join('\n')).join('\n');
    }

    public printMetricsHistory(decimalPrecision: number): void {
        this._metrics.forEach((history, gen) => {
            console.log(`Generation ${gen}: (Position) ${history.position.map((h) => ' ' + h.toFixed(decimalPrecision))} | `
                + `(Highest Value) ${history.highestValue.toFixed(decimalPrecision)} | `
                + `(Average): ${history.average.toFixed(decimalPrecision)}`);
        });
    }
}
