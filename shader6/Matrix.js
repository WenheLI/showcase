class Mat4 {
    constructor() {
        this.IDENTITY = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
<<<<<<< HEAD
        this.stacks = [];
=======
        this.stacks = [this.__deepCopy(this.IDENTITY)];
>>>>>>> 163c2c244e56d084b49999f470c882b0738a2cd2
        this.sp = 0;
    }

    value() {
        return this.stacks[this.sp].reduce((prev, curr) => prev.concat(curr), []);
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

    scale(...numOrArr) {
        const tempMatrix = this.__deepCopy(this.IDENTITY);

        if (numOrArr.length === 1) numOrArr = numOrArr[0];

        if (Array.isArray(numOrArr) && numOrArr.length === 3) numOrArr.forEach((it, index) => tempMatrix[index][index] = it);
        else if (typeof numOrArr === 'number') [0, 1, 2].forEach((it) => tempMatrix[it][it] = numOrArr);
        else throw new Error("Should only be matrix or number type");
        this.__mul(tempMatrix);
        return this.stacks[this.sp];

    }

    rotateX(theta) {
        if (typeof theta === 'number') {
            const tempMatrix = this.__deepCopy(this.IDENTITY);
            const c = Math.cos(theta);
            const s = Math.sin(theta);
            tempMatrix[1][1] = c;
            tempMatrix[1][2] = s;
            tempMatrix[2][1] = -s;
            tempMatrix[2][2] = c;
            this.__mul(tempMatrix);
        } else throw new Error("Should only be matrix or number type");
        return this.stacks[this.sp];
    }

    rotateY(theta) {
        if (typeof theta === 'number') {
            const tempMatrix = this.__deepCopy(this.IDENTITY);
            const c = Math.cos(theta);
            const s = Math.sin(theta);
            tempMatrix[0][0] = c;
            tempMatrix[0][2] = -s;
            tempMatrix[2][0] = s;
            tempMatrix[2][2] = c;
            this.__mul(tempMatrix);
        } else throw new Error("Should only be matrix or number type");
        return this.stacks[this.sp];
    }

    rotateZ(theta) {
        if (typeof theta === 'number') {
            const tempMatrix = this.__deepCopy(this.IDENTITY);
            const c = Math.cos(theta);
            const s = Math.sin(theta);
            tempMatrix[0][0] = c;
            tempMatrix[0][1] = s;
            tempMatrix[1][0] = -s;
            tempMatrix[1][1] = c;
            this.__mul(tempMatrix);
        } else throw new Error("Should only be matrix or number type");
        return this.stacks[this.sp];
    }

    identity() {
        return this.stacks[this.sp] = this.__deepCopy(this.IDENTITY);
    }

    save() {
        this.stacks[++this.sp] = this.__deepCopy(this.stacks[this.sp-1]);
    }

    restore() {
        this.sp --;
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

