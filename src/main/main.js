import {
	ARROWS,
	CLASS,
	CLASS_TARGET,
	CLASS_TRIGGER,
	ESCAPE,
	EVENT,
	GROUP,
	IS_ACTIVE,
	MODAL,
	OUTSIDE,
	OUTSIDE_EVENT,
	RADIO_GROUP,
	TARGET,
	TARGET_ALL,
	TARGET_NEXT,
	TARGET_PARENT,
	TARGET_PREVIOUS,
	TARGET_SELF,
	TARGET_STATE,
	TRIGGER_OFF
} from "../constants/constants";
import { TOGGLE_AFTER, TOGGLE_BEFORE } from "../constants/events";
import $$ from "../helpers/retrieve-query-selector-all";
import dispatchHook from "../helpers/dispatch-hook";
import manageAria from "../helpers/manage-aria";
import namespacedProp from "../helpers/retrieve-namespaced-property";
import retrieveClassList from "../helpers/retrieve-class-list";
import retrieveGroupActiveElement from "../helpers/retrieve-group-active-element";
import retrieveTargets from "../helpers/retrieve-targets";
import toggleClassList from "../helpers/toggle-class-list";

/** Need to use a map for some event handler to ensure to have the same signature */
const HANDLER_MAP = {};

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
			const e = eTarget.closest(`[${TARGET_STATE}="true"]`);
			if (e && e[namespacedProp('trigger')] === element) {
				insideTarget = true;
			}
			if (!insideTarget && element !== eTarget && !element.contains(eTarget) && element[namespacedProp('isActive')]) {
				(element.hasAttribute(GROUP) || element.hasAttribute(RADIO_GROUP) ? manageGroup : manageToggle)(element);
			}
		});

	if (!insideTarget) {
		document.removeEventListener(eType, documentEventHandler, false);
	}

	// eTarget may be an element inside a trigger
	const newTarget = eTarget.closest(`[${CLASS}][${OUTSIDE}],[${CLASS_TRIGGER}][${OUTSIDE}],[${CLASS_TARGET}][${OUTSIDE}]`);
	if (newTarget && newTarget[namespacedProp('isActive')]) {
		addEventListenerOnDocument(eTarget);
	}
};

/**
 * Manage click on elements with 'data-trigger-off' attribute.
 * @param {event} event - Event triggered on element with 'trigger-off' attribute
 * @returns {undefined}
 */
const triggerOffHandler = event => manageToggle(event.currentTarget[namespacedProp('target')]);

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

	if (element[namespacedProp('isActive')]) {
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
	const triggerOffList = $$(TRIGGER_OFF, targetElement).filter(triggerOff => !triggerOff.getAttribute(TRIGGER_OFF) || targetElement.matches(triggerOff.getAttribute(TRIGGER_OFF)));

	if (triggerOffList.length === 0) {
		return;
	}

	if (triggerElement[namespacedProp('isActive')]) {
		return triggerOffList.forEach(triggerOff => {
			// Do not override if another reference is already set
			if (!triggerOff[namespacedProp('target')]) {
				triggerOff[namespacedProp('target')] = triggerElement;
				triggerOff.addEventListener("click", triggerOffHandler, false);
			}
		});
	}

	triggerOffList.forEach(triggerOff => {
		// Remove reference only if it equals current trigger
		if (triggerOff[namespacedProp('target')] === triggerElement) {
			triggerOff[namespacedProp('target')] = null;
			triggerOff.removeEventListener("click", triggerOffHandler, false);
		}
	});
	return triggerElement.focus();
};

/**
 * Manage focus trap inside a target element:
 * When Tab key is pressed, if focus is outside of the container, give focus on first item ;
 * when Tab key is pressed, if focus is on last item, give focus on first one ;
 * when Shift + Tab keys are pressed, if focus is on first item, give focus on last one.
 * @param {node} targetElement - The focus trap container
 * @returns {undefined}
 */
const focusTrapHandler = targetElement => event => {
	const focusablesList = [...targetElement.querySelectorAll("a[href], area[href], input:not([type='hidden']):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]")];

	if (!focusablesList.length || event.key !== "Tab") {
		return;
	}

	const currentItem = event.target,
		firstItem = focusablesList[0],
		lastItem = focusablesList[focusablesList.length - 1];

	// Outside focus trap container: focus on first
	if (focusablesList.indexOf(currentItem) === -1) {
		event.preventDefault();
		return firstItem.focus();
	}

	if (event.shiftKey && currentItem === firstItem) {
		event.preventDefault();
		return lastItem.focus();
	}

	if (!event.shiftKey && currentItem === lastItem) {
		event.preventDefault();
		return firstItem.focus();
	}
};

/**
 * Manage attributes and events of targets elements.
 * @param {node} triggerElement - The trigger element
 * @param {array} classListForTarget - The class list to toggle
 * @param {boolean} onLoadActive - A flag for active by default
 * @returns {undefined}
 */
const manageTargets = (triggerElement, classListForTarget, onLoadActive) => retrieveTargets(triggerElement).forEach(targetElement => {
		dispatchHook(targetElement, TOGGLE_BEFORE);

		targetElement[namespacedProp('isActive')] = !targetElement[namespacedProp('isActive')];
		manageAria(targetElement);

		if (onLoadActive) {
			targetElement.classList.add(...classListForTarget);
		} else {
			toggleClassList(targetElement, classListForTarget);
		}

		if (triggerElement.hasAttribute(OUTSIDE)) {
			targetElement.setAttribute(TARGET_STATE, triggerElement[namespacedProp('isActive')]);
			targetElement[namespacedProp('trigger')] = triggerElement;
		}

		if (triggerElement.hasAttribute(MODAL)) {
			if (targetElement[namespacedProp('isActive')]) {
				HANDLER_MAP[targetElement] = focusTrapHandler(targetElement);
				document.addEventListener("keydown", HANDLER_MAP[targetElement], false);
			} else {
				document.removeEventListener("keydown", HANDLER_MAP[targetElement], false);
				delete HANDLER_MAP[targetElement];
			}
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

	const classList = retrieveClassList(element);
	toggleClassList(element, classList.trigger);
	element[namespacedProp('isActive')] = !element[namespacedProp('isActive')];
	manageAria(element);

	dispatchHook(element, TOGGLE_AFTER);

	manageTargets(element, classList.target, false);
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
 * Check if a trigger element is active.
 * @param {node} element - A trigger element
 * @returns {boolean} - The active state of the trigger element
 */
export const isActive = element => !!element[namespacedProp('isActive')];

/**
 * Unbind toggling management from an element list.
 * @param {node} elementList - An element, or element list, on which remove the toggling management
 * @returns {node} - Same element, or element list
 */
export const unbind = elementList => {
	(elementList[Symbol.iterator] ? [...elementList] : [elementList]).forEach(element => {
		element[namespacedProp('unbind')] && element[namespacedProp('unbind')]();
	});
	return elementList;
};

/**
 * Unbind toggling management from all initialized elements in the page.
 * @returns {nodeList} - A list of unbinded triggers
 */
export const unbindAll = () => unbind($$().filter(trigger => trigger[namespacedProp('isInitialized')]));

/**
 * Initialization.
 * @returns {array} - An array of initialized triggers
 */
export default () => {

	/**
	 * Warn if there some CLASS_TARGET triggers with no specified target.
	 */
	[...document.querySelectorAll(`[${CLASS_TARGET}]:not([${TARGET}]):not([${TARGET_ALL}]):not([${TARGET_NEXT}]):not([${TARGET_PREVIOUS}]):not([${TARGET_PARENT}]):not([${TARGET_SELF}])`)]
		.forEach(element => {
			console.warn(`This trigger has the attribute '${CLASS_TARGET}', but no specified target\n`, element);
		});

	/**
	 * Active by default management.
	 */
	$$(IS_ACTIVE)
		.filter(trigger => !trigger[namespacedProp('isDefaultInitialized')])
		.forEach(trigger => {
			if ((trigger.hasAttribute(GROUP) || trigger.hasAttribute(RADIO_GROUP)) && retrieveGroupActiveElement(trigger).length > 0) {
				return console.warn(`Toggle group '${trigger.getAttribute(GROUP) ||
						trigger.getAttribute(RADIO_GROUP)}' must not have more than one trigger with '${IS_ACTIVE}'`);
			}
			manageToggle(trigger);
			trigger[namespacedProp('isDefaultInitialized')] = true;
		});

	/**
	 * Set specified or click event on each trigger element.
	 */
	const triggerList = $$().filter(trigger => !trigger[namespacedProp('isInitialized')]);
	triggerList.forEach(trigger => {
		const handler = event => {
			event.preventDefault();
			(trigger.hasAttribute(GROUP) || trigger.hasAttribute(RADIO_GROUP) ? manageGroup : manageToggle)(trigger);
		}
		const eventName = trigger.getAttribute(EVENT) || "click";
		trigger.addEventListener(eventName, handler, false);
		trigger[namespacedProp('unbind')] = () => {
			trigger.removeEventListener(eventName, handler, false);
			trigger[namespacedProp('isInitialized')] = false;
		}
		trigger[namespacedProp('isInitialized')] = true;
	});

	/**
	 * Escape key management.
	 */
	if ($$(ESCAPE).length > 0 && !document[namespacedProp('isEscapeKeyInitialized')]) {
		document.addEventListener(
			"keydown",
			event => {
				if (!(event.key === "Escape") && !(event.key === "Esc")) {
					return;
				}
				$$(ESCAPE).forEach(trigger => {
					if (!trigger[namespacedProp('isActive')]) {
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
		document[namespacedProp('isEscapeKeyInitialized')] = true;
	}

	/**
	 * Arrows key management.
	 */
	if ($$(ARROWS).length > 0 && !document[namespacedProp('isArrowKeysInitialized')]) {
		document.addEventListener(
			"keydown",
			event => {
				const activeElement = document.activeElement;
				if (
					["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"].indexOf(event.key) === -1 ||
					(!activeElement.hasAttribute(CLASS) && !activeElement.hasAttribute(CLASS_TRIGGER) && !activeElement.hasAttribute(CLASS_TARGET)) ||
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
		document[namespacedProp('isArrowKeysInitialized')] = true;
	}

	return triggerList;
};
