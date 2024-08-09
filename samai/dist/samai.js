(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("svg.js"));
	else if(typeof define === 'function' && define.amd)
		define(["svg.js"], factory);
	else if(typeof exports === 'object')
		exports["Samai"] = factory(require("svg.js"));
	else
		root["Samai"] = factory(root["SVG"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @module index
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileOverview Pseudo-randomly generated patterns inspired by the {@link https://en.wikipedia.org/wiki/Kente_cloth|Kente} cloth tradition of Ghana.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author {@link mailto:contact@niiyeboah.com|Nii Yeboah}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @see http://www.niiyeboah.com/samai
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @example
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * var samai = new Samai();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * var body = document.querySelector('body');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * body.style['background'] = 'url('' + samai.data_uri + '')';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @requires {@link http://svgjs.com/|SVG.js}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _svg = __webpack_require__(2);

var _svg2 = _interopRequireDefault(_svg);

var _prng = __webpack_require__(1);

var _prng2 = _interopRequireDefault(_prng);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Creates new Samai object.
 * @class Samai
 * @constructor
 * @memberof index
 * @param {Object} [options] - Options object for configuration.
 * @param {string|Object} [options.element = document.createElement('div')] - Element to draw pattern in.
 * @param {string|Date} [options.date = new Date()] - Date to use for seed of PRNG.
 * @param {number} [options.width = 400] - Width of Samai.
 * @param {Array} [options.dark_colors = ['#222', '#227', '#272', '#777', '#427', '#722']] - Array of dark colors.
 * @param {Array} [options.light_colors = ['#39C', '#3C6', '#CCC', '#FC3', '#C6C', '#F63']] - Array of light colors.
 * @param {number} [options.line_count = 2] - Number of lines in the pattern.
 * @param {boolean} [options.fabric_enabled = false] - Enable fabric imiation.
 * @param {number} [options.n = 1] - Skip to the nth pattern.
 */
var Samai = function () {
    function Samai() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$element = _ref.element,
            element = _ref$element === undefined ? document.createElement('div') : _ref$element,
            _ref$date = _ref.date,
            date = _ref$date === undefined ? new Date() : _ref$date,
            _ref$width = _ref.width,
            width = _ref$width === undefined ? 400 : _ref$width,
            _ref$dark_colors = _ref.dark_colors,
            dark_colors = _ref$dark_colors === undefined ? ['#222', '#227', '#272', '#777', '#427', '#722'] : _ref$dark_colors,
            _ref$light_colors = _ref.light_colors,
            light_colors = _ref$light_colors === undefined ? ['#39C', '#3C6', '#CCC', '#FC3', '#C6C', '#F63'] : _ref$light_colors,
            _ref$line_count = _ref.line_count,
            line_count = _ref$line_count === undefined ? 2 : _ref$line_count,
            _ref$fabric_enabled = _ref.fabric_enabled,
            fabric_enabled = _ref$fabric_enabled === undefined ? false : _ref$fabric_enabled,
            _ref$n = _ref.n,
            n = _ref$n === undefined ? 1 : _ref$n;

        _classCallCheck(this, Samai);

        var color_prng = new _prng2.default(this._setDate(date)); /** @member {Date} index.Samai#date - Date used for seed of PRNG.*/
        this.svg = (0, _svg2.default)(element); /** @member {SVG.Doc} index.Samai#svg - SVG object used to draw pattern.*/
        this.prng = new _prng2.default(this.date); /** @member {PRNG} index.Samai#prng - PRNG object used to generate random values.*/
        this.width = width; /** @member {number} index.Samai#width - Width of the SVG.*/
        this.dark_colors = Samai.shuffle(dark_colors, color_prng); /** @member {Array} index.Samai#dark_colors - Array of dark colors.*/
        this.light_colors = Samai.shuffle(light_colors, color_prng); /** @member {Array} index.Samai#light_colors - Array of light colors.*/
        this.pattern_width = width / line_count; /** @member {number} index.Samai#pattern_width - Width of single pattern element.*/
        this.line_count = line_count; /** @member {number} index.Samai#line_count - Number of lines of the full pattern in the SVG.*/
        this.line_height = this.pattern_width / line_count; /** @member {number} index.Samai#line_height - The height of each line of pattern elements.*/
        this.fabric_enabled = fabric_enabled; /** @member {boolean} index.Samai#fabric_enabled - The height of each line of pattern elements.*/
        this._prngNo = 18; /** @member {boolean} index.Samai#_prngNo - Number of PRNG calls during pattern creation.*/
        if (n > 1) this._goto(n);
        this._generatePattern();
    }

    _createClass(Samai, [{
        key: '_goto',
        value: function _goto(n) {
            /**
             * Set the PRNG to the (n-1)th value.
             * @function _goto
             * @memberof index.Samai#
             * @param {number} n - sama number.
             */
            for (var i = 0; i < (n - 1) * this._prngNo; i++) {
                this.prng._next();
            }
        }
    }, {
        key: '_setDate',
        value: function _setDate(date) {
            /**
             * Sets the date field.
             * @function _setDate
             * @memberof index.Samai#
             * @param {string|Date} date - Date string.
             * @returns {Date}
             */
            var today = new Date();
            var d = date || today;
            if (d instanceof Date) {
                if (isNaN(d.getTime())) d = today;
            } else if (typeof d === 'string') {
                d = new Date(d);
                if (isNaN(d.getTime())) d = today;
            } else d = today;
            this.date = d;
            return this.date;
        }
    }, {
        key: '_getDateString',
        value: function _getDateString() {
            /**
             * Returns a formatted date string from the date property.
             * @function _getDateString
             * @memberof index.Samai#
             * @returns {string}
             */
            var result = void 0;
            var month = this.date.getMonth() + 1;
            var day = this.date.getDate();
            result = (month < 10 ? '0' + month : month) + '-';
            result += (day < 10 ? '0' + day : day) + '-';
            result += this.date.getFullYear();
            return result;
        }
    }, {
        key: '_randomShape',
        value: function _randomShape(hex, svg) {
            /**
             * Creates a pseudo-random shape.
             * [This method can be modified to create custom shapes]
             * @function _randomShape
             * @memberof index.Samai#
             * @param {string} hex - hex color or image url.
             * @param {SVG.Doc} svg - SVG object used to create shape.
             */
            var p = this.prng;
            var lc = this.line_count;
            var lh = this.line_height;
            var sides = [3 /*, 4*/];
            var side_no = sides[p.random(sides.length - 1)];
            var xy = [];
            var r1 = p.random(1);
            var r2 = p.random(lc, 1);
            var lch = lc / 2;
            var t = p.random(lc);
            var b = t > lch ? p.random(lc, lch) : p.random(lch);
            var j = 0;
            for (var i = 0; i < side_no; i++) {
                var l = i + 1 > Math.ceil(side_no / 2) ? r2 : 0;
                if (j % 2 === r1) xy.push([(t + l) * lh, 0]);else xy.push([(b + l) * lh, lh]);
                if (i < side_no - 1) {
                    if (j % 2 !== r1) xy.push([(t + l) * lh, 0]);else xy.push([(b + l) * lh, lh]);
                    i++;
                }
                j++;
            }
            svg.polygon(xy).fill(hex);
        }
    }, {
        key: '_generatePattern',
        value: function _generatePattern() {
            var _this = this;

            /**
             * Generates a pseudo-random pattern.
             * [This method can be modified to create custom patterns]
             * @function _generatePattern
             * @memberof index.Samai#
             * @returns {SVG.Pattern}
             */
            var s = this.svg;
            var pw = this.pattern_width;
            var lc = this.line_count;
            var lh = this.line_height;
            var t0 = this.prng.random(1);
            var t1 = this.prng.random(1);
            var t2 = this.prng.random(1);
            s.clear();
            var pattern = s.pattern(pw, lh, function (add) {
                add.rect(lh * (lc / 2), lh).fill(_this._fabric(_this.light_colors[0], 2));
                add.rect(lh * (lc / 2), lh).fill(_this._fabric(_this.dark_colors[0], 1)).move(lh * (lc / 2), 0);
                _this._randomShape(_this._fabric(_this.light_colors[1], 0), add);
                _this._randomShape(_this._fabric(_this.dark_colors[1], 1), add);
                _this._randomShape(_this._fabric(_this.light_colors[2], 0), add);
            });
            pattern = s.pattern(pw, lh * 2, function (add) {
                add.rect(pw, lh).fill(pattern);
                if (t0) add.rect(pw, lh).fill(pattern).move(0, lh).flip('y');else add.rect(pw, lh).fill(pattern).move(0, lh).rotate(180);
            });
            if (t1) {
                pattern = s.pattern(pw * 2, lh * 2, function (add) {
                    add.rect(pw, lh * 2).fill(pattern);
                    if (t2) add.rect(pw, lh * 2).fill(pattern).move(pw, 0).flip('x');else add.rect(pw, lh * 2).fill(pattern).move(pw, 0).rotate(180);
                });
            }
            s.viewbox(0, 0, this.width, this.width);
            s.rect(this.width, this.width).fill(pattern);
            this.data_uri = 'data:image/svg+xml;base64,' + btoa(s.svg());
            this.svg_pattern = pattern;
            return pattern;
        }
    }, {
        key: '_fabric',
        value: function _fabric(hex, texture) {
            var _this2 = this;

            /**
             * Creates a {SVG.Pattern} to imitate the appearance of fabric.
             * @function _fabric
             * @memberof index.Samai#
             * @param {string} hex - hex color or image url.
             * @param {number} texture - choose fabric texture. [0, 1, 2]
             * @returns {SVG.Pattern}
             */
            var pattern = hex;
            if (this.fabric_enabled) {
                var w = 4; // pattern width
                var uw = w / 2; // pattern unit width
                var lum = 0.03; // luminosity factor
                var tessellate = function tessellate(w, p) {
                    return _this2.svg.pattern(w * 2, w * 2, function (add) {
                        add.rect(w, w).fill(p);
                        add.rect(w, w).fill(p).move(w, 0).rotate(90);
                        add.rect(w, w).fill(p).move(0, w).rotate(180);
                        add.rect(w, w).fill(p).move(w, w).rotate(270);
                    });
                };
                pattern = this.svg.pattern(w, w, function (add) {
                    add.rect(uw, uw).fill(hex);
                    add.rect(uw, uw).fill(Samai.luminance(hex, lum)).move(uw, 0);
                    add.rect(uw, uw).fill(Samai.luminance(hex, lum * 2)).move(0, uw);
                    add.rect(uw, uw).fill(Samai.luminance(hex, lum * 3)).move(uw, uw);
                });
                if (texture > 0) pattern = tessellate(w, pattern);
                if (texture > 1) pattern = tessellate(w *= 2, pattern);
            }
            return pattern;
        }
    }, {
        key: 'next',
        value: function next() {
            /**
             * Generates the next pattern and returns a data URI.
             * @function next
             * @memberof index.Samai#
             * @returns {string}
             */
            this._generatePattern();
            return this.data_uri;
        }
    }, {
        key: 'download',
        value: function download() {
            var _this3 = this;

            /**
             * Attempts to download to client.
             * @function download
             * @memberof index.Samai#
             */
            this.getPNG().then(function (png) {
                var a = document.createElement('a');
                a.download = 'sama.' + _this3._getDateString() + '.' + _this3.prng.count / _this3._prngNo + '.png';
                a.href = png;
                a.click();
            });
        }
    }, {
        key: 'getPNG',
        value: function getPNG() {
            var _this4 = this;

            /**
             * Converts the pattern to a PNG and returns a Promise.
             * @function download
             * @memberof index.Samai#
             * @returns {Promise}
             */
            return new Promise(function (resolve, reject) {
                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');
                var image = new Image();
                canvas.setAttribute('width', _this4.width + 'px');
                canvas.setAttribute('height', _this4.width + 'px');
                image.src = _this4.data_uri;
                image.onerror = reject;
                image.onload = function () {
                    context.drawImage(image, 0, 0);
                    return resolve(canvas.toDataURL('image/png'));
                };
            });
        }
    }], [{
        key: 'shuffle',
        value: function shuffle(arr, prng) {
            /**
             * [Static] {@link https://goo.gl/ieQvse|Fisher–Yates shuffle algorithm}.
             * Shuffles elements in the input array and returns a new array.
             * @function shuffle
             * @memberof index.Samai#
             * @static
             * @param {Array} arr - Input array.
             * @param {PRNG} prng - PRNG object.
             * @returns {Array}
             */
            var a = arr.slice();
            var j = void 0,
                x = void 0,
                i = void 0;
            for (i = a.length - 1; i > 0; i--) {
                j = prng.random(i);
                x = a[i];
                a[i] = a[j];
                a[j] = x;
            }
            return a;
        }
    }, {
        key: 'luminance',
        value: function luminance(hex, lum) {
            /**
             * [Static] Returnsa a brighter or darker hex color depending on the luminosity factor.
             * @function luminance
             * @memberof index.Samai#
             * @static
             * @param {string} hex - Hex color string.
             * @param {number} lum - Luminosity factor.
             * @returns {string}
             */
            lum = lum || 0;
            hex = String(hex).replace(/[^0-9a-f]/gi, '');
            if (hex.length < 6) {
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            }
            var rgb = '#';
            var c = void 0;
            var i = void 0;
            for (i = 0; i < 3; i++) {
                c = parseInt(hex.substr(i * 2, 2), 16);
                c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
                rgb += ('00' + c).substr(c.length);
            }
            return rgb;
        }
    }]);

    return Samai;
}();

exports.default = Samai;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * {@link https://goo.gl/h7Fmhy|Lehmer random number generator}.
 * This code is adapted from a {@link https://goo.gl/CUs15K|gist} by {@link http://blixt.nyc|Blixt}.
 * @class PRNG
 * @memberof index
 * @constructor
 * @param {Date} date - Date used as seed.
 */
var PRNG = function () {
    function PRNG(date) {
        _classCallCheck(this, PRNG);

        this._p = 2147483647; /** @member {number} index.PRNG#_p - Prime constant*/
        this._c = 2147483646; /** @member {number} index.PRNG#_c - Coprime constant*/
        this._r = 16807; /** @member {number} index.PRNG#_r - Primitive root modulo n constant*/
        this.count = 0; /** @member {number} index.PRNG#count - Counter for number of values generated*/
        this._seed = this._dateSeed(date) % this._p; /** @member {number} index.PRNG#_seed - Seed for random value generator*/
        if (this._seed <= 0) this._seed += this._c;
    }

    _createClass(PRNG, [{
        key: '_dateSeed',
        value: function _dateSeed(date) {
            /**
             * Convert Date value to number for seed.
             * @function _dateSeed
             * @memberof index.PRNG#
             * @param {Date} date - Date to convert to seed.
             * @returns {number}
             */
            date = '' + (date.getMonth() + 1) + date.getDate() + date.getFullYear();
            return Number.parseInt(date);
        }
    }, {
        key: '_next',
        value: function _next() {
            /**
             * Returns random integer and increments count.
             * @function _next
             * @memberof index.PRNG#
             * @returns {number}
             */
            this.count++;
            return this._seed = this._seed * this._r % this._p;
        }
    }, {
        key: '_nextFloat',
        value: function _nextFloat() {
            /**
             * Returns float between 0 and 1.
             * @function _nextFloat
             * @memberof index.PRNG#
             * @returns {number}
             */
            var result = (this._next() - 1) / this._c;
            while (result < 1) {
                result *= 10;
            }return result;
        }
    }, {
        key: 'random',
        value: function random(max, min) {
            /**
             * Returns random integer between min and max parameters.
             * @function random
             * @memberof index.PRNG#
             * @param {number} max - Date to convert to seed.
             * @param {number} min - Date to convert to seed.
             * @returns {number}
             */
            min = min || 0;
            return Math.floor(this._nextFloat() % (max + 1 - min)) + min;
        }
    }]);

    return PRNG;
}();

exports.default = PRNG;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ })
/******/ ]);
});