if (ENV_IE_11) {
	// Production steps of ECMA-262, Edition 6, 22.1.2.1
	// Reference : https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.from
	if (!Array.from) {
		Array.from = (function() {
			var toStr = Object.prototype.toString;
			var isCallable = function(fn) {
				return typeof fn === "function" || toStr.call(fn) === "[object Function]";
			};
			var toInteger = function(value) {
				var number = Number(value);
				if (isNaN(number)) {
					return 0;
				}
				if (number === 0 || !isFinite(number)) {
					return number;
				}
				return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
			};
			var maxSafeInteger = Math.pow(2, 53) - 1;
			var toLength = function(value) {
				var len = toInteger(value);
				return Math.min(Math.max(len, 0), maxSafeInteger);
			};

			return function from(arrayLike /*, mapFn, thisArg */) {
				var C = this;
				var items = Object(arrayLike);
				if (arrayLike == null) {
					throw new TypeError(
						"Array.from doit utiliser un objet semblable à un tableau - null ou undefined ne peuvent pas être utilisés"
					);
				}

				var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
				var T;
				if (typeof mapFn !== "undefined") {
					if (!isCallable(mapFn)) {
						throw new TypeError(
							"Array.from: lorsqu il est utilisé le deuxième argument doit être une fonction"
						);
					}

					if (arguments.length > 2) {
						T = arguments[2];
					}
				}

				var len = toLength(items.length);
				var A = isCallable(C) ? Object(new C(len)) : new Array(len);
				var k = 0;
				var kValue;
				while (k < len) {
					kValue = items[k];
					if (mapFn) {
						A[k] = typeof T === "undefined" ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
					} else {
						A[k] = kValue;
					}
					k += 1;
				}

				A.length = len;
				return A;
			};
		})();
	}

	/**
	 * Polyfill for closest
	 * @link  https://github.com/jonathantneal/closest
	 */
	(function(ElementProto) {
		if (typeof ElementProto.matches !== "function") {
			ElementProto.matches =
				ElementProto.msMatchesSelector ||
				ElementProto.mozMatchesSelector ||
				ElementProto.webkitMatchesSelector ||
				function matches(selector) {
					var element = this;
					var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
					var index = 0;

					while (elements[index] && elements[index] !== element) {
						++index;
					}

					return Boolean(elements[index]);
				};
		}

		if (typeof ElementProto.closest !== "function") {
			ElementProto.closest = function closest(selector) {
				var element = this;

				while (element && element.nodeType === 1) {
					if (element.matches(selector)) {
						return element;
					}

					element = element.parentNode;
				}

				return null;
			};
		}
	})(window.Element.prototype);
}

export default {};
