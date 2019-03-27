class Matrix {
    constructor() {
        this.IDENTITY = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
        this.stacks = [this.IDENTITY];
        this.sp = 0;
    }

    translate(...numOrArr) {
        const tempMatrix = this.__deepCopy(this.IDENTITY);
        
        if (numOrArr.length === 1) numOrArr = numOrArr[0];

        if (Array.isArray(numOrArr) && numOrArr.length === 3) tempMatrix[3] = [...numOrArr, 1];
        else if (typeof numOrArr === 'number') tempMatrix[3] = [numOrArr, numOrArr, numOrArr, 1];
        else throw new Error("Should only be matrix or number type");
        this.__mul(tempMatrix);
        return this.stacks[this.sp];
    }


    __deepCopy(matrix) {
        const temp = [];
        matrix.forEach((it) => temp.push(it.concat()));
        return temp;
    }

    __add(matrix) {
        let value = this.stacks[this.sp];
        if( Array.isArray(matrix) && matrix.length == 4 ) value = value.map((vec, i) => vec.map((scala, j) => scala + matrix[i][j]));
        else if (typeof matrix === 'number') value = value.map((vec) => vec.map((scale) => scale + matrix));
        else throw new Error("Should only be matrix or number type");
        this.stacks[this.sp] = value;
        return value;
    }

    __sub(matrix) {
        let value = this.stacks[this.sp];
        if(Array.isArray(matrix) && matrix.length == 4) value = value.map((vec, i) => vec.map((scala, j) => scala - matrix[i][j]));
        else if (typeof matrix === 'number') value = value.map((vec) => vec.map((scale) => scale - matrix));
        else throw new Error("Should only be matrix or number type");
        this.stacks[this.sp] = value;
        return value;
    }

    __div(num) {
        let value = this.stacks[this.sp];
        if (typeof num === 'number') value = value.map((vec) => vec.map((scale) => scale / num));
        else throw new Error("Should only be number type");
        this.stacks[this.sp] = value;
        return value;
    }

    __mul(matrix) {
        let value = this.stacks[this.sp];
        if (typeof matrix === 'number') value = value.map((vec) => vec.map((scale) => scale * matrix));
        else if (Array.isArray(matrix) && matrix.length == 4) value = value.map((vec) => vec.map((scala, i) => vec.reduce((sum, curr, j) => sum + curr*matrix[j][i], 0)));
        else throw new Error("Should only be matrix or number type");
        this.stacks[this.sp] = value;
        return value;
    }
}

