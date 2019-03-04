class Ball {
    constructor(pos, r, mass=10) {
        this.pos = pos;
        this.rad = r;
        let X = Math.random()/200;
        let Y = Math.random()/200;
        let Z = Math.random()/200;
        this.vel = {X, Y, Z};
        this.acc = {X:0, Y:0, Z:0};
        this.G = .9;
        this.mass = mass;
    }

    getData() {
        return [this.pos.X, this.pos.Y, this.pos.Z, this.rad];
    }
    
    applyForce(f) {
        let tempAcc = {X: f.X/this.mass, Y: f.Y/this.mass, Z: f.Z/this.mass}
        this.acc = tempAcc;
    }

    update() {

        this.vel.X += this.acc.X;
        this.vel.Y += this.acc.Z;
        this.vel.Y += this.acc.Z;


        

        this.pos.X += this.vel.X;
        this.pos.Y += this.vel.Y;
        this.pos.Z += this.vel.Z;
    }

    attract(ball) {
        let force = this._sub(this.pos, ball.pos);
        let distance = this._dist(ball.pos);
        
        force = {X: force.X/distance, Y: force.Y/distance, Z: force.Z/distance};

        let strength = (this.G * this.mass * ball.mass) / Math.pow(distance, 2);


        strength = strength % 1;

        strength /= 200;


        return {X: force.X*strength, Y: force.Y*strength, Z: force.Z*strength}
    }

    checkBoundary() {
        if (this.pos.X  >= 1. - this.rad) {
           this.pos.X = 1. - this.rad;
           this.vel.X *= -1;
        } else if (this.pos.X <= -1 + this.rad) {
           this.pos.X =  -1 + this.rad;
           this.vel.X *= -1;
        } else if (this.pos.Y <=  -1 + this.rad) {
           this.pos.Y =  -1 + this.rad;
           this.vel.Y *= -1;
        } else if (this.pos.Y >= 1. - this.rad) {
           this.pos.Y = 1. - this.rad;
           this.vel.Y *= -1;
        } else if (this.pos.Z >= 2. - this.rad) {
            this.pos.Z = 2. - this.rad;
            this.vel.Z *= -1;
        } else if (this.pos.Z <= -2. + this.rad) {
            this.pos.Z =  -2. + this.rad;
            this.vel.Z *= -1;
        }
    }

    checkBounce(ball) {
        if (this._dist(ball.pos) <= this.rad + ball.rad) {
            let tempAcc = this.acc;
            this.acc = ball.acc;
            ball.acc = tempAcc;
            let temp = this.vel;
            this.vel = ball.vel;
            ball.vel = temp;
        }
    }

    _dist(pos) {
        return Math.sqrt(Math.pow((this.pos.X - pos.X), 2) + Math.pow((this.pos.Y - pos.Y), 2) + Math.pow((this.pos.Z - pos.Z), 2));
    }

    _sub(vec1, vec2) {
        let X = vec1.X - vec2.X;
        let Y = vec1.Y - vec2.Y;
        let Z = vec1.Z - vec2.Z;
        return {X, Y, Z};
    }
}