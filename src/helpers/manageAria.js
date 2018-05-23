import { CHECKED, EXPANDED, HIDDEN, SELECTED } from "../constants/constants";

/* Manage ARIA attributes */
export default (
	element,
	config = {
		[CHECKED]: element.isToggleActive,
		[EXPANDED]: element.isToggleActive,
		[HIDDEN]: !element.isToggleActive,
		[SELECTED]: element.isToggleActive
	}
) => {
	Object.keys(config).forEach(key => element.hasAttribute(key) && element.setAttribute(key, config[key]));
};
