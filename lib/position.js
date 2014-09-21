/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

import {chan, go, putAsync, buffers, take} from 'jlongster/js-csp@0';

// Given the channel `input` that yields `TouchObject`s, this will
// return a that yields a pair of points `Point2` if two finger are currently
// active in the touch stream and will emit one `"end"` signaling an end.
export default function position(input) {
	var ch = chan(buffers.sliding(1));
	go(function* () {
		var active = [null, null];
		while (!input.closed) {
			var touchobj = yield take(input);
			// XXX: regenerator does not work with destructuring :-(
			//var {type, id, position} = touchobj;
			var type = touchobj.type, id = touchobj.id, position = touchobj.position;

			// ignore third finger
			if (id >= 2)
				continue;

			if (type !== 'touchend')
				active[id] = position;

			if (active[0] && active[1]) {
				// close the channel if both are active and this is a touchend
				if (type === 'touchend') {
					active[0] = active[1] = null;
					putAsync(ch, 'end');
				} else {
					// return a fresh object each time
					putAsync(ch, [active[0], active[1]]);
				}
			}
		}
	});
	return ch;
}

