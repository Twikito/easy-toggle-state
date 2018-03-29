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

var easyToggleState = (function () {
'use strict';

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

var constants = ATTR;

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

// Retrieve all targets of a trigger element
var retrieveTargets = function retrieveTargets(element) {
	if (element.hasAttribute(constants.TARGET_ALL)) return document.querySelectorAll(element.getAttribute(constants.TARGET_ALL));else if (element.hasAttribute(constants.TARGET_PARENT)) return element.parentElement.querySelectorAll(element.getAttribute(constants.TARGET_PARENT));else if (element.hasAttribute(constants.TARGET_SELF)) return element.querySelectorAll(element.getAttribute(constants.TARGET_SELF));
	return [];
};

// Retrieve all active trigger of a group
var retrieveGroupState = function retrieveGroupState(group) {
	var activeGroupElements = [];
	[].concat(toConsumableArray(document.querySelectorAll('[' + constants.CLASS + '][' + constants.GROUP + '="' + group + '"]'))).forEach(function (groupElement) {
		if (groupElement.isToggleActive) activeGroupElements.push(groupElement);
	});
	return activeGroupElements;
};

// Toggle off all 'toggle-outside' elements when reproducing specified or click event outside trigger or target elements
var documentEventHandler = function documentEventHandler(event) {
	var target = event.target;

	if (!target.closest('[' + constants.TARGET_STATE + '="true"]')) {
		[].concat(toConsumableArray(document.querySelectorAll('[' + constants.CLASS + '][' + constants.OUTSIDE + ']'))).forEach(function (element) {
			if (element != target && element.isToggleActive) if (element.hasAttribute(constants.GROUP)) manageGroup(element);else manageToggle(element);
		});
		if (target.hasAttribute(constants.OUTSIDE) && target.isToggleActive) document.addEventListener(target.getAttribute(constants.EVENT) || 'click', documentEventHandler, false);
	}
};

// Manage click on 'trigger-off' elements
var triggerOffHandler = function triggerOffHandler(event) {
	manageToggle(event.target.targetElement);
};

// Manage event ouside trigger or target elements
var manageTriggerOutside = function manageTriggerOutside(element) {
	if (element.hasAttribute(constants.OUTSIDE)) {
		if (element.hasAttribute(constants.GROUP)) console.warn("You can't use '" + constants.OUTSIDE + "' on a grouped trigger");else {
			if (element.isToggleActive) document.addEventListener(element.getAttribute(constants.EVENT) || 'click', documentEventHandler, false);else document.removeEventListener(element.getAttribute(constants.EVENT) || 'click', documentEventHandler, false);
		}
	}
};

// Manage attributes and events of target elements
var manageTarget = function manageTarget(targetElement, triggerElement) {
	if (triggerElement.hasAttribute(constants.OUTSIDE)) targetElement.setAttribute(constants.TARGET_STATE, triggerElement.isToggleActive);

	var triggerOffList = targetElement.querySelectorAll('[' + constants.TRIGGER_OFF + ']');
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

// Toggle elements of a same group
var manageGroup = function manageGroup(element) {
	var activeGroupElements = retrieveGroupState(element.getAttribute(constants.GROUP));

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

// Toggle class and aria on trigger and target elements
var manageToggle = function manageToggle(element) {
	var className = element.getAttribute(constants.CLASS);
	element.isToggleActive = !element.isToggleActive;
	//console.log("toggle to "+element.isToggleActive);

	if (!element.hasAttribute(constants.TARGET_ONLY)) element.classList.toggle(className);

	if (element.hasAttribute(ARIA.EXPANDED)) element.setAttribute(ARIA.EXPANDED, element.isToggleActive);

	if (element.hasAttribute(ARIA.SELECTED)) element.setAttribute(ARIA.SELECTED, element.isToggleActive);

	var targetElements = retrieveTargets(element);
	for (var i = 0; i < targetElements.length; i++) {
		targetElements[i].classList.toggle(className);
		manageTarget(targetElements[i], element);
	}

	manageTriggerOutside(element);
};

var manageActiveByDefault = function manageActiveByDefault(element) {
	element.isToggleActive = true;
	var className = element.getAttribute(constants.CLASS);

	if (!element.hasAttribute(constants.TARGET_ONLY) && !element.classList.contains(className)) element.classList.add(className);

	if (element.hasAttribute(ARIA.EXPANDED) && element.getAttribute(ARIA.EXPANDED)) element.setAttribute(ARIA.EXPANDED, true);

	if (element.hasAttribute(ARIA.SELECTED) && !element.getAttribute(ARIA.SELECTED)) element.setAttribute(ARIA.SELECTED, true);

	var targetElements = retrieveTargets(element);
	for (var i = 0; i < targetElements.length; i++) {
		if (!targetElements[i].classList.contains(element.getAttribute(constants.CLASS))) targetElements[i].classList.add(className);
		manageTarget(targetElements[i], element);
	}

	manageTriggerOutside(element);
};

// Initialization
var init = function init() {

	// Active by default management
	[].concat(toConsumableArray(document.querySelectorAll('[' + constants.CLASS + '][' + constants.IS_ACTIVE + ']'))).forEach(function (trigger) {
		if (trigger.hasAttribute(constants.GROUP)) {
			var group = trigger.getAttribute(constants.GROUP);
			if (retrieveGroupState(group).length > 0) console.warn("Toggle group '" + group + "' must not have more than one trigger with '" + constants.IS_ACTIVE + "'");else manageActiveByDefault(trigger);
		} else {
			manageActiveByDefault(trigger);
		}
	});

	// Set specified or click event on each trigger element
	[].concat(toConsumableArray(document.querySelectorAll('[' + constants.CLASS + ']'))).forEach(function (trigger) {
		trigger.addEventListener(trigger.getAttribute(constants.EVENT) || 'click', function (event) {
			event.preventDefault();
			if (trigger.hasAttribute(constants.GROUP)) manageGroup(trigger);else manageToggle(trigger);
		}, false);
	});

	// Escape key management
	var triggerEscElements = [].concat(toConsumableArray(document.querySelectorAll('[' + constants.CLASS + '][' + constants.ESCAPE + ']')));
	if (triggerEscElements.length > 0) {
		document.addEventListener('keyup', function (event) {
			event = event || window.event;
			var isEscape = false;

			if ('key' in event) isEscape = event.key === 'Escape' || event.key === 'Esc';else isEscape = event.keyCode === 27;

			if (isEscape) {
				triggerEscElements.forEach(function (trigger) {
					if (trigger.isToggleActive) {
						if (trigger.hasAttribute(constants.GROUP)) console.warn("You can't use '" + constants.ESCAPE + "' on a grouped trigger");else manageToggle(trigger);
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

var src = {};

return src;

}());
