import { TARGET, TARGET_ALL, TARGET_NEXT, TARGET_PARENT, TARGET_PREVIOUS, TARGET_SELF } from "../constants/constants";

/**
 * Test a targets list.
 * @param {string} selector - The selector corresponding to the targets list
 * @param {nodeList} targetList - A target elements list
 * @returns {nodeList} - The targets list
 */
const testTargets = (selector, targetList) => {

	/** Test if there's no match for a selector */
	if (targetList.length === 0) {
		console.warn(`There's no match for the selector '${selector}' for this trigger`);
		return [];
	}

	/** Test if there's more than one match for an ID selector */
	const matches = selector.match(/#\w+/gi);
	if (matches) {
		matches.forEach(match => {
			const result = [...targetList].filter(target => target.id === match.slice(1));
			if (result.length > 1) {
				console.warn(`There's ${result.length} matches for the selector '${match}' for this trigger`);
			}
		});
	}

	return [...targetList];
};

/**
 * Retrieve all targets of a trigger element, depending of its target attribute.
 * @param {node} element - A trigger element
 * @returns {nodeList} - All targets of a trigger element
 */
export default element => {
	if (element.hasAttribute(TARGET) || element.hasAttribute(TARGET_ALL)) {
		const selector = element.getAttribute(TARGET) || element.getAttribute(TARGET_ALL);
		return testTargets(selector, document.querySelectorAll(selector));
	}

	if (element.hasAttribute(TARGET_PARENT)) {
		const selector = element.getAttribute(TARGET_PARENT);
		return testTargets(selector, element.parentElement.querySelectorAll(selector));
	}

	if (element.hasAttribute(TARGET_SELF)) {
		const selector = element.getAttribute(TARGET_SELF);
		return testTargets(selector, element.querySelectorAll(selector));
	}

	if (element.hasAttribute(TARGET_PREVIOUS)) {
		return testTargets("previous", [element.previousElementSibling].filter(Boolean));
	}

	if (element.hasAttribute(TARGET_NEXT)) {
		return testTargets("next", [element.nextElementSibling].filter(Boolean));
	}

	return [];
};
