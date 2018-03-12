const { ARIA, DATA } = require('./constants');

// Retrieve all targets of a trigger element
const retrieveTargets = element => {
	if(element.hasAttribute(DATA.TARGET_ALL))
		return document.querySelectorAll(element.getAttribute(DATA.TARGET_ALL));
	else if(element.hasAttribute(DATA.TARGET_PARENT))
		return element.parentElement.querySelectorAll(element.getAttribute(DATA.TARGET_PARENT));
	else if(element.hasAttribute(DATA.TARGET_SELF))
		return element.querySelectorAll(element.getAttribute(DATA.TARGET_SELF));
	return [];
}

// Retrieve all active trigger of a group
const retrieveGroupState = group => {
	let activeGroupElements = [];
	[...document.querySelectorAll('['+DATA.CLASS+']['+DATA.GROUP+'="'+group+'"]')].forEach((groupElement) => {
		if(groupElement.isToggleActive) activeGroupElements.push(groupElement);
	});
	return activeGroupElements;
}

// Toggle off all 'toggle-outside' elements when reproducing specified or click event outside trigger or target elements
const documentEventHandler = event => {
	let target = event.target;

	if (!target.closest('['+DATA.TARGET_STATE+'="true"]')) {
		[...document.querySelectorAll('['+DATA.CLASS+']['+DATA.OUTSIDE+']')].forEach((element) => {
			if(element != target && element.isToggleActive)
				if(element.hasAttribute(DATA.GROUP)) manageGroup(element);
				else manageToggle(element);
		});
		if(target.hasAttribute(DATA.OUTSIDE) && target.isToggleActive)
			document.addEventListener(target.getAttribute(DATA.EVENT) || 'click', documentEventHandler, false);
	}
}

// Manage click on 'trigger-off' elements
const triggerOffHandler = event => {
	manageToggle(event.target.targetElement);
}

// Manage event ouside trigger or target elements
const manageTriggerOutside = element => {
	if(element.hasAttribute(DATA.OUTSIDE)) {
		if(element.hasAttribute(DATA.GROUP))
			console.warn("You can't use '"+DATA.OUTSIDE+"' on a grouped trigger");
		else {
			if(element.isToggleActive)
				document.addEventListener(element.getAttribute(DATA.EVENT) || 'click', documentEventHandler, false);
			else
				document.removeEventListener(element.getAttribute(DATA.EVENT) || 'click', documentEventHandler, false);
		}
	}
}

// Manage attributes and events of target elements
const manageTarget = (targetElement, triggerElement) => {
	if(triggerElement.hasAttribute(DATA.OUTSIDE))
		targetElement.setAttribute(DATA.TARGET_STATE, triggerElement.isToggleActive);

	let triggerOffList = targetElement.querySelectorAll('['+DATA.TRIGGER_OFF+']');
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
const manageGroup = element => {
	let activeGroupElements = retrieveGroupState(element.getAttribute(DATA.GROUP));

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
const manageToggle = element => {
	let className = element.getAttribute(DATA.CLASS);
	element.isToggleActive = !element.isToggleActive;
	//console.log("toggle to "+element.isToggleActive);

	if(!element.hasAttribute(DATA.TARGET_ONLY))
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

const manageActiveByDefault = element => {
	element.isToggleActive = true;
	let className = element.getAttribute(DATA.CLASS);

	if(!element.hasAttribute(DATA.TARGET_ONLY) && !element.classList.contains(className))
		element.classList.add(className);

	if(element.hasAttribute(ARIA.EXPANDED) && element.getAttribute(ARIA.EXPANDED))
		element.setAttribute(ARIA.EXPANDED, true);

	if(element.hasAttribute(ARIA.SELECTED) && !element.getAttribute(ARIA.SELECTED))
		element.setAttribute(ARIA.SELECTED, true);

	let targetElements = retrieveTargets(element);
	for(var i=0;i<targetElements.length;i++) {
		if(!targetElements[i].classList.contains(element.getAttribute(DATA.CLASS)))
			targetElements[i].classList.add(className);
		manageTarget(targetElements[i], element);
	}

	manageTriggerOutside(element);
}

// Initialization
const init = () => {

	// Active by default management
	[...document.querySelectorAll('['+DATA.CLASS+']['+DATA.IS_ACTIVE+']')].forEach((trigger) => {
		if(trigger.hasAttribute(DATA.GROUP)) {
			let group = trigger.getAttribute(DATA.GROUP);
			if(retrieveGroupState(group).length > 0)
				console.warn("Toggle group '"+group+"' must not have more than one trigger with '"+DATA.IS_ACTIVE+"'");
			else
				manageActiveByDefault(trigger);
		} else {
			manageActiveByDefault(trigger);
		}
	});

	// Set specified or click event on each trigger element
	[...document.querySelectorAll('['+DATA.CLASS+']')].forEach((trigger) => {
		trigger.addEventListener(trigger.getAttribute(DATA.EVENT) || 'click', (event) => {
			event.preventDefault();
			if(trigger.hasAttribute(DATA.GROUP)) manageGroup(trigger);
			else manageToggle(trigger);
		}, false);
	});

	// Escape key management
	let triggerEscElements = [...document.querySelectorAll('['+DATA.CLASS+']['+DATA.ESCAPE+']')];
	if(triggerEscElements.length > 0) {
		document.addEventListener('keyup', (event) => {
			event = event || window.event;
			let isEscape = false;

			if('key' in event)
				isEscape = (event.key === 'Escape' || event.key === 'Esc');
			else
				isEscape = (event.keyCode === 27);

			if(isEscape) {
				triggerEscElements.forEach((trigger) => {
					if(trigger.isToggleActive) {
						if(trigger.hasAttribute(DATA.GROUP))
							console.warn("You can't use '"+DATA.ESCAPE+"' on a grouped trigger");
						else manageToggle(trigger);
					}
				});
			}
		}, false);
	}
}

const onLoad = () => {
	init();
	document.removeEventListener('DOMContentLoaded', onLoad);
}

document.addEventListener('DOMContentLoaded', onLoad);
window.initEasyToggleState = init;
