import { TARGET, TARGET_ALL, TARGET_NEXT, TARGET_PARENT, TARGET_PREVIOUS, TARGET_SELF } from "../constants/constants";
import testTargets from "./testTargets";

/* Retrieve all targets of a trigger element. */
export default element => {
	if (element.hasAttribute(TARGET) || element.hasAttribute(TARGET_ALL)) {
		let selector = element.getAttribute(TARGET) || element.getAttribute(TARGET_ALL);
		return testTargets(selector, document.querySelectorAll(selector));
	}

	if (element.hasAttribute(TARGET_PARENT)) {
		let selector = element.getAttribute(TARGET_PARENT);
		return testTargets(selector, element.parentElement.querySelectorAll(selector));
	}

	if (element.hasAttribute(TARGET_SELF)) {
		let selector = element.getAttribute(TARGET_SELF);
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
