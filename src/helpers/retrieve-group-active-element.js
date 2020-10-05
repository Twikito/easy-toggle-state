import { GROUP, RADIO_GROUP } from "../constants/constants";
import $$ from "./retrieve-query-selector-all";
import namespacedProp from "../helpers/retrieve-namespaced-property";

/**
 * Retrieve all active elements of a group.
 * @param {node} element - An element of a group
 * @returns {array} - An array of active elements of a group
 */
export default element => {
	const type = element.hasAttribute(GROUP) ? GROUP : RADIO_GROUP;
	return $$(`${type}="${element.getAttribute(type)}"`).filter(groupElement => groupElement[namespacedProp('isActive')]);
};
