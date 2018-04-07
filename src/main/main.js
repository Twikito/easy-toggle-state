import {
	CLASS,
	ESCAPE,
	EVENT,
	EXPANDED,
	GROUP,
	IS_ACTIVE,
	OUTSIDE,
	SELECTED,
	TARGET_ONLY,
	TARGET_STATE,
	TRIGGER_OFF
} from "../constants/constants";
import $$ from "../helpers/retrieveQuerySelectorAll.js";
import retrieveGroupState from "../helpers/retrieveGroupState";
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
	if (triggerElement.hasAttribute(OUTSIDE)) {
		targetElement.setAttribute(TARGET_STATE, triggerElement.isToggleActive);
	}

	let triggerOffList = targetElement.querySelectorAll("[" + TRIGGER_OFF + "]");
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
	//console.log("toggle to "+element.isToggleActive);

	if (!element.hasAttribute(TARGET_ONLY)) {
		element.classList.toggle(className);
	}

	if (element.hasAttribute(EXPANDED)) {
		element.setAttribute(EXPANDED, element.isToggleActive);
	}

	if (element.hasAttribute(SELECTED)) {
		element.setAttribute(SELECTED, element.isToggleActive);
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
	let activeGroupElements = retrieveGroupState(element.getAttribute(GROUP));

	if (activeGroupElements.length > 0) {
		if (activeGroupElements.indexOf(element) === -1) {
			activeGroupElements.forEach(groupElement => {
				manageToggle(groupElement);
			});
			manageToggle(element);
		}
	} else {
		manageToggle(element);
	}
};

/* Toggle elements set to be active by default. */
const manageActiveByDefault = element => {
	element.isToggleActive = true;
	let className = element.getAttribute(CLASS) || "is-active";

	if (!element.hasAttribute(TARGET_ONLY) && !element.classList.contains(className)) {
		element.classList.add(className);
	}

	if (element.hasAttribute(EXPANDED) && element.getAttribute(EXPANDED)) {
		element.setAttribute(EXPANDED, true);
	}

	if (element.hasAttribute(SELECTED) && !element.getAttribute(SELECTED)) {
		element.setAttribute(SELECTED, true);
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
const init = () => {

	/* Active by default management. */
	$$(IS_ACTIVE).forEach(trigger => {
		if (trigger.hasAttribute(GROUP)) {
			let group = trigger.getAttribute(GROUP);
			if (retrieveGroupState(group).length > 0) {
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

export default init;
