import { ATTR }
	from '../constants/constants';

import { triggerOffHandler }
	from '../handlers/triggerOffHandler';


// Manage attributes and events of target elements
export const manageTarget = (targetElement, triggerElement) => {
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
