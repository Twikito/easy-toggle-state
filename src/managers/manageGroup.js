import { ATTR }
	from '../constants/constants';

import { retrieveGroupState }
	from '../helpers/retrieveGroupState';

import { manageToggle }
	from './manageToggle';


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
