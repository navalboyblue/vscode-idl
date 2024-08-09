/**
 * {@link https://goo.gl/h7Fmhy|Lehmer random number generator}.
 * This code is adapted from a {@link https://goo.gl/CUs15K|gist} by {@link http://blixt.nyc|Blixt}.
 * @class PRNG
 * @memberof index
 * @constructor
 * @param {Date} date - Date used as seed.
 */
export default class PRNG {
    constructor(date) {
        this._p = 2147483647; /** @member {number} index.PRNG#_p - Prime constant*/
        this._c = 2147483646; /** @member {number} index.PRNG#_c - Coprime constant*/
        this._r = 16807; /** @member {number} index.PRNG#_r - Primitive root modulo n constant*/
        this.count = 0; /** @member {number} index.PRNG#count - Counter for number of values generated*/
        this._seed = this._dateSeed(date) % this._p; /** @member {number} index.PRNG#_seed - Seed for random value generator*/
        if (this._seed <= 0) this._seed += this._c;
    }

    _dateSeed(date) {
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

    _next() {
        /**
         * Returns random integer and increments count.
         * @function _next
         * @memberof index.PRNG#
         * @returns {number}
         */
        this.count++;
        return (this._seed = (this._seed * this._r) % this._p);
    }

    _nextFloat() {
        /**
         * Returns float between 0 and 1.
         * @function _nextFloat
         * @memberof index.PRNG#
         * @returns {number}
         */
        var result = (this._next() - 1) / this._c;
        while (result < 1) result *= 10;
        return result;
    }

    random(max, min) {
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
}
