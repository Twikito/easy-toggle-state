import { CLASS } from "../constants/constants";

/* Retrieve all triggers with a specific attribute */
export default selector => {
	const scope = selector ? `[${selector}]` : "";
	return [...document.querySelectorAll(`[${CLASS}]${scope}`.trim())];
};
