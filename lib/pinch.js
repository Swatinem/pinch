/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

import {chan, go, put, putAsync, take} from 'jlongster/js-csp@0';
import ease from 'component/ease@1';
import toTransform from 'totransform';
import position from 'position';
import apply from 'apply';
import {listen} from 'touchstream';

// Given a channel of `TouchObject`s, this will puts all the
// logic together and yields `Transform`s to be applied to `el`.
// This channel will emit at most one value each `raf`.
export function transforms(input, raf) {
	var duration = 500;

	var posch = position(input);

	var ch = chan();
	go(function* () {
		while (!input.closed) {
			var transform = yield* touchloop();
			if (transform)
				yield* snapback(transform);
		}
	});
	return ch;

	function* snapback(transform) {
		var start = yield take(raf);
		var time, next = start;
		do {
			time = next;
			var factor = ease.linear(Math.min(time - start, duration) / duration);
			putAsync(ch, {
				translate: [
				        transform.translate[0] + (0 - transform.translate[0]) * factor,
				        transform.translate[1] + (0 - transform.translate[1]) * factor,
				],
				scale:  transform.scale        + (1 - transform.scale       ) * factor,
				rotate: transform.rotate       + (0 - transform.rotate      ) * factor
			});
			next = yield take(raf);
		} while (time < start + duration);
		putAsync(ch, 'end');
	}

	function* touchloop() {
		var init = yield take(posch);
		var transform;
		while (true) {
			yield take(raf);
			var pos = yield take(posch);
			if (pos === 'end') return transform;
			transform = toTransform(init, pos);
			putAsync(ch, transform);
		}
	}
};

export function pinch(el) {
	apply(el, transforms(listen(el), raf));
};

var raf = chan();
function putraf() {
	requestAnimationFrame(function (time) {
		putAsync(raf, time, putraf);
	});
}
putraf();
