/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

// given two sets of points, a1, b1 and a2, b2, output the transform components
// to transform a1 to a2 and b1 to b2
// ```
// Vec2: [x: Number, y: Number]
// Point2: [a: Vec2, b: Vec2]
// Transform: {
//   translate: [x: Number, y:Number],
//   scale: Number,
//   rotate: Number
// }
// 
// fn (from: Point2, to: Point2) => Transform
// ```
export default function toTransform([a1, b1], [a2, b2]) {
	var mid1 = mid(a1, b1), mid2 = mid(a2, b2);
	var translate = [mid2[0] - mid1[0], mid2[1] - mid1[1]];
	var scale = distance(a2, b2) / distance(a1, b1);
	var rotate = angle(a2, b2) - angle(a1, b1);

	return {
		translate,
		scale,
		rotate,
	};
};

function distance([x1, y1], [x2, y2]) {
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function angle([x1, y1], [x2, y2]) {
	return Math.atan2(y2 - y1, x2 - x1);
}

function mid([x1, y1], [x2, y2]) {
	return [(x1 + x2) / 2, (y1 + y2)/ 2];
}

