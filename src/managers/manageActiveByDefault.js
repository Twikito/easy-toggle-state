import { ATTR }
	from '../constants/constants';

import { retrieveTargets }
	from '../helpers/retrieveTargets';

import { manageTarget }
	from './manageTarget';

import { manageTriggerOutside }
	from './manageTriggerOutside';


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
