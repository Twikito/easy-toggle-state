import { ATTR }
	from '../constants/constants';

import { documentEventHandler }
	from '../handlers/documentEventHandler';


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
