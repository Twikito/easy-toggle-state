/*
	-------------------------------------------------------------------
	easy-toggle-state
	A tiny JavaScript plugin to toggle the state of any HTML element in most of contexts with ease.

	@version v1.0.0
	@link https://github.com/Twikito/easy-toggle-state#readme
	@license MIT : https://github.com/Twikito/easy-toggle-state/blob/master/LICENSE
	-------------------------------------------------------------------
*/

'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function (document) {

	var TOGGLE_CLASS_PREFIX = 'toggle-'; // Prefix should end by hyphen

	var ATTR_CLASS = 'data-' + TOGGLE_CLASS_PREFIX + 'class',
	    ATTR_TARGET_ALL = 'data-' + TOGGLE_CLASS_PREFIX + 'target-all',
	    ATTR_TARGET_PARENT = 'data-' + TOGGLE_CLASS_PREFIX + 'target-parent',
	    ATTR_TARGET_SELF = 'data-' + TOGGLE_CLASS_PREFIX + 'target-self',
	    ATTR_IS_ACTIVE = 'data-' + TOGGLE_CLASS_PREFIX + 'is-active',
	    ATTR_GROUP = 'data-' + TOGGLE_CLASS_PREFIX + 'group',
	    ATTR_EVENT = 'data-' + TOGGLE_CLASS_PREFIX + 'event',
	    ATTR_OUTSIDE = 'data-' + TOGGLE_CLASS_PREFIX + 'outside',
	    ATTR_TARGET_ONLY = 'data-' + TOGGLE_CLASS_PREFIX + 'target-only',
	    ATTR_ESCAPE = 'data-' + TOGGLE_CLASS_PREFIX + 'escape',
	    ATTR_TRIGGER_OFF = 'data-' + TOGGLE_CLASS_PREFIX + 'trigger-off',
	    ATTR_TARGET_STATE = 'data-' + TOGGLE_CLASS_PREFIX + 'state';

	var ATTR_EXPANDED = 'aria-expanded',
	    ATTR_SELECTED = 'aria-selected';

	// Retrieve all targets of a trigger element
	var retrieveTargets = function retrieveTargets(element) {
		if (element.hasAttribute(ATTR_TARGET_ALL)) return document.querySelectorAll(element.getAttribute(ATTR_TARGET_ALL));else if (element.hasAttribute(ATTR_TARGET_PARENT)) return element.parentElement.querySelectorAll(element.getAttribute(ATTR_TARGET_PARENT));else if (element.hasAttribute(ATTR_TARGET_SELF)) return element.querySelectorAll(element.getAttribute(ATTR_TARGET_SELF));
		return [];
	};

	// Retrieve all active trigger of a group
	var retrieveGroupState = function retrieveGroupState(group) {
		var activeGroupElements = [];
		[].concat(_toConsumableArray(document.querySelectorAll('[' + ATTR_CLASS + '][' + ATTR_GROUP + '="' + group + '"]'))).forEach(function (groupElement) {
			if (groupElement.isToggleActive) activeGroupElements.push(groupElement);
		});
		return activeGroupElements;
	};

	// Toggle off all 'toggle-outside' elements when reproducing specified or click event outside trigger or target elements
	var documentEventHandler = function documentEventHandler(event) {
		var target = event.target;

		if (!target.closest('[' + ATTR_TARGET_STATE + '="true"]')) {
			[].concat(_toConsumableArray(document.querySelectorAll('[' + ATTR_CLASS + '][' + ATTR_OUTSIDE + ']'))).forEach(function (element) {
				if (element != target && element.isToggleActive) if (element.hasAttribute(ATTR_GROUP)) manageGroup(element);else manageToggle(element);
			});
			if (target.hasAttribute(ATTR_OUTSIDE) && target.isToggleActive) document.addEventListener(target.getAttribute(ATTR_EVENT) || 'click', documentEventHandler, false);
		}
	};

	// Manage click on 'trigger-off' elements
	var triggerOffHandler = function triggerOffHandler(event) {
		manageToggle(event.target.targetElement);
	};

	// Manage event ouside trigger or target elements
	var manageTriggerOutside = function manageTriggerOutside(element) {
		if (element.hasAttribute(ATTR_OUTSIDE)) {
			if (element.hasAttribute(ATTR_GROUP)) console.error("You can't use '" + ATTR_OUTSIDE + "' on a grouped trigger");else {
				if (element.isToggleActive) document.addEventListener(element.getAttribute(ATTR_EVENT) || 'click', documentEventHandler, false);else document.removeEventListener(element.getAttribute(ATTR_EVENT) || 'click', documentEventHandler, false);
			}
		}
	};

	// Manage attributes and events of target elements
	var manageTarget = function manageTarget(targetElement, triggerElement) {
		if (triggerElement.hasAttribute(ATTR_OUTSIDE)) targetElement.setAttribute(ATTR_TARGET_STATE, triggerElement.isToggleActive);

		var triggerOffList = targetElement.querySelectorAll('[' + ATTR_TRIGGER_OFF + ']');
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
		var activeGroupElements = retrieveGroupState(element.getAttribute(ATTR_GROUP));

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
		var className = element.getAttribute(ATTR_CLASS);
		element.isToggleActive = !element.isToggleActive;
		//console.log("toggle to "+element.isToggleActive);

		if (!element.hasAttribute(ATTR_TARGET_ONLY)) element.classList.toggle(className);

		if (element.hasAttribute(ATTR_EXPANDED)) element.setAttribute(ATTR_EXPANDED, element.isToggleActive);

		if (element.hasAttribute(ATTR_SELECTED)) element.setAttribute(ATTR_SELECTED, element.isToggleActive);

		var targetElements = retrieveTargets(element);
		for (var i = 0; i < targetElements.length; i++) {
			targetElements[i].classList.toggle(className);
			manageTarget(targetElements[i], element);
		}

		manageTriggerOutside(element);
	};

	var manageActiveByDefault = function manageActiveByDefault(element) {
		element.isToggleActive = true;
		var className = element.getAttribute(ATTR_CLASS);

		if (!element.hasAttribute(ATTR_TARGET_ONLY) && !element.classList.contains(className)) element.classList.add(className);

		if (element.hasAttribute(ATTR_EXPANDED) && element.getAttribute(ATTR_EXPANDED)) element.setAttribute(ATTR_EXPANDED, true);

		if (element.hasAttribute(ATTR_SELECTED) && !element.getAttribute(ATTR_SELECTED)) element.setAttribute(ATTR_SELECTED, true);

		var targetElements = retrieveTargets(element);
		for (var i = 0; i < targetElements.length; i++) {
			if (!targetElements[i].classList.contains(element.getAttribute(ATTR_CLASS))) targetElements[i].classList.add(className);
			manageTarget(targetElements[i], element);
		}

		manageTriggerOutside(element);
	};

	// Initialization
	var init = function init() {

		// Active by default management
		[].concat(_toConsumableArray(document.querySelectorAll('[' + ATTR_CLASS + '][' + ATTR_IS_ACTIVE + ']'))).forEach(function (trigger) {
			if (trigger.hasAttribute(ATTR_GROUP)) {
				var group = trigger.getAttribute(ATTR_GROUP);
				if (retrieveGroupState(group).length > 0) console.error("Toggle group '" + group + "' must not have more than one trigger with '" + ATTR_IS_ACTIVE + "'");else manageActiveByDefault(trigger);
			} else {
				manageActiveByDefault(trigger);
			}
		});

		// Set specified or click event on each trigger element
		[].concat(_toConsumableArray(document.querySelectorAll('[' + ATTR_CLASS + ']'))).forEach(function (trigger) {
			trigger.addEventListener(trigger.getAttribute(ATTR_EVENT) || 'click', function (event) {
				event.preventDefault();
				if (trigger.hasAttribute(ATTR_GROUP)) manageGroup(trigger);else manageToggle(trigger);
			}, false);
		});

		// Escape key management
		var triggerEscElements = [].concat(_toConsumableArray(document.querySelectorAll('[' + ATTR_CLASS + '][' + ATTR_ESCAPE + ']')));
		if (triggerEscElements.length > 0) {
			document.addEventListener('keyup', function (event) {
				event = event || window.event;
				var isEscape = false;

				if ('key' in event) isEscape = event.key === 'Escape' || event.key === 'Esc';else isEscape = event.keyCode === 27;

				if (isEscape) {
					triggerEscElements.forEach(function (trigger) {
						if (trigger.isToggleActive) {
							if (trigger.hasAttribute(ATTR_GROUP)) console.error("You can't use '" + ATTR_ESCAPE + "' on a grouped trigger");else manageToggle(trigger);
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
})(document);