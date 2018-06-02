/**
 * @module helpers/manageAria
 * @desc Contains aria manager.
 * @param {Object} element - Current element with aria attributes to manage.
 * @param {Json} [config={[CHECKED]: element.isToggleActive,[EXPANDED]: element.isToggleActive,[HIDDEN]: !element.isToggleActive,[SELECTED]: element.isToggleActive}] - List of aria attributes and value to test with.
 * @returns {undefined}
 */

import { CHECKED, EXPANDED, HIDDEN, SELECTED } from "../constants/constants";

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
