/**
 * -------------------------------------------------------------------
 * easy-toggle-state
 * A tiny JavaScript plugin to toggle the state of any HTML element in most of contexts with ease.
 *
 * @version v1.1.1
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

var PREFIX = 'toggle';

var dataset = function dataset(key) {
	return 'data-' + PREFIX + (PREFIX != '' ? '-' : '') + key;
};

var ATTR = {
	CLASS: dataset('class'),
	TARGET_ALL: dataset('target-all'),
	TARGET_PARENT: dataset('target-parent'),
	TARGET_SELF: dataset('target-self'),
	IS_ACTIVE: dataset('is-active'),
	GROUP: dataset('group'),
	EVENT: dataset('event'),
	OUTSIDE: dataset('outside'),
	TARGET_ONLY: dataset('target-only'),
	ESCAPE: dataset('escape'),
	TRIGGER_OFF: dataset('trigger-off'),
	TARGET_STATE: dataset('state'),
	EXPANDED: 'aria-expanded',
	SELECTED: 'aria-selected'
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

/* Retrieve all triggers with a specific attribute */
var $$ = function $$(selector) {
	var scope = selector ? '[' + selector + ']' : '';
	return [].concat(toConsumableArray(document.querySelectorAll(('[' + ATTR.CLASS + ']' + scope).trim())));
};

/* Retrieve all active trigger of a group. */
var retrieveGroupState = function retrieveGroupState(group) {
	var activeGroupElements = [];
	$$(ATTR.GROUP + '="' + group + '"').forEach(function (groupElement) {
		if (groupElement.isToggleActive) {
			activeGroupElements.push(groupElement);
		}
	});
	return activeGroupElements;
};

/* Retrieve all targets of a trigger element. */
var retrieveTargets = function retrieveTargets(element) {

	if (element.hasAttribute(ATTR.TARGET_ALL)) {
		return document.querySelectorAll(element.getAttribute(ATTR.TARGET_ALL));
	}

	if (element.hasAttribute(ATTR.TARGET_PARENT)) {
		return element.parentElement.querySelectorAll(element.getAttribute(ATTR.TARGET_PARENT));
	}

	if (element.hasAttribute(ATTR.TARGET_SELF)) {
		return element.querySelectorAll(element.getAttribute(ATTR.TARGET_SELF));
	}

	return [];
};

/* Toggle off all 'toggle-outside' elements when reproducing specified or click event outside trigger or target elements. */
var documentEventHandler = function documentEventHandler(event) {
	var target = event.target;
	if (!target.closest('[' + ATTR.TARGET_STATE + '="true"]')) {
		$$(ATTR.OUTSIDE).forEach(function (element) {
			if (element != target && element.isToggleActive) {
				var actionToCall = element.hasAttribute(ATTR.GROUP) ? manageGroup : manageToggle;
				actionToCall(element);
			}
		});
		if (target.hasAttribute(ATTR.OUTSIDE) && target.isToggleActive) {
			document.addEventListener(target.getAttribute(ATTR.EVENT) || 'click', documentEventHandler, false);
		}
	}
};

/* Manage click on 'trigger-off' elements. */
var triggerOffHandler = function triggerOffHandler(event) {
	manageToggle(event.target.targetElement);
};

/* Manage attributes and events of target elements. */
var manageTarget = function manageTarget(targetElement, triggerElement) {
	if (triggerElement.hasAttribute(ATTR.OUTSIDE)) {
		targetElement.setAttribute(ATTR.TARGET_STATE, triggerElement.isToggleActive);
	}

	var triggerOffList = targetElement.querySelectorAll('[' + ATTR.TRIGGER_OFF + ']');
	if (triggerOffList.length > 0) {
		if (triggerElement.isToggleActive) {
			triggerOffList.forEach(function (triggerOff) {
				triggerOff.targetElement = triggerElement;
				triggerOff.addEventListener('click', triggerOffHandler, false);
			});
		} else {
			triggerOffList.forEach(function (triggerOff) {
				triggerOff.removeEventListener('click', triggerOffHandler, false);
			});
		}
	}
};

/* Toggle class and aria on trigger and target elements. */
var manageToggle = function manageToggle(element) {
	var className = element.getAttribute(ATTR.CLASS) || 'is-active';
	element.isToggleActive = !element.isToggleActive;
	//console.log("toggle to "+element.isToggleActive);

	if (!element.hasAttribute(ATTR.TARGET_ONLY)) {
		element.classList.toggle(className);
	}

	if (element.hasAttribute(ATTR.EXPANDED)) {
		element.setAttribute(ATTR.EXPANDED, element.isToggleActive);
	}

	if (element.hasAttribute(ATTR.SELECTED)) {
		element.setAttribute(ATTR.SELECTED, element.isToggleActive);
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
	if (element.hasAttribute(ATTR.OUTSIDE)) {
		if (element.hasAttribute(ATTR.GROUP)) {
			console.warn('You can\'t use \'' + ATTR.OUTSIDE + '\' on a grouped trigger');
		} else {
			if (element.isToggleActive) {
				document.addEventListener(element.getAttribute(ATTR.EVENT) || 'click', documentEventHandler, false);
			} else {
				document.removeEventListener(element.getAttribute(ATTR.EVENT) || 'click', documentEventHandler, false);
			}
		}
	}
};

/* Toggle elements of a same group. */
var manageGroup = function manageGroup(element) {
	var activeGroupElements = retrieveGroupState(element.getAttribute(ATTR.GROUP));

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
	var className = element.getAttribute(ATTR.CLASS) || 'is-active';

	if (!element.hasAttribute(ATTR.TARGET_ONLY) && !element.classList.contains(className)) {
		element.classList.add(className);
	}

	if (element.hasAttribute(ATTR.EXPANDED) && element.getAttribute(ATTR.EXPANDED)) {
		element.setAttribute(ATTR.EXPANDED, true);
	}

	if (element.hasAttribute(ATTR.SELECTED) && !element.getAttribute(ATTR.SELECTED)) {
		element.setAttribute(ATTR.SELECTED, true);
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
var init = function init() {

	/* Active by default management. */
	$$(ATTR.IS_ACTIVE).forEach(function (trigger) {
		if (trigger.hasAttribute(ATTR.GROUP)) {
			var group = trigger.getAttribute(ATTR.GROUP);
			if (retrieveGroupState(group).length > 0) {
				console.warn('Toggle group \'' + group + '\' must not have more than one trigger with \'' + ATTR.IS_ACTIVE + '\'');
			} else {
				manageActiveByDefault(trigger);
			}
		} else {
			manageActiveByDefault(trigger);
		}
	});

	/* Set specified or click event on each trigger element. */
	$$().forEach(function (trigger) {
		trigger.addEventListener(trigger.getAttribute(ATTR.EVENT) || 'click', function (event) {
			event.preventDefault();
			(trigger.hasAttribute(ATTR.GROUP) ? manageGroup : manageToggle)(trigger);
		}, false);
	});

	/* Escape key management. */
	var triggerEscElements = $$(ATTR.ESCAPE);
	if (triggerEscElements.length > 0) {
		document.addEventListener('keyup', function (event) {
			event = event || window.event;
			var isEscape = false;

			if ('key' in event) {
				isEscape = event.key === 'Escape' || event.key === 'Esc';
			} else {
				isEscape = event.keyCode === 27;
			}

			if (isEscape) {
				triggerEscElements.forEach(function (trigger) {
					if (trigger.isToggleActive) {
						if (trigger.hasAttribute(ATTR.GROUP)) {
							console.warn('You can\'t use \'' + ATTR.ESCAPE + '\' on a grouped trigger');
						} else {
							manageToggle(trigger);
						}
					}
				});
			}
		}, false);
	}
};

var onLoad = function onLoad() {
	init();
	document.removeEventListener('DOMContentLoaded', onLoad);
};

document.addEventListener('DOMContentLoaded', onLoad);
window.initEasyToggleState = init;

}());
