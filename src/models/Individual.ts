import mutationType from '../enum/mutationType';
import ObjectiveFnInterface from '../interfaces/ObjectiveFunction';

export default class Individual {
    private _binaryPosition: number[][];
    private _position: number[];
    private _objectiveValue: number;

    private static _objectiveFunction: ObjectiveFnInterface;
    private static _minPosition: number[];
    private static _maxPosition: number[];
    private static _decimalPrecision: number;
    private static _mutationType: mutationType;
    private static _mutationRate: number;

    constructor(dimensions: number, individualLength: number) {
        this._binaryPosition = new Array(dimensions).fill(undefined);
        this._binaryPosition = this._binaryPosition.map(() => {
            const genes = new Array(individualLength).fill(undefined);
            return genes.map(() => Math.random() < 0.5 ? 0 : 1);
        });

        this._position = this.normalize(this._binaryPosition);
        this._objectiveValue = Individual._objectiveFunction.objectiveFunction(...this._position);
    }

    private getDecimalCoordinate(binaryCoordinate: number[]): number {
        const binaryCoordinateCopy = [...binaryCoordinate];
        return binaryCoordinateCopy.reverse().reduce((acc, cur, index) => acc + cur * Math.pow(2, index));
    }

    private normalizeDecimalCoordinate(decimalCoordinate: number, coordinateIndex: number, binaryLength: number): number {
        return Number(
            (
                Individual._minPosition[coordinateIndex] +
                (Individual._maxPosition[coordinateIndex] - Individual._minPosition[coordinateIndex])
                * (decimalCoordinate / (Math.pow(2, binaryLength) - 1))
            ).toFixed(Individual._decimalPrecision)
        );
    }

    private normalize(binaryPosition: number[][]): number[]{
        const binaryLength = binaryPosition[0].length;
        const decimal = binaryPosition.map((coordinate) => this.getDecimalCoordinate(coordinate));
        return decimal.map((coordinate, index) => this.normalizeDecimalCoordinate(coordinate, index, binaryLength));
    }

    private geneMutation(mutationRate: number): number[][] {
        const mutationRatePercentage = mutationRate / 100;
        return this._binaryPosition.map((coordinate) => coordinate.map((gene) => {
            if (Math.random() < mutationRatePercentage) return (gene === 0 ? 1 : 0);
            return gene;
        }));
    }

    private individualMutation(mutationRate: number): number[][] {
        const mutationRatePercentage = mutationRate / 100;
        if (Math.random() < mutationRatePercentage) {
            const coordinate = Math.floor(Math.random() * this._binaryPosition.length);
            const gene = Math.floor(Math.random() * this._binaryPosition[coordinate].length);
            this._binaryPosition[coordinate][gene] = this._binaryPosition[coordinate][gene] === 0 ? 1 : 0;
            return this._binaryPosition;
        }
        return this._binaryPosition;
    }

    public updateIndividual(binaryParent1: number[][], binaryParent2: number[][], crossoverPoint: number, index: number): void {
        let coordPrefix;
        let coordSuffix;
        binaryParent1.forEach((coordinate, j) => {
            if (index % 2 === 0) {
                coordPrefix = coordinate.slice(0, crossoverPoint);
                coordSuffix = binaryParent2[j].slice(crossoverPoint);
            } else {
                coordPrefix = binaryParent2[j].slice(0, crossoverPoint);
                coordSuffix = coordinate.slice(crossoverPoint);
            }
            this._binaryPosition[j] = coordPrefix.concat(coordSuffix);
        });

        if (Individual._mutationType === mutationType.perGene) this._binaryPosition = this.geneMutation(Individual._mutationRate);
        else this._binaryPosition = this.individualMutation(Individual._mutationRate);

        this._position = this.normalize(this._binaryPosition);
        this._objectiveValue = Individual._objectiveFunction.objectiveFunction(...this._position);
    }

    public get binaryPosition() {
        return this._binaryPosition;
    }

    public get objectiveValue() {
        return this._objectiveValue;
    }

    public static setGroupParams(
        objectiveFn: ObjectiveFnInterface,
        minPosition: number[],
        maxPosition: number[],
        decimalPrecision: number,
        mutationType: mutationType,
        mutationRate: number
    ) {
        Individual._objectiveFunction = objectiveFn;
        Individual._minPosition = minPosition;
        Individual._maxPosition = maxPosition;
        Individual._decimalPrecision = decimalPrecision;
        Individual._mutationType = mutationType;
        Individual._mutationRate = mutationRate;
    }
}
