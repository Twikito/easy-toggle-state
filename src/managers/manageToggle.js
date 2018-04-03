import { ATTR }
	from '../constants/constants';

import { retrieveTargets }
	from '../helpers/retrieveTargets';

import { manageTarget }
	from './manageTarget';

import { manageTriggerOutside }
	from './manageTriggerOutside';


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
