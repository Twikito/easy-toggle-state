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
import $$ from "../helpers/retrieveQuerySelectorAll";
import manageAria from "../helpers/manageAria";
import retrieveGroupActiveElement from "../helpers/retrieveGroupActiveElement";
import retrieveTargets from "../helpers/retrieveTargets";

/* Toggle off all 'toggle-outside' elements when reproducing specified or click event outside trigger or target elements. */
const documentEventHandler = event => {
	let target = event.target;
	if (!target.closest("[" + TARGET_STATE + '="true"]')) {
		$$(OUTSIDE).forEach(element => {
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
const triggerOffHandler = event => {
	manageToggle(event.target.targetElement);
};

/* Manage attributes and events of target elements. */
const manageTarget = (targetElement, triggerElement) => {
	targetElement.isToggleActive = !targetElement.isToggleActive;
	manageAria(targetElement);

	if (triggerElement.hasAttribute(OUTSIDE)) {
		targetElement.setAttribute(TARGET_STATE, triggerElement.isToggleActive);
	}

	let triggerOffList = $$(TRIGGER_OFF, targetElement);
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

/* Toggle class and aria on trigger and target elements. */
const manageToggle = element => {
	let className = element.getAttribute(CLASS) || "is-active";
	element.isToggleActive = !element.isToggleActive;
	manageAria(element);

	if (!element.hasAttribute(TARGET_ONLY)) {
		element.classList.toggle(className);
	}

	let targetElements = retrieveTargets(element);
	for (let i = 0; i < targetElements.length; i++) {
		targetElements[i].classList.toggle(className);
		manageTarget(targetElements[i], element);
	}

	manageTriggerOutside(element);
};

/* Manage event ouside trigger or target elements. */
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

/* Toggle elements of a same group. */
const manageGroup = element => {
	let groupActiveElements = retrieveGroupActiveElement(element.getAttribute(GROUP));

	if (groupActiveElements.length > 0) {
		if (groupActiveElements.indexOf(element) === -1) {
			groupActiveElements.forEach(manageToggle);
			manageToggle(element);
		}
	} else {
		manageToggle(element);
	}
};

/* Toggle elements set to be active by default. */
const manageActiveByDefault = element => {
	let className = element.getAttribute(CLASS) || "is-active";
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

	let targetElements = retrieveTargets(element);
	for (let i = 0; i < targetElements.length; i++) {
		if (!targetElements[i].classList.contains(className)) {
			targetElements[i].classList.add(className);
		}
		manageTarget(targetElements[i], element);
	}

	manageTriggerOutside(element);
};

/* Initialization. */
export default () => {

	/* Active by default management. */
	$$(IS_ACTIVE).forEach(trigger => {
		if (trigger.hasAttribute(GROUP)) {
			let group = trigger.getAttribute(GROUP);
			if (retrieveGroupActiveElement(group).length > 0) {
				console.warn(`Toggle group '${group}' must not have more than one trigger with '${IS_ACTIVE}'`);
			} else {
				manageActiveByDefault(trigger);
			}
		} else {
			manageActiveByDefault(trigger);
		}
	});

	/* Set specified or click event on each trigger element. */
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

	/* Escape key management. */
	let triggerEscElements = $$(ESCAPE);
	if (triggerEscElements.length > 0) {
		document.addEventListener(
			"keyup",
			event => {
				event = event || window.event;
				let isEscape = false;

				if ("key" in event) {
					isEscape = event.key === "Escape" || event.key === "Esc";
				} else {
					isEscape = event.keyCode === 27;
				}

				if (isEscape) {
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
