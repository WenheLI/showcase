class Vector {
    constructor(input) {
        this.vec = input;
        this.length = this.vec.length;
    }

    add(vec) {
        let temp = [];
        if (typeof vec === 'number') temp = this.vec.map((it) => it + vec);
        else if (Array.isArray(vec) && this.length == vec.length) temp = this.vec.map((it, index) => it + vec[index])
        else throw new Error("Wrong vec either length or type");
        return new Vector(temp);
    }

    sub(vec) {
        let temp = [];
        if (typeof vec === 'number') temp = this.vec.map((it) => it - vec);
        else if (Array.isArray(vec) && this.length == vec.length) temp = this.vec.map((it, index) => it - vec[index])
        else throw new Error("Wrong vec either length or type");
        return new Vector(temp);
    }

    div(vec) {
        let temp = [];
        if (typeof vec === 'number') temp = this.vec.map((it) => it / vec);
        else throw new Error("Wrong vec either length or type");
        return new Vector(temp);
    }

    mul(vec) {
        let temp = [];
        if (typeof vec === 'number') temp = this.vec.map((it) => it * vec);
    }
}