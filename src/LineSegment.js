"use strict";

class LineSegment{
    constructor(v1, v2){
        this.v1 = v1;
        this.v2 = v2;
    }

    //2021-11-05: copied from http://paulbourke.net/geometry/pointlineplane/javascript.txt
    // line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
    // Determine the intersection point of two line segments
    // Return FALSE if the lines don't intersect
    intersectionPoint(segment){
        let x1 = this.v1.x;
        let y1 = this.v1.y;
        let x2 = this.v2.x;
        let y2 = this.v2.y;
        let x3 = segment.v1.x;
        let y3 = segment.v1.y;
        let x4 = segment.v2.x;
        let y4 = segment.v2.y;
        // Check if none of the lines are of length 0
        if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
            return false;
        }

        let denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

        // Lines are parallel
        if (denominator === 0) {
            return false;
        }

        let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
        let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

        // is the intersection along the segments
        if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
            return false;
        }

        // Return a object with the x and y coordinates of the intersection
        let x = x1 + ua * (x2 - x1);
        let y = y1 + ua * (y2 - y1);

        return new Vector2(x, y);
    }
}
