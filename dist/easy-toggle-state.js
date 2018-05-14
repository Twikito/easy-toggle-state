/**
 * -------------------------------------------------------------------
 * easy-toggle-state
 * A tiny JavaScript plugin to toggle the state of any HTML element in most of contexts with ease.
 *
 * @version v1.3.1
 * @link https://github.com/Twikito/easy-toggle-state#readme
 * @license MIT : https://github.com/Twikito/easy-toggle-state/blob/master/LICENSE
 * -------------------------------------------------------------------
 */

(function () {
	'use strict';

	/**
	 * You can change this PREFIX value to prevent conflict with another JS library.
	 * This prefix will be set to all attributes like data-[PREFIX]-class.
	 */
	var PREFIX = "toggle";

	/* Retrieve a valid HTML attribute. */
	var dataset = (function (key) {
	  return "data-" + PREFIX + (PREFIX != "" ? "-" : "") + key;
	});

	/* HTML attributes */
	var CHECKED = "aria-checked",
	    CLASS = dataset("class"),
	    ESCAPE = dataset("escape"),
	    EVENT = dataset("event"),
	    EXPANDED = "aria-expanded",
	    GROUP = dataset("group"),
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

	var toConsumableArray = function (arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

	    return arr2;
	  } else {
	    return Array.from(arr);
	  }
	};

	/* Retrieve all triggers with a specific attribute */
	var $$ = (function (selector) {
		var scope = selector ? "[" + selector + "]" : "";
		return [].concat(toConsumableArray(document.querySelectorAll(("[" + CLASS + "]" + scope).trim())));
	});

	/* Retrieve all active trigger of a group. */
	var retrieveGroupState = (function (group) {
	  return $$(GROUP + "=\"" + group + "\"").filter(function (groupElement) {
	    return groupElement.isToggleActive;
	  });
	});

	/* Test the targets list */
	var testTargets = (function (selector, targetList) {

		/* Test if there's no match for a selector */
		if (targetList.length === 0) {
			console.warn("There's no match for the selector '" + selector + "' for this trigger");
		}

		/* Test if there's more than one match for an ID selector */
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
	});

	/* Retrieve all targets of a trigger element. */
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

	/* Toggle off all 'toggle-outside' elements when reproducing specified or click event outside trigger or target elements. */
	var documentEventHandler = function documentEventHandler(event) {
		var target = event.target;
		if (!target.closest("[" + TARGET_STATE + '="true"]')) {
			$$(OUTSIDE).forEach(function (element) {
				if (element != target && element.isToggleActive) {
					(element.hasAttribute(GROUP) ? manageGroup : manageToggle)(element);
				}
			});
			if (target.hasAttribute(OUTSIDE) && target.isToggleActive) {
				document.addEventListener(target.getAttribute(EVENT) || "click", documentEventHandler, false);
			}
		}
	};

	/* Manage click on 'trigger-off' elements. */
	var triggerOffHandler = function triggerOffHandler(event) {
		manageToggle(event.target.targetElement);
	};

	/* Manage ARIA attributes */
	var manageAria = function manageAria(element) {
		if (element.hasAttribute(CHECKED)) {
			element.setAttribute(CHECKED, element.isToggleActive);
		}

		if (element.hasAttribute(EXPANDED)) {
			element.setAttribute(EXPANDED, element.isToggleActive);
		}

		if (element.hasAttribute(SELECTED)) {
			element.setAttribute(SELECTED, element.isToggleActive);
		}
	};

	/* Manage attributes and events of target elements. */
	var manageTarget = function manageTarget(targetElement, triggerElement) {
		targetElement.isToggleActive = !targetElement.isToggleActive;
		manageAria(targetElement);

		if (triggerElement.hasAttribute(OUTSIDE)) {
			targetElement.setAttribute(TARGET_STATE, triggerElement.isToggleActive);
		}

		var triggerOffList = targetElement.querySelectorAll("[" + TRIGGER_OFF + "]");
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

	/* Toggle class and aria on trigger and target elements. */
	var manageToggle = function manageToggle(element) {
		var className = element.getAttribute(CLASS) || "is-active";
		element.isToggleActive = !element.isToggleActive;
		manageAria(element);
		//console.log("toggle to "+element.isToggleActive);

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

	/* Manage event ouside trigger or target elements. */
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

	/* Toggle elements of a same group. */
	var manageGroup = function manageGroup(element) {
		var activeGroupElements = retrieveGroupState(element.getAttribute(GROUP));

		if (activeGroupElements.length > 0) {
			if (activeGroupElements.indexOf(element) === -1) {
				activeGroupElements.forEach(function (groupElement) {
					manageToggle(groupElement);
				});
				manageToggle(element);
			}
		} else {
			manageToggle(element);
		}
	};

	/* Toggle elements set to be active by default. */
	var manageActiveByDefault = function manageActiveByDefault(element) {
		element.isToggleActive = true;
		var className = element.getAttribute(CLASS) || "is-active";

		if (!element.hasAttribute(TARGET_ONLY) && !element.classList.contains(className)) {
			element.classList.add(className);
		}

		if (element.hasAttribute(CHECKED) && element.getAttribute(CHECKED)) {
			element.setAttribute(CHECKED, true);
		}

		if (element.hasAttribute(EXPANDED) && element.getAttribute(EXPANDED)) {
			element.setAttribute(EXPANDED, true);
		}

		if (element.hasAttribute(SELECTED) && !element.getAttribute(SELECTED)) {
			element.setAttribute(SELECTED, true);
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

	/* Initialization. */
	var init = (function () {

		/* Active by default management. */
		$$(IS_ACTIVE).forEach(function (trigger) {
			if (trigger.hasAttribute(GROUP)) {
				var group = trigger.getAttribute(GROUP);
				if (retrieveGroupState(group).length > 0) {
					console.warn("Toggle group '" + group + "' must not have more than one trigger with '" + IS_ACTIVE + "'");
				} else {
					manageActiveByDefault(trigger);
				}
			} else {
				manageActiveByDefault(trigger);
			}
		});

		/* Set specified or click event on each trigger element. */
		$$().forEach(function (trigger) {
			trigger.addEventListener(trigger.getAttribute(EVENT) || "click", function (event) {
				event.preventDefault();
				(trigger.hasAttribute(GROUP) ? manageGroup : manageToggle)(trigger);
			}, false);
		});

		/* Escape key management. */
		var triggerEscElements = $$(ESCAPE);
		if (triggerEscElements.length > 0) {
			document.addEventListener("keyup", function (event) {
				event = event || window.event;
				var isEscape = false;

				if ("key" in event) {
					isEscape = event.key === "Escape" || event.key === "Esc";
				} else {
					isEscape = event.keyCode === 27;
				}

				if (isEscape) {
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

	var onLoad = function onLoad() {
		init();
		document.removeEventListener("DOMContentLoaded", onLoad);
	};

	document.addEventListener("DOMContentLoaded", onLoad);
	window.initEasyToggleState = init;

}());
