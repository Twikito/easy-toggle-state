import { ATTR }
	from './_constants';

import { retrieveTargets, retrieveGroupState }
	from './_helpers';

import { documentEventHandler, triggerOffHandler }
	from './_handlers';


// Manage event ouside trigger or target elements
export const manageTriggerOutside = element => {
	if(element.hasAttribute(ATTR.OUTSIDE)) {
		if(element.hasAttribute(ATTR.GROUP))
			console.warn("You can't use '"+ATTR.OUTSIDE+"' on a grouped trigger");
		else {
			if(element.isToggleActive)
				document.addEventListener(element.getAttribute(ATTR.EVENT) || 'click', documentEventHandler, false);
			else
				document.removeEventListener(element.getAttribute(ATTR.EVENT) || 'click', documentEventHandler, false);
		}
	}
}

// Manage attributes and events of target elements
const manageTarget = (targetElement, triggerElement) => {
	if(triggerElement.hasAttribute(ATTR.OUTSIDE))
		targetElement.setAttribute(ATTR.TARGET_STATE, triggerElement.isToggleActive);

	let triggerOffList = targetElement.querySelectorAll('['+ATTR.TRIGGER_OFF+']');
	if(triggerOffList.length > 0) {
		if(triggerElement.isToggleActive) {
			triggerOffList.forEach(triggerOff => {
				triggerOff.targetElement = triggerElement;
				triggerOff.addEventListener('click', triggerOffHandler, false);
			});
		}else{
			triggerOffList.forEach(triggerOff => {
				triggerOff.removeEventListener('click', triggerOffHandler, false);
			});
		}
	}
}

// Toggle elements of a same group
export const manageGroup = element => {
	let activeGroupElements = retrieveGroupState(element.getAttribute(ATTR.GROUP));

	if(activeGroupElements.length > 0){
		if(activeGroupElements.indexOf(element) === -1) {
			activeGroupElements.forEach(groupElement => {
				manageToggle(groupElement);
			});
			manageToggle(element);
		}
	}else{
		manageToggle(element);
	}
}

// Toggle class and aria on trigger and target elements
export const manageToggle = element => {
	let className = element.getAttribute(ATTR.CLASS);
	element.isToggleActive = !element.isToggleActive;
	//console.log("toggle to "+element.isToggleActive);

	if(!element.hasAttribute(ATTR.TARGET_ONLY))
		element.classList.toggle(className);

	if(element.hasAttribute(ARIA.EXPANDED))
		element.setAttribute(ARIA.EXPANDED, element.isToggleActive);

	if(element.hasAttribute(ARIA.SELECTED))
		element.setAttribute(ARIA.SELECTED, element.isToggleActive);

	let targetElements = retrieveTargets(element);
	for(var i=0;i<targetElements.length;i++) {
		targetElements[i].classList.toggle(className);
		manageTarget(targetElements[i], element);
	}

	manageTriggerOutside(element);
}

export const manageActiveByDefault = element => {
	element.isToggleActive = true;
	let className = element.getAttribute(ATTR.CLASS);

	if(!element.hasAttribute(ATTR.TARGET_ONLY) && !element.classList.contains(className))
		element.classList.add(className);

	if(element.hasAttribute(ARIA.EXPANDED) && element.getAttribute(ARIA.EXPANDED))
		element.setAttribute(ARIA.EXPANDED, true);

	if(element.hasAttribute(ARIA.SELECTED) && !element.getAttribute(ARIA.SELECTED))
		element.setAttribute(ARIA.SELECTED, true);

	let targetElements = retrieveTargets(element);
	for(var i=0;i<targetElements.length;i++) {
		if(!targetElements[i].classList.contains(element.getAttribute(ATTR.CLASS)))
			targetElements[i].classList.add(className);
		manageTarget(targetElements[i], element);
	}

	manageTriggerOutside(element);
}
