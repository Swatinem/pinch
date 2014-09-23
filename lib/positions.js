/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

import {chan, putAsync, buffers} from 'jlongster/js-csp@0';

var map = [].map;

// Given an element `el`, this will return a channel that yields a pair of
// points `Point2` or an "end" when the touch ended for those two points.
// The channel has a slider buffer with 1 element, so it will only retain the
// most recent positions.
export default function positions(el) {
	el.addEventListener('touchstart', handler);
	el.addEventListener('touchmove', handler);
	el.addEventListener('touchend', handler);
	el.addEventListener('touchcancel', handler);

	var tracking = null;

	var ch = chan(buffers.sliding(1));
	return ch;

	function handler(ev) {
		ev.preventDefault();

		if (!tracking) {
			// figure out the ids we are going to be tracking
			if (ev.type === 'touchstart' && ev.touches.length >= 2) {
				tracking = map.call(ev.touches, t => t.identifier);
			} else {
				return;
			}
		}

		var touches = tracking.map(id => ev.touches.identifiedTouch(id));
		if (!touches.every(t => t)) {
			// not all our tracked touches are active any more, emit an "end"
			tracking = null;
			return putAsync(ch, 'end');
		}

		putAsync(ch, touches.map(t => [t.pageX, t.pageY]));
	}
}

