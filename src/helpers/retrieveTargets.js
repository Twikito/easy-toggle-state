import { TARGET_ALL, TARGET_PARENT, TARGET_SELF } from "../constants/constants";

/* Retrieve all targets of a trigger element. */
export default element => {
	if (element.hasAttribute(TARGET_ALL)) {
		return document.querySelectorAll(element.getAttribute(TARGET_ALL));
	}

	if (element.hasAttribute(TARGET_PARENT)) {
		return element.parentElement.querySelectorAll(element.getAttribute(TARGET_PARENT));
	}

	if (element.hasAttribute(TARGET_SELF)) {
		return element.querySelectorAll(element.getAttribute(TARGET_SELF));
	}

	return [];
};
