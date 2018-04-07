import $$ from "./retrieveQuerySelectorAll";
import { GROUP } from "../constants/constants";

/* Retrieve all active trigger of a group. */
export default group => {
	let activeGroupElements = [];
	$$(`${GROUP}="${group}"`).forEach(groupElement => {
		if (groupElement.isToggleActive) {
			activeGroupElements.push(groupElement);
		}
	});
	return activeGroupElements;
};
