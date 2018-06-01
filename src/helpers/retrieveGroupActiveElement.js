import $$ from "./retrieveQuerySelectorAll";
import { GROUP } from "../constants/constants";

/* Retrieve all active trigger of a group. */
export default group => $$(`${GROUP}="${group}"`).filter(groupElement => groupElement.isToggleActive);
