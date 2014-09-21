/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

import {expect} from 'chaijs/chai@1';

import toTransform from '../lib/totransform';

describe('toTransform', function () {
	it('should scale', function () {
		expect(toTransform([[0, 0], [100, 0]], [[0, 0], [200, 0]]).scale).to.eql(2);
		expect(toTransform([[0, 0], [100, 0]], [[0, 0], [50, 0]]).scale).to.eql(0.5);
	});

	it('should translate', function () {
		expect(toTransform([[0, 0], [0, 100]], [[100, -100], [100, 0]]).translate).to.eql([100, -100]);
		expect(toTransform([[0, 0], [0, 100]], [[-100, 100], [-100, 200]]).translate).to.eql([-100, 100]);
	});

	it('should rotate', function () {
		expect(toTransform([[0, 0], [100, 0]], [[0, 0], [0, 100]]).rotate).to.eql(Math.PI / 2);
		expect(toTransform([[0, 0], [100, 0]], [[0, 0], [0, -100]]).rotate).to.eql(-Math.PI / 2);
	});
});

