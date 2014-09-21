/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

import {chan, putAsync} from 'jlongster/js-csp@0';

// this is taken from:
// http://jlongster.com/Taming-the-Asynchronous-Beast-with-CSP-in-JavaScript

export default function listen(el, type, ch) {
  ch = ch || chan();
  el.addEventListener(type, function(e) {
    putAsync(ch, e);
  });
  return ch;
};
