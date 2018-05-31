import { CLASS } from "../constants/constants";

/* Retrieve all triggers with a specific attribute */
export default (selector, node) => {
	const scope = selector ? `[${selector}]` : "";
	return node ? [...node.querySelectorAll(scope)] : [...document.querySelectorAll(`[${CLASS}]${scope}`.trim())];
};
