/**
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
import SVG from 'svg.js';
import PRNG from './prng.js';

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
export default class Samai {
    constructor({
        element = document.createElement('div'),
        date = new Date(),
        width = 400,
        dark_colors = ['#222', '#227', '#272', '#777', '#427', '#722'],
        light_colors = ['#39C', '#3C6', '#CCC', '#FC3', '#C6C', '#F63'],
        line_count = 2,
        fabric_enabled = false,
        n = 1
    } = {}) {
        let color_prng = new PRNG(this._setDate(date)); /** @member {Date} index.Samai#date - Date used for seed of PRNG.*/
        this.svg = SVG(element); /** @member {SVG.Doc} index.Samai#svg - SVG object used to draw pattern.*/
        this.prng = new PRNG(this.date); /** @member {PRNG} index.Samai#prng - PRNG object used to generate random values.*/
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

    _goto(n) {
        /**
         * Set the PRNG to the (n-1)th value.
         * @function _goto
         * @memberof index.Samai#
         * @param {number} n - sama number.
         */
        for (let i = 0; i < (n - 1) * this._prngNo; i++) this.prng._next();
    }

    _setDate(date) {
        /**
         * Sets the date field.
         * @function _setDate
         * @memberof index.Samai#
         * @param {string|Date} date - Date string.
         * @returns {Date}
         */
        let today = new Date();
        let d = date || today;
        if (d instanceof Date) {
            if (isNaN(d.getTime())) d = today;
        } else if (typeof d === 'string') {
            d = new Date(d);
            if (isNaN(d.getTime())) d = today;
        } else d = today;
        this.date = d;
        return this.date;
    }

    _getDateString() {
        /**
         * Returns a formatted date string from the date property.
         * @function _getDateString
         * @memberof index.Samai#
         * @returns {string}
         */
        let result;
        let month = this.date.getMonth() + 1;
        let day = this.date.getDate();
        result = (month < 10 ? '0' + month : month) + '-';
        result += (day < 10 ? '0' + day : day) + '-';
        result += this.date.getFullYear();
        return result;
    }

    _randomShape(hex, svg) {
        /**
         * Creates a pseudo-random shape.
         * [This method can be modified to create custom shapes]
         * @function _randomShape
         * @memberof index.Samai#
         * @param {string} hex - hex color or image url.
         * @param {SVG.Doc} svg - SVG object used to create shape.
         */
        let p = this.prng;
        let lc = this.line_count;
        let lh = this.line_height;
        let sides = [3 /*, 4*/];
        let side_no = sides[p.random(sides.length - 1)];
        let xy = [];
        let r1 = p.random(1);
        let r2 = p.random(lc, 1);
        let lch = lc / 2;
        let t = p.random(lc);
        let b = t > lch ? p.random(lc, lch) : p.random(lch);
        let j = 0;
        for (let i = 0; i < side_no; i++) {
            let l = i + 1 > Math.ceil(side_no / 2) ? r2 : 0;
            if (j % 2 === r1) xy.push([(t + l) * lh, 0]);
            else xy.push([(b + l) * lh, lh]);
            if (i < side_no - 1) {
                if (j % 2 !== r1) xy.push([(t + l) * lh, 0]);
                else xy.push([(b + l) * lh, lh]);
                i++;
            }
            j++;
        }
        svg.polygon(xy).fill(hex);
    }

    _generatePattern() {
        /**
         * Generates a pseudo-random pattern.
         * [This method can be modified to create custom patterns]
         * @function _generatePattern
         * @memberof index.Samai#
         * @returns {SVG.Pattern}
         */
        let s = this.svg;
        let pw = this.pattern_width;
        let lc = this.line_count;
        let lh = this.line_height;
        let t0 = this.prng.random(1);
        let t1 = this.prng.random(1);
        let t2 = this.prng.random(1);
        s.clear();
        let pattern = s.pattern(pw, lh, add => {
            add.rect(lh * (lc / 2), lh).fill(this._fabric(this.light_colors[0], 2));
            add
                .rect(lh * (lc / 2), lh)
                .fill(this._fabric(this.dark_colors[0], 1))
                .move(lh * (lc / 2), 0);
            this._randomShape(this._fabric(this.light_colors[1], 0), add);
            this._randomShape(this._fabric(this.dark_colors[1], 1), add);
            this._randomShape(this._fabric(this.light_colors[2], 0), add);
        });
        pattern = s.pattern(pw, lh * 2, add => {
            add.rect(pw, lh).fill(pattern);
            if (t0)
                add
                    .rect(pw, lh)
                    .fill(pattern)
                    .move(0, lh)
                    .flip('y');
            else
                add
                    .rect(pw, lh)
                    .fill(pattern)
                    .move(0, lh)
                    .rotate(180);
        });
        if (t1) {
            pattern = s.pattern(pw * 2, lh * 2, add => {
                add.rect(pw, lh * 2).fill(pattern);
                if (t2)
                    add
                        .rect(pw, lh * 2)
                        .fill(pattern)
                        .move(pw, 0)
                        .flip('x');
                else
                    add
                        .rect(pw, lh * 2)
                        .fill(pattern)
                        .move(pw, 0)
                        .rotate(180);
            });
        }
        s.viewbox(0, 0, this.width, this.width);
        s.rect(this.width, this.width).fill(pattern);
        this.data_uri = 'data:image/svg+xml;base64,' + btoa(s.svg());
        this.svg_pattern = pattern;
        return pattern;
    }

    _fabric(hex, texture) {
        /**
         * Creates a {SVG.Pattern} to imitate the appearance of fabric.
         * @function _fabric
         * @memberof index.Samai#
         * @param {string} hex - hex color or image url.
         * @param {number} texture - choose fabric texture. [0, 1, 2]
         * @returns {SVG.Pattern}
         */
        let pattern = hex;
        if (this.fabric_enabled) {
            let w = 4; // pattern width
            let uw = w / 2; // pattern unit width
            let lum = 0.03; // luminosity factor
            let tessellate = (w, p) => {
                return this.svg.pattern(w * 2, w * 2, add => {
                    add.rect(w, w).fill(p);
                    add
                        .rect(w, w)
                        .fill(p)
                        .move(w, 0)
                        .rotate(90);
                    add
                        .rect(w, w)
                        .fill(p)
                        .move(0, w)
                        .rotate(180);
                    add
                        .rect(w, w)
                        .fill(p)
                        .move(w, w)
                        .rotate(270);
                });
            };
            pattern = this.svg.pattern(w, w, add => {
                add.rect(uw, uw).fill(hex);
                add
                    .rect(uw, uw)
                    .fill(Samai.luminance(hex, lum))
                    .move(uw, 0);
                add
                    .rect(uw, uw)
                    .fill(Samai.luminance(hex, lum * 2))
                    .move(0, uw);
                add
                    .rect(uw, uw)
                    .fill(Samai.luminance(hex, lum * 3))
                    .move(uw, uw);
            });
            if (texture > 0) pattern = tessellate(w, pattern);
            if (texture > 1) pattern = tessellate((w *= 2), pattern);
        }
        return pattern;
    }

    next() {
        /**
         * Generates the next pattern and returns a data URI.
         * @function next
         * @memberof index.Samai#
         * @returns {string}
         */
        this._generatePattern();
        return this.data_uri;
    }

    download() {
        /**
         * Attempts to download to client.
         * @function download
         * @memberof index.Samai#
         */
        this.getPNG().then(png => {
            let a = document.createElement('a');
            a.download = 'sama.' + this._getDateString() + '.' + this.prng.count / this._prngNo + '.png';
            a.href = png;
            a.click();
        });
    }

    getPNG() {
        /**
         * Converts the pattern to a PNG and returns a Promise.
         * @function download
         * @memberof index.Samai#
         * @returns {Promise}
         */
        return new Promise((resolve, reject) => {
            let canvas = document.createElement('canvas');
            let context = canvas.getContext('2d');
            let image = new Image();
            canvas.setAttribute('width', this.width + 'px');
            canvas.setAttribute('height', this.width + 'px');
            image.src = this.data_uri;
            image.onerror = reject;
            image.onload = () => {
                context.drawImage(image, 0, 0);
                return resolve(canvas.toDataURL('image/png'));
            };
        });
    }

    static shuffle(arr, prng) {
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
        let a = arr.slice();
        let j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = prng.random(i);
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }

    static luminance(hex, lum) {
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
        let rgb = '#';
        let c;
        let i;
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i * 2, 2), 16);
            c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
            rgb += ('00' + c).substr(c.length);
        }
        return rgb;
    }
}
