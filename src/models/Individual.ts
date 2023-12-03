import ObjectiveFnInterface from '../interfaces/ObjectiveFunction';

export default class Individual {
    private _binaryPosition: number[][];
    private _position: number[];
    private _functionValue: number;

    private static _objectiveFunction: ObjectiveFnInterface;
    private static _minPosition: number[];
    private static _maxPosition: number[];
    private static _decimalPrecision: number;

    constructor(dimensions: number, individualLength: number) {
        this._binaryPosition = new Array(dimensions).fill(undefined);
        this._binaryPosition = this._binaryPosition.map(() => {
            const genes = new Array(individualLength).fill(undefined);
            return genes.map(() => Math.random() < 0.5 ? 0 : 1);
        });

        this._position = this.normalize(this._binaryPosition);
        this._functionValue = Individual._objectiveFunction.objectiveFunction(...this._position);
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

    public static setGroupParams(objectiveFn: ObjectiveFnInterface, minPosition: number[], maxPosition: number[], decimalPrecision: number) {
        Individual._objectiveFunction = objectiveFn;
        Individual._minPosition = minPosition;
        Individual._maxPosition = maxPosition;
        Individual._decimalPrecision = decimalPrecision;
    }
}
