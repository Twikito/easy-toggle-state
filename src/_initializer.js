import { ATTR }
	from './_constants';

import { retrieveGroupState }
	from './_helpers';

import { manageGroup, manageToggle, manageActiveByDefault }
	from './_managers';

// Initialization
export const init = () => {

	// Active by default management
	[...document.querySelectorAll('['+ATTR.CLASS+']['+ATTR.IS_ACTIVE+']')].forEach((trigger) => {
		if(trigger.hasAttribute(ATTR.GROUP)) {
			let group = trigger.getAttribute(ATTR.GROUP);
			if(retrieveGroupState(group).length > 0)
				console.warn("Toggle group '"+group+"' must not have more than one trigger with '"+ATTR.IS_ACTIVE+"'");
			else
				manageActiveByDefault(trigger);
		} else {
			manageActiveByDefault(trigger);
		}
	});

	// Set specified or click event on each trigger element
	[...document.querySelectorAll('['+ATTR.CLASS+']')].forEach((trigger) => {
		trigger.addEventListener(trigger.getAttribute(ATTR.EVENT) || 'click', (event) => {
			event.preventDefault();
			if(trigger.hasAttribute(ATTR.GROUP)) manageGroup(trigger);
			else manageToggle(trigger);
		}, false);
	});

	// Escape key management
	let triggerEscElements = [...document.querySelectorAll('['+ATTR.CLASS+']['+ATTR.ESCAPE+']')];
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
						if(trigger.hasAttribute(ATTR.GROUP))
							console.warn("You can't use '"+ATTR.ESCAPE+"' on a grouped trigger");
						else manageToggle(trigger);
					}
				});
			}
		}, false);
	}
}
