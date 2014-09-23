/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

import prop from 'component/transform-property@0';

// Returns a new function that will apply the `Transform`s to `el`.
export default function apply(el) {
	return function (transform) {
		if (transform === 'end') {
			el.classList.remove('pinch-active');
			return;
		}
		el.classList.add('pinch-active');
		var {translate: [x, y], scale, rotate} = transform;
		el.style[prop] = 'translate(' + x + 'px, ' + y + 'px) ' +
		                 'rotate(' + (rotate * 180 / Math.PI) + 'deg) ' +
		                 'scale(' + scale + ')';
	};
};

