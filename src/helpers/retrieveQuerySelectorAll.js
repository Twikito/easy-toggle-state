import { ATTR } from "../constants/constants";

/* Retrieve all triggers with a specific attribute */
export const $$ = selector => {
	const scope = selector ? `[${selector}]` : "";
	return [...document.querySelectorAll(`[${ATTR.CLASS}]${scope}`.trim())];
};
