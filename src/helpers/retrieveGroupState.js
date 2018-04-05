import { $$ } from "../helpers/retrieveQuerySelectorAll.js";
import { ATTR } from "../constants/constants";

/* Retrieve all active trigger of a group. */
export const retrieveGroupState = group => {
	let activeGroupElements = [];
	$$(`${ATTR.GROUP}="${group}"`).forEach(groupElement => {
		if (groupElement.isToggleActive) {
			activeGroupElements.push(groupElement);
		}
	});
	return activeGroupElements;
};
