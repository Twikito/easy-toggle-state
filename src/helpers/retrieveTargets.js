import { ATTR }
	from '../constants/constants';


/* Retrieve all targets of a trigger element. */
export const retrieveTargets = (element) => {

	if (element.hasAttribute(ATTR.TARGET_ALL)) {
		return document.querySelectorAll(element.getAttribute(ATTR.TARGET_ALL));
	}

	if (element.hasAttribute(ATTR.TARGET_PARENT)) {
		return element.parentElement.querySelectorAll(element.getAttribute(ATTR.TARGET_PARENT));
	}

	if (element.hasAttribute(ATTR.TARGET_SELF)) {
		return element.querySelectorAll(element.getAttribute(ATTR.TARGET_SELF));
	}

	return [];
}
