/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

import {chan, go, putAsync, take, buffers} from 'jlongster/js-csp@0';
import listen as listenel from 'listen';

// Given a channel of `TouchEvent`s, this returns a new channel with
// `TouchObject` objects.
// ```
// TouchObject: {
//   type: 'touchstart' | 'touchmove' | 'touchend',
//   id: Number,
//   position: Vec2
// }
// ```
export function process(input) {
	var ch = chan();
	go(function* () {
		while (!input.closed) {
			var ev = yield take(input);
			var type = ev.type;
			if (type === 'touchcancel')
				type = 'touchend';
			for (var i = 0; i < ev.changedTouches.length; i++) {
				var t = ev.changedTouches[i];
				var id = parseInt(t.identifier, 10);
				var position = [t.pageX, t.pageY];
				putAsync(ch, {type, id, position});
			}
		}
		ch.close();
	});
	return ch;
};

// listen to touch events on `el` and provide a processed channel
export function listen(el) {
	var ch = chan();
	listenel(el, 'touchstart', ch);
	listenel(document.body, 'touchmove', ch);
	listenel(document.body, 'touchend', ch);
	listenel(document.body, 'touchcancel', ch);
	return process(ch);
}

