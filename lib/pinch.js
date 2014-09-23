/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

import {chan, go, put, putAsync, take} from 'jlongster/js-csp@0';
import ease from 'component/ease@1';
import toTransform from 'totransform';
import positions from 'positions';
import apply from 'apply';

// Given a `positions` channel that yields a pair of points `Point2` or "end",
// and a `raf` channel that yields one value every animation frame, this will
// put all the logic together and yield transforms that can be applied to an
// element.
export function transform(positions, raf, apply) {
	var duration = 500;

	go(function* () {
		while (!positions.closed) {
			var transform = yield* touchloop();
			if (transform)
				yield* snapback(transform);
		}
	});

	function* snapback(transform) {
		var start = yield take(raf);
		var time, next = start;
		do {
			time = next;
			var factor = ease.linear(Math.min(time - start, duration) / duration);
			apply({
				translate: [
				        transform.translate[0] + (0 - transform.translate[0]) * factor,
				        transform.translate[1] + (0 - transform.translate[1]) * factor,
				],
				scale:  transform.scale        + (1 - transform.scale       ) * factor,
				rotate: transform.rotate       + (0 - transform.rotate      ) * factor
			});
			next = yield take(raf);
		} while (time < start + duration);
		apply('end');
	}

	function* touchloop() {
		var init = yield take(positions);
		var transform;
		while (true) {
			var pos = yield take(positions);
			if (pos === 'end') return transform;
			yield take(raf);
			transform = toTransform(init, pos);
			apply(transform);
		}
	}
};

export function pinch(el) {
	transform(positions(el), raf, apply(el));
};

var raf = chan();
function putraf() {
	requestAnimationFrame(function (time) {
		putAsync(raf, time, putraf);
	});
}
putraf();

