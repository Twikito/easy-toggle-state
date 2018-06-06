import $$ from "./retrieve-query-selector-all";
import { GROUP } from "../constants/constants";

/**
 * Retrieve all active elements of a group.
 * @param {string} group - The trigger group name
 * @returns {array} - An array of active elements of a group
 */
export default group => $$(`${GROUP}="${group}"`).filter(groupElement => groupElement.isToggleActive);
