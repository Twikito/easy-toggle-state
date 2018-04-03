import { ATTR }
	from '../constants/constants';

import { manageToggle }
	from '../managers/manageToggle';


// Manage click on 'trigger-off' elements
export const triggerOffHandler = event => {
	manageToggle(event.target.targetElement);
}
