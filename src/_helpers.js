import { ATTR }
	from './_constants';

// Retrieve all targets of a trigger element
export const retrieveTargets = element => {
	if(element.hasAttribute(ATTR.TARGET_ALL))
		return document.querySelectorAll(element.getAttribute(ATTR.TARGET_ALL));
	else if(element.hasAttribute(ATTR.TARGET_PARENT))
		return element.parentElement.querySelectorAll(element.getAttribute(ATTR.TARGET_PARENT));
	else if(element.hasAttribute(ATTR.TARGET_SELF))
		return element.querySelectorAll(element.getAttribute(ATTR.TARGET_SELF));
	return [];
}

// Retrieve all active trigger of a group
export const retrieveGroupState = group => {
	let activeGroupElements = [];
	[...document.querySelectorAll('['+ATTR.CLASS+']['+ATTR.GROUP+'="'+group+'"]')].forEach((groupElement) => {
		if(groupElement.isToggleActive) activeGroupElements.push(groupElement);
	});
	return activeGroupElements;
}
