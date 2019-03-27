class Matrix {
    constructor(input) {
        this.value = input; // [[], [], [], []]
    }

    add(matrix) {
        if(matrix instanceof Matrix) return this.value.map((vec, i) => vec.map((scala, j) => scala + matrix[i][j]));
        else if (typeof matrix === 'number') return this.value.map((vec) => vec.map((scale) => scale + matrix));
        else throw new Error("Should only be matrix or number type");
    }

    sub(matrix) {
        if(matrix instanceof Matrix) return this.value.map((vec, i) => vec.map((scala, j) => scala - matrix[i][j]));
        else if (typeof matrix === 'number') return this.value.map((vec) => vec.map((scale) => scale + matrix));
        else throw new Error("Should only be matrix or number type");
    }

    div(num) {
        if (typeof num === 'number') return this.value.map((vec) => vec.map((scale) => scale / num));
        else throw new Error("Should only be number type");
    }

    mul(matrix) {
        if (typeof num === 'number') return this.value.map((vec) => vec.map((scale) => scale * num));
        else if (matrix instanceof Matrix) return this.value.map((vec, i) => vec.map((scala, j) => scala * matrix[j][i]));
        else throw new Error("Should only be matrix or number type");
    }
}

