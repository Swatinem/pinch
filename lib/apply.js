/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

import prop from 'component/transform-property@0';
import {chan, go, put, take} from 'jlongster/js-csp@0';

// Apply the `Transform`s coming from `ch` to `el`.
export default function apply(el, ch) {
	go(function* () {
		while (!ch.closed) {
			var transform = yield take(ch);
			if (transform === 'end') {
				el.classList.remove('pinch-active');
				continue;
			}
			el.classList.add('pinch-active');
			// XXX: regenerator does not work with destructuring :-(
			//var {translate: [x, y], scale, rotate} = transform;
			var x = transform.translate[0], y = transform.translate[1],
			    scale = transform.scale, rotate = transform.rotate;
			el.style[prop] = 'translate(' + x + 'px, ' + y + 'px) ' +
			                 'rotate(' + (rotate * 180 / Math.PI) + 'deg) ' +
			                 'scale(' + scale + ')';
		}
	});
};

