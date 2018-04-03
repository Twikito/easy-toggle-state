import { ATTR }
	from '../constants/constants';

import { manageGroup }
	from '../managers/manageGroup';

import { manageToggle }
	from '../managers/manageToggle';


// Toggle off all 'toggle-outside' elements when reproducing specified or click event outside trigger or target elements
export const documentEventHandler = event => {
	let target = event.target;

	if (!target.closest('['+ATTR.TARGET_STATE+'="true"]')) {
		[...document.querySelectorAll('['+ATTR.CLASS+']['+ATTR.OUTSIDE+']')].forEach((element) => {
			if(element != target && element.isToggleActive)
				if(element.hasAttribute(ATTR.GROUP)) manageGroup(element);
				else manageToggle(element);
		});
		if(target.hasAttribute(ATTR.OUTSIDE) && target.isToggleActive)
			document.addEventListener(target.getAttribute(ATTR.EVENT) || 'click', documentEventHandler, false);
	}
}
