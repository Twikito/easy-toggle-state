/**
 * -------------------------------------------------------------------
 * easy-toggle-state
 * A tiny JavaScript plugin to toggle the state of any HTML element in most of contexts with ease.
 *
 * @author Matthieu Bué <https://twikito.com>
 * @version v1.5.4
 * @link https://twikito.github.io/easy-toggle-state/
 * @license MIT : https://github.com/Twikito/easy-toggle-state/blob/master/LICENSE
 * -------------------------------------------------------------------
 */

(function () {
	'use strict';

	{
		/**
	  * Polyfill for Array.from
	  * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from#Polyfill
	  */
		if (!Array.from) {
			Array.from = function () {
				var toStr = Object.prototype.toString;
				var isCallable = function isCallable(fn) {
					return typeof fn === "function" || toStr.call(fn) === "[object Function]";
				};
				var toInteger = function toInteger(value) {
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
				var toLength = function toLength(value) {
					var len = toInteger(value);
					return Math.min(Math.max(len, 0), maxSafeInteger);
				};

				// The length property of the from method is 1.
				return function from(arrayLike /*, mapFn, thisArg */) {
					// 1. Let C be the this value.
					var C = this;

					// 2. Let items be ToObject(arrayLike).
					var items = Object(arrayLike);

					// 3. ReturnIfAbrupt(items).
					if (arrayLike == null) {
						throw new TypeError("Array.from requires an array-like object - not null or undefined");
					}

					// 4. If mapfn is undefined, then let mapping be false.
					var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
					var T;
					if (typeof mapFn !== "undefined") {
						// 5. else
						// 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
						if (!isCallable(mapFn)) {
							throw new TypeError("Array.from: when provided, the second argument must be a function");
						}

						// 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
						if (arguments.length > 2) {
							T = arguments[2];
						}
					}

					// 10. Let lenValue be Get(items, "length").
					// 11. Let len be ToLength(lenValue).
					var len = toLength(items.length);

					// 13. If IsConstructor(C) is true, then
					// 13. a. Let A be the result of calling the [[Construct]] internal method
					// of C with an argument list containing the single item len.
					// 14. a. Else, Let A be ArrayCreate(len).
					var A = isCallable(C) ? Object(new C(len)) : new Array(len);

					// 16. Let k be 0.
					var k = 0;
					// 17. Repeat, while k < len… (also steps a - h)
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
					// 18. Let putStatus be Put(A, "length", len, true).
					A.length = len;
					// 20. Return A.
					return A;
				};
			}();
		}

		/**
	  * Polyfill for closest
	  * @link https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
	  */
		if (window.Element && !Element.prototype.closest) {
			Element.prototype.closest = function (s) {
				var matches = (this.document || this.ownerDocument).querySelectorAll(s),
				    i,
				    el = this;
				do {
					i = matches.length;
					while (--i >= 0 && matches.item(i) !== el) {}
				} while (i < 0 && (el = el.parentElement));
				return el;
			};
		}
	}

	/**
	 * You can change this PREFIX value to prevent conflict with another JS library.
	 * This prefix will be set to all attributes like 'data-[PREFIX]-class'.
	 */
	var PREFIX = "toggle";

	/**
	 * Retrieve a valid HTML attribute string.
	 * @param {string} key - A string to build a html attribute
	 * @returns {string} - A valid html attribute
	 */
	var dataset = function dataset(key) {
		return ["data", PREFIX, key].filter(Boolean).join("-");
	};

	/**
	 * All constants containing HTML attributes string.
	 */
	var CHECKED = "aria-checked",
	    CLASS = dataset("class"),
	    ESCAPE = dataset("escape"),
	    EVENT = dataset("event"),
	    EXPANDED = "aria-expanded",
	    GROUP = dataset("group"),
	    HIDDEN = "aria-hidden",
	    IS_ACTIVE = dataset("is-active"),
	    OUTSIDE = dataset("outside"),
	    SELECTED = "aria-selected",
	    TARGET = dataset("target"),
	    TARGET_ALL = dataset("target-all"),
	    TARGET_NEXT = dataset("target-next"),
	    TARGET_ONLY = dataset("target-only"),
	    TARGET_PARENT = dataset("target-parent"),
	    TARGET_PREVIOUS = dataset("target-previous"),
	    TARGET_SELF = dataset("target-self"),
	    TARGET_STATE = dataset("state"),
	    TRIGGER_OFF = dataset("trigger-off");

	var defineProperty = function (obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	};

	var toConsumableArray = function (arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

	    return arr2;
	  } else {
	    return Array.from(arr);
	  }
	};

	/**
	 * Retrieve all trigger elements with a specific attribute, or all nodes in a specific scope.
	 * @param {string} selector - A string that contains a selector
	 * @param {node} [node] - An element in which to make the selection
	 * @returns {array} - An array of elements
	 */
	var $$ = (function (selector, node) {
	  var scope = selector ? "[" + selector + "]" : "";
	  return node ? [].concat(toConsumableArray(node.querySelectorAll(scope))) : [].concat(toConsumableArray(document.querySelectorAll(("[" + CLASS + "]" + scope).trim())));
	});

	/**
	 * Aria attributes toggle manager.
	 * @param {node} element - Current element with aria attributes to manage.
	 * @param {json} [config] - List of aria attributes and value to assign.
	 * @returns {undefined}
	 */
	var manageAria = (function (element) {
		var _ref;

		var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (_ref = {}, defineProperty(_ref, CHECKED, element.isToggleActive), defineProperty(_ref, EXPANDED, element.isToggleActive), defineProperty(_ref, HIDDEN, !element.isToggleActive), defineProperty(_ref, SELECTED, element.isToggleActive), _ref);

		Object.keys(config).forEach(function (key) {
			return element.hasAttribute(key) && element.setAttribute(key, config[key]);
		});
	});

	/**
	 * Retrieve all active elements of a group.
	 * @param {string} group - The trigger group name
	 * @returns {array} - An array of active elements of a group
	 */
	var retrieveGroupActiveElement = (function (group) {
	  return $$(GROUP + "=\"" + group + "\"").filter(function (groupElement) {
	    return groupElement.isToggleActive;
	  });
	});

	/**
	 * Test a targets list.
	 * @param {string} selector - The selector corresponding to the targets list
	 * @param {nodeList} targetList - A target elements list
	 * @returns {nodeList} - The targets list
	 */
	var testTargets = function testTargets(selector, targetList) {

		/** Test if there's no match for a selector */
		if (targetList.length === 0) {
			console.warn("There's no match for the selector '" + selector + "' for this trigger");
		}

		/** Test if there's more than one match for an ID selector */
		var matches = selector.match(/#\w+/gi);
		if (matches) {
			matches.forEach(function (match) {
				var result = [].concat(toConsumableArray(targetList)).filter(function (target) {
					return target.id === match.slice(1);
				});
				if (result.length > 1) {
					console.warn("There's " + result.length + " matches for the selector '" + match + "' for this trigger");
				}
			});
		}

		return targetList;
	};

	/**
	 * Retrieve all targets of a trigger element, depending of its target attribute.
	 * @param {node} element - A trigger element
	 * @returns {nodeList} - All targets of a trigger element
	 */
	var retrieveTargets = (function (element) {
		if (element.hasAttribute(TARGET) || element.hasAttribute(TARGET_ALL)) {
			var selector = element.getAttribute(TARGET) || element.getAttribute(TARGET_ALL);
			return testTargets(selector, document.querySelectorAll(selector));
		}

		if (element.hasAttribute(TARGET_PARENT)) {
			var _selector = element.getAttribute(TARGET_PARENT);
			return testTargets(_selector, element.parentElement.querySelectorAll(_selector));
		}

		if (element.hasAttribute(TARGET_SELF)) {
			var _selector2 = element.getAttribute(TARGET_SELF);
			return testTargets(_selector2, element.querySelectorAll(_selector2));
		}

		if (element.hasAttribute(TARGET_PREVIOUS)) {
			return testTargets("previous", [element.previousElementSibling].filter(Boolean));
		}

		if (element.hasAttribute(TARGET_NEXT)) {
			return testTargets("next", [element.nextElementSibling].filter(Boolean));
		}

		return [];
	});

	/**
	 * Toggle off all elements width 'data-toggle-outside' attribute
	 * when reproducing specified or click event outside itself or its targets.
	 * @param {event} event - Event triggered on document
	 * @returns {undefined}
	 */
	var documentEventHandler = function documentEventHandler(event) {
		var target = event.target;
		if (!target.closest("[" + TARGET_STATE + '="true"]')) {
			$$(OUTSIDE).forEach(function (element) {
				if (element !== target && element.isToggleActive) {
					(element.hasAttribute(GROUP) ? manageGroup : manageToggle)(element);
				}
			});
			if (target.hasAttribute(OUTSIDE) && target.isToggleActive) {
				document.addEventListener(target.getAttribute(EVENT) || "click", documentEventHandler, false);
			}
		}
	};

	/**
	 * Manage click on elements with 'data-trigger-off' attribue.
	 * @param {event} event - Event triggered on element with 'trigger-off' attribute
	 * @returns {undefined}
	 */
	var triggerOffHandler = function triggerOffHandler(event) {
		manageToggle(event.target.targetElement);
	};

	/**
	 * Manage attributes and events of target elements.
	 * @param {node} targetElement - An element targeted by the trigger element
	 * @param {node} triggerElement - The trigger element
	 * @returns {undefined}
	 */
	var manageTarget = function manageTarget(targetElement, triggerElement) {
		targetElement.isToggleActive = !targetElement.isToggleActive;
		manageAria(targetElement);

		if (triggerElement.hasAttribute(OUTSIDE)) {
			targetElement.setAttribute(TARGET_STATE, triggerElement.isToggleActive);
		}

		var triggerOffList = $$(TRIGGER_OFF, targetElement);
		if (triggerOffList.length > 0) {
			if (triggerElement.isToggleActive) {
				triggerOffList.forEach(function (triggerOff) {
					triggerOff.targetElement = triggerElement;
					triggerOff.addEventListener("click", triggerOffHandler, false);
				});
			} else {
				triggerOffList.forEach(function (triggerOff) {
					triggerOff.removeEventListener("click", triggerOffHandler, false);
				});
			}
		}
	};

	/**
	 * Toggle class and aria on trigger and target elements.
	 * @param {node} element - The element to toggle state and attributes
	 * @returns {undefined}
	 */
	var manageToggle = function manageToggle(element) {
		var className = element.getAttribute(CLASS) || "is-active";
		element.isToggleActive = !element.isToggleActive;
		manageAria(element);

		if (!element.hasAttribute(TARGET_ONLY)) {
			element.classList.toggle(className);
		}

		var targetElements = retrieveTargets(element);
		for (var i = 0; i < targetElements.length; i++) {
			targetElements[i].classList.toggle(className);
			manageTarget(targetElements[i], element);
		}

		manageTriggerOutside(element);
	};

	/**
	 * Manage event ouside trigger or target elements.
	 * @param {node} element - The element to toggle when 'click' or custom event is triggered on document
	 * @returns {undefined}
	 */
	var manageTriggerOutside = function manageTriggerOutside(element) {
		if (element.hasAttribute(OUTSIDE)) {
			if (element.hasAttribute(GROUP)) {
				console.warn("You can't use '" + OUTSIDE + "' on a grouped trigger");
			} else {
				if (element.isToggleActive) {
					document.addEventListener(element.getAttribute(EVENT) || "click", documentEventHandler, false);
				} else {
					document.removeEventListener(element.getAttribute(EVENT) || "click", documentEventHandler, false);
				}
			}
		}
	};

	/**
	 * Toggle elements of a same group.
	 * @param {node} element - The element to test if it's in a group
	 * @returns {undefined}
	 */
	var manageGroup = function manageGroup(element) {
		var groupActiveElements = retrieveGroupActiveElement(element.getAttribute(GROUP));

		if (groupActiveElements.length > 0) {
			if (groupActiveElements.indexOf(element) === -1) {
				groupActiveElements.forEach(manageToggle);
				manageToggle(element);
			}
		} else {
			manageToggle(element);
		}
	};

	/**
	 * Toggle elements set to be active by default.
	 * @param {node} element - The element to activate on page load
	 * @returns {undefined}
	 */
	var manageActiveByDefault = function manageActiveByDefault(element) {
		var _manageAria;

		var className = element.getAttribute(CLASS) || "is-active";
		element.isToggleActive = true;
		manageAria(element, (_manageAria = {}, defineProperty(_manageAria, CHECKED, true), defineProperty(_manageAria, EXPANDED, true), defineProperty(_manageAria, HIDDEN, false), defineProperty(_manageAria, SELECTED, true), _manageAria));

		if (!element.hasAttribute(TARGET_ONLY) && !element.classList.contains(className)) {
			element.classList.add(className);
		}

		var targetElements = retrieveTargets(element);
		for (var i = 0; i < targetElements.length; i++) {
			if (!targetElements[i].classList.contains(className)) {
				targetElements[i].classList.add(className);
			}
			manageTarget(targetElements[i], element);
		}

		manageTriggerOutside(element);
	};

	/**
	 * Initialization.
	 * @returns {undefined}
	 */
	var init = (function () {

		/** Active by default management. */
		$$(IS_ACTIVE).forEach(function (trigger) {
			if (trigger.hasAttribute(GROUP)) {
				var group = trigger.getAttribute(GROUP);
				if (retrieveGroupActiveElement(group).length > 0) {
					console.warn("Toggle group '" + group + "' must not have more than one trigger with '" + IS_ACTIVE + "'");
				} else {
					manageActiveByDefault(trigger);
				}
			} else {
				manageActiveByDefault(trigger);
			}
		});

		/** Set specified or click event on each trigger element. */
		$$().forEach(function (trigger) {
			trigger.addEventListener(trigger.getAttribute(EVENT) || "click", function (event) {
				event.preventDefault();
				(trigger.hasAttribute(GROUP) ? manageGroup : manageToggle)(trigger);
			}, false);
		});

		/** Escape key management. */
		var triggerEscElements = $$(ESCAPE);
		if (triggerEscElements.length > 0) {
			document.addEventListener("keyup", function (event) {
				event = event || window.event;
				if (event.key === "Escape" || event.key === "Esc") {
					triggerEscElements.forEach(function (trigger) {
						if (trigger.isToggleActive) {
							if (trigger.hasAttribute(GROUP)) {
								console.warn("You can't use '" + ESCAPE + "' on a grouped trigger");
							} else {
								manageToggle(trigger);
							}
						}
					});
				}
			}, false);
		}
	});

	/* eslint no-unused-vars: "off" */

	var onLoad = function onLoad() {
		init();
		document.removeEventListener("DOMContentLoaded", onLoad);
	};

	document.addEventListener("DOMContentLoaded", onLoad);
	window.initEasyToggleState = init;

}());
