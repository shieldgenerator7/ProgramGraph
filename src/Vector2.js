class Vector2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	add(v){
		return new Vector2(this.x+v.x, this.y+v.y);
	}

	subtract(v){
		return new Vector2(this.x-v.x, this.y-v.y);
	}

	scale(m){
		return new Vector2(this.x*m, this.y*m);
	}

	toString(){
		return "("+this.x+", "+this.y+")";
	}
}
