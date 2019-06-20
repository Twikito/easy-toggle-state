import {
	ARROWS,
	CHECKED,
	CLASS,
	ESCAPE,
	EVENT,
	EXPANDED,
	GROUP,
	HIDDEN,
	IS_ACTIVE,
	OUTSIDE,
	OUTSIDE_EVENT,
	PRESSED,
	RADIO_GROUP,
	SELECTED,
	TARGET_ONLY,
	TARGET_STATE,
	TRIGGER_OFF
} from "../constants/constants";
import { TOGGLE_AFTER, TOGGLE_BEFORE } from "../constants/events";
import $$ from "../helpers/retrieve-query-selector-all";
import dispatchHook from "../helpers/dispatch-hook";
import manageAria from "../helpers/manage-aria";
import retrieveGroupActiveElement from "../helpers/retrieve-group-active-element";
import retrieveTargets from "../helpers/retrieve-targets";

/**
 * Manage event listener on document
 * @param {element} element - The element on which test if there event type specified
 * @returns {undefined}
 */
const addEventListenerOnDocument = element => document.addEventListener(
		element.getAttribute(OUTSIDE_EVENT) || element.getAttribute(EVENT) || "click",
		documentEventHandler,
		false
	);

/**
 * Toggle off all elements width 'data-toggle-outside' attribute
 * when reproducing specified or click event outside itself or its targets.
 * @param {event} event - Event triggered on document
 * @returns {undefined}
 */
const documentEventHandler = event => {
	const eTarget = event.target,
		eType = event.type;
	let insideTarget = false;

	$$(OUTSIDE)
		.filter(element => element.getAttribute(OUTSIDE_EVENT) === eType ||
				(element.getAttribute(EVENT) === eType && !element.hasAttribute(OUTSIDE_EVENT)) ||
				(eType === "click" && !element.hasAttribute(EVENT) && !element.hasAttribute(OUTSIDE_EVENT)))
		.forEach(element => {
			const e = eTarget.closest("[" + TARGET_STATE + '="true"]');
			if (e && e.easyToggleStateTrigger === element) {
				insideTarget = true;
			}
			if (!insideTarget && element !== eTarget && element.isToggleActive) {
				(element.hasAttribute(GROUP) || element.hasAttribute(RADIO_GROUP) ? manageGroup : manageToggle)(element);
			}
		});

	if (!insideTarget) {
		document.removeEventListener(eType, documentEventHandler, false);
	}

	if (eTarget.hasAttribute(OUTSIDE) && eTarget.isToggleActive) {
		addEventListenerOnDocument(eTarget);
	}
};

/**
 * Manage click on elements with 'data-trigger-off' attribute.
 * @param {event} event - Event triggered on element with 'trigger-off' attribute
 * @returns {undefined}
 */
const triggerOffHandler = event => manageToggle(event.currentTarget.targetElement);

/**
 * Manage event ouside trigger or target elements.
 * @param {node} element - The element to toggle when 'click' or custom event is triggered on document
 * @returns {undefined}
 */
const manageTriggerOutside = element => {
	if (!element.hasAttribute(OUTSIDE)) {
		return;
	}

	if (element.hasAttribute(RADIO_GROUP)) {
		return console.warn(`You can't use '${OUTSIDE}' on a radio grouped trigger`);
	}

	if (element.isToggleActive) {
		return addEventListenerOnDocument(element);
	}
};

/**
 * Manage elements inside a target element which have 'data-toggle-trigger-off' attribute.
 * @param {node} targetElement - An element targeted by the trigger element
 * @param {node} triggerElement - The trigger element
 * @returns {undefined}
 */
const manageTriggerOff = (targetElement, triggerElement) => {
	const triggerOffList = $$(TRIGGER_OFF, targetElement);

	if (triggerOffList.length === 0) {
		return;
	}

	if (triggerElement.isToggleActive) {
		return triggerOffList.forEach(triggerOff => {
			triggerOff.targetElement = triggerElement;
			triggerOff.addEventListener("click", triggerOffHandler, false);
		});
	}

	triggerOffList.forEach(triggerOff => {
		triggerOff.removeEventListener("click", triggerOffHandler, false);
	});
	return triggerElement.focus();
};

/**
 * Manage attributes and events of targets elements.
 * @param {node} triggerElement - The trigger element
 * @param {string} className - The class name to toggle
 * @param {boolean} onLoadActive - A flag for active by default
 * @returns {undefined}
 */
const manageTargets = (triggerElement, className, onLoadActive) => retrieveTargets(triggerElement).forEach(targetElement => {
		dispatchHook(targetElement, TOGGLE_BEFORE);

		targetElement.isToggleActive = !targetElement.isToggleActive;
		manageAria(targetElement);

		if (onLoadActive && !targetElement.classList.contains(className)) {
			targetElement.classList.add(className);
		}

		if (!onLoadActive) {
			targetElement.classList.toggle(className);
		}

		if (triggerElement.hasAttribute(OUTSIDE)) {
			targetElement.setAttribute(TARGET_STATE, triggerElement.isToggleActive);
			targetElement.easyToggleStateTrigger = triggerElement;
		}

		dispatchHook(targetElement, TOGGLE_AFTER);

		manageTriggerOff(targetElement, triggerElement);
	});

/**
 * Toggle class and aria on trigger and target elements.
 * @param {node} element - The element to toggle state and attributes
 * @returns {undefined}
 */
const manageToggle = element => {
	dispatchHook(element, TOGGLE_BEFORE);

	const className = element.getAttribute(CLASS) || "is-active";
	element.isToggleActive = !element.isToggleActive;
	manageAria(element);

	if (!element.hasAttribute(TARGET_ONLY)) {
		element.classList.toggle(className);
	}

	dispatchHook(element, TOGGLE_AFTER);

	manageTargets(element, className, false);
	return manageTriggerOutside(element);
};

/**
 * Toggle elements set to be active by default.
 * @param {node} element - The element to activate on page load
 * @returns {undefined}
 */
const manageActiveByDefault = element => {
	dispatchHook(element, TOGGLE_BEFORE);

	const className = element.getAttribute(CLASS) || "is-active";
	element.isToggleActive = true;
	manageAria(element, {
		[CHECKED]: true,
		[EXPANDED]: true,
		[HIDDEN]: false,
		[PRESSED]: true,
		[SELECTED]: true
	});

	if (!element.hasAttribute(TARGET_ONLY) && !element.classList.contains(className)) {
		element.classList.add(className);
	}

	dispatchHook(element, TOGGLE_AFTER);

	manageTargets(element, className, true);
	return manageTriggerOutside(element);
};

/**
 * Toggle elements of a same group.
 * @param {node} element - The element to test if it's in a group
 * @returns {undefined}
 */
const manageGroup = element => {
	const groupActiveElements = retrieveGroupActiveElement(element);
	if (groupActiveElements.length === 0) {
		return manageToggle(element);
	}

	if (groupActiveElements.indexOf(element) === -1) {
		groupActiveElements.forEach(manageToggle);
		return manageToggle(element);
	}

	if (groupActiveElements.indexOf(element) !== -1 && !element.hasAttribute(RADIO_GROUP)) {
		return manageToggle(element);
	}
};

/**
 * Initialization.
 * @returns {array} - An array of initialized triggers
 */
export default () => {

	/** Active by default management. */
	$$(IS_ACTIVE)
		.filter(trigger => !trigger.isETSDefInit)
		.forEach(trigger => {
			if (!trigger.hasAttribute(GROUP) && !trigger.hasAttribute(RADIO_GROUP)) {
				return manageActiveByDefault(trigger);
			}

			if (retrieveGroupActiveElement(trigger).length > 0) {
				return console.warn(`Toggle group '${trigger.getAttribute(GROUP) ||
						trigger.getAttribute(RADIO_GROUP)}' must not have more than one trigger with '${IS_ACTIVE}'`);
			}

			manageActiveByDefault(trigger);
			trigger.isETSDefInit = true;
		});

	/** Set specified or click event on each trigger element. */
	const triggerList = $$().filter(trigger => !trigger.isETSInit);
	triggerList.forEach(trigger => {
		trigger.addEventListener(
			trigger.getAttribute(EVENT) || "click",
			event => {
				event.preventDefault();
				(trigger.hasAttribute(GROUP) || trigger.hasAttribute(RADIO_GROUP) ? manageGroup : manageToggle)(trigger);
			},
			false
		);
		trigger.isETSInit = true;
	});

	/** Escape key management. */
	if ($$(ESCAPE).length > 0 && !document.isETSEscInit) {
		document.addEventListener(
			"keydown",
			event => {
				if (!(event.key === "Escape") && !(event.key === "Esc")) {
					return;
				}
				$$(ESCAPE).forEach(trigger => {
					if (!trigger.isToggleActive) {
						return;
					}

					if (trigger.hasAttribute(RADIO_GROUP)) {
						return console.warn(`You can't use '${ESCAPE}' on a radio grouped trigger`);
					}

					return (trigger.hasAttribute(GROUP) ? manageGroup : manageToggle)(trigger);
				});
			},
			false
		);
		document.isETSEscInit = true;
	}

	/** Arrows key management. */
	if ($$(ARROWS).length > 0 && !document.isETSArrInit) {
		document.addEventListener(
			"keydown",
			event => {
				const activeElement = document.activeElement;
				if (
					["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"].indexOf(event.key) === -1 ||
					!activeElement.hasAttribute(CLASS) ||
					!activeElement.hasAttribute(ARROWS)
				) {
					return;
				}

				if (!activeElement.hasAttribute(GROUP) && !activeElement.hasAttribute(RADIO_GROUP)) {
					return console.warn(`You can't use '${ARROWS}' on a trigger without '${GROUP}' or '${RADIO_GROUP}'`);
				}

				event.preventDefault();

				const groupList = activeElement.hasAttribute(GROUP)
					? $$(`${GROUP}='${activeElement.getAttribute(GROUP)}'`)
					: $$(`${RADIO_GROUP}='${activeElement.getAttribute(RADIO_GROUP)}'`);

				let newElement = activeElement;
				switch (event.key) {
					case "ArrowUp":
					case "ArrowLeft":
						newElement =
							groupList.indexOf(activeElement) > 0
								? groupList[groupList.indexOf(activeElement) - 1]
								: groupList[groupList.length - 1];
						break;
					case "ArrowDown":
					case "ArrowRight":
						newElement =
							groupList.indexOf(activeElement) < groupList.length - 1
								? groupList[groupList.indexOf(activeElement) + 1]
								: groupList[0];
						break;
					case "Home":
						newElement = groupList[0];
						break;
					case "End":
						newElement = groupList[groupList.length - 1];
						break;
					default:
				}

				newElement.focus();
				return newElement.dispatchEvent(new Event(newElement.getAttribute(EVENT) || "click"));
			},
			false
		);
		document.isETSArrInit = true;
	}

	return triggerList;
};
