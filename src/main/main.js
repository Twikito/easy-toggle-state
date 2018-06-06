import {
	CHECKED,
	CLASS,
	ESCAPE,
	EVENT,
	EXPANDED,
	GROUP,
	HIDDEN,
	IS_ACTIVE,
	OUTSIDE,
	SELECTED,
	TARGET_ONLY,
	TARGET_STATE,
	TRIGGER_OFF
} from "../constants/constants";
import $$ from "../helpers/retrieve-query-selector-all";
import manageAria from "../helpers/manage-aria";
import retrieveGroupActiveElement from "../helpers/retrieve-group-active-element";
import retrieveTargets from "../helpers/retrieve-targets";

/**
 * Toggle off all elements width 'data-toggle-outside' attribute
 * when reproducing specified or click event outside itself or its targets.
 * @param {event} event - Event triggered on document
 * @returns {undefined}
 */
const documentEventHandler = event => {
	const target = event.target;
	if (!target.closest("[" + TARGET_STATE + '="true"]')) {
		$$(OUTSIDE).forEach(element => {
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
const triggerOffHandler = event => {
	manageToggle(event.target.targetElement);
};

/**
 * Manage attributes and events of target elements.
 * @param {node} targetElement - An element targeted by the trigger element
 * @param {node} triggerElement - The trigger element
 * @returns {undefined}
 */
const manageTarget = (targetElement, triggerElement) => {
	targetElement.isToggleActive = !targetElement.isToggleActive;
	manageAria(targetElement);

	if (triggerElement.hasAttribute(OUTSIDE)) {
		targetElement.setAttribute(TARGET_STATE, triggerElement.isToggleActive);
	}

	const triggerOffList = $$(TRIGGER_OFF, targetElement);
	if (triggerOffList.length > 0) {
		if (triggerElement.isToggleActive) {
			triggerOffList.forEach(triggerOff => {
				triggerOff.targetElement = triggerElement;
				triggerOff.addEventListener("click", triggerOffHandler, false);
			});
		} else {
			triggerOffList.forEach(triggerOff => {
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
const manageToggle = element => {
	const className = element.getAttribute(CLASS) || "is-active";
	element.isToggleActive = !element.isToggleActive;
	manageAria(element);

	if (!element.hasAttribute(TARGET_ONLY)) {
		element.classList.toggle(className);
	}

	const targetElements = retrieveTargets(element);
	for (let i = 0; i < targetElements.length; i++) {
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
const manageTriggerOutside = element => {
	if (element.hasAttribute(OUTSIDE)) {
		if (element.hasAttribute(GROUP)) {
			console.warn(`You can't use '${OUTSIDE}' on a grouped trigger`);
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
const manageGroup = element => {
	const groupActiveElements = retrieveGroupActiveElement(element.getAttribute(GROUP));

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
const manageActiveByDefault = element => {
	const className = element.getAttribute(CLASS) || "is-active";
	element.isToggleActive = true;
	manageAria(element, {
		[CHECKED]: true,
		[EXPANDED]: true,
		[HIDDEN]: false,
		[SELECTED]: true
	});

	if (!element.hasAttribute(TARGET_ONLY) && !element.classList.contains(className)) {
		element.classList.add(className);
	}

	const targetElements = retrieveTargets(element);
	for (let i = 0; i < targetElements.length; i++) {
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
export default () => {

	/** Active by default management. */
	$$(IS_ACTIVE).forEach(trigger => {
		if (trigger.hasAttribute(GROUP)) {
			const group = trigger.getAttribute(GROUP);
			if (retrieveGroupActiveElement(group).length > 0) {
				console.warn(`Toggle group '${group}' must not have more than one trigger with '${IS_ACTIVE}'`);
			} else {
				manageActiveByDefault(trigger);
			}
		} else {
			manageActiveByDefault(trigger);
		}
	});

	/** Set specified or click event on each trigger element. */
	$$().forEach(trigger => {
		trigger.addEventListener(
			trigger.getAttribute(EVENT) || "click",
			event => {
				event.preventDefault();
				(trigger.hasAttribute(GROUP) ? manageGroup : manageToggle)(trigger);
			},
			false
		);
	});

	/** Escape key management. */
	const triggerEscElements = $$(ESCAPE);
	if (triggerEscElements.length > 0) {
		document.addEventListener(
			"keyup",
			event => {
				event = event || window.event;
				if (event.key === "Escape" || event.key === "Esc") {
					triggerEscElements.forEach(trigger => {
						if (trigger.isToggleActive) {
							if (trigger.hasAttribute(GROUP)) {
								console.warn(`You can't use '${ESCAPE}' on a grouped trigger`);
							} else {
								manageToggle(trigger);
							}
						}
					});
				}
			},
			false
		);
	}
};
