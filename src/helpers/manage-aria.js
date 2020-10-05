import { CHECKED, EXPANDED, HIDDEN, PRESSED, SELECTED } from "../constants/constants";
import namespacedProp from "../helpers/retrieve-namespaced-property";

/**
 * Aria attributes toggle manager.
 * @param {node} element - Current element with aria attributes to manage.
 * @param {json} [config] - List of aria attributes and value to assign.
 * @returns {undefined}
 */
export default (
	element,
	config = {
		[CHECKED]: element[namespacedProp('isActive')],
		[EXPANDED]: element[namespacedProp('isActive')],
		[HIDDEN]: !element[namespacedProp('isActive')],
		[PRESSED]: element[namespacedProp('isActive')],
		[SELECTED]: element[namespacedProp('isActive')]
	}
) => Object.keys(config).forEach(key => element.hasAttribute(key) && element.setAttribute(key, config[key]));
