import { CHECKED, EXPANDED, HIDDEN, SELECTED } from "../constants/constants";

/**
 * Aria attributes toggle manager.
 * @param {node} element - Current element with aria attributes to manage.
 * @param {json} [config] - List of aria attributes and value to assign.
 * @returns {undefined}
 */
export default (
	element,
	config = {
		[CHECKED]: element.isToggleActive,
		[EXPANDED]: element.isToggleActive,
		[HIDDEN]: !element.isToggleActive,
		[SELECTED]: element.isToggleActive
	}
) => Object.keys(config).forEach(key => element.hasAttribute(key) && element.setAttribute(key, config[key]));
