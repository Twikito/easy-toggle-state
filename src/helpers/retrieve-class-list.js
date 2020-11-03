import {
	CLASS,
	CLASS_TARGET,
	CLASS_TRIGGER,
	DEFAULT_CLASS
} from "../constants/constants";

const warningText = (classItem, attribute, isTarget = false) => `This trigger has the class name '${classItem}' filled in both attributes '${CLASS}' and '${attribute}'. As a result, this class will be toggled ${isTarget && 'on its target(s)'} twice at the same time.`;

/**
 * Retrieve an array of class names from an attribute value.
 * @param {node} element - The trigger element on which get the attribute
 * @param {string} attribute - The attribute on which get class names
 * @returns {array} - An array of class names
 */
const classFromAttribute = (element, attribute) => (element.getAttribute(attribute) || '').split(' ').filter(Boolean);

/**
 * Retrieve class lists for trigger and target elements.
 * @param {node} element - The trigger element on which get all class names
 * @returns {object} - An object with two arrays with trigger and target class lists
 */
export default (element) => {
	if (element.hasAttribute(CLASS) && element.getAttribute(CLASS) && (element.hasAttribute(CLASS_TRIGGER) || element.hasAttribute(CLASS_TARGET))) {
		const triggerClassArray = classFromAttribute(element, CLASS_TRIGGER);
		const targetClassArray = classFromAttribute(element, CLASS_TARGET);

		/** Warn if there repetition class name between CLASS and CLASS_TRIGGER or CLASS and CLASS_TARGET */
		classFromAttribute(element, CLASS)
			.forEach(classItem => {
				if (triggerClassArray.includes(classItem)) {
					console.warn(
						warningText(classItem, CLASS_TRIGGER),
						element
					);
				}
				if (targetClassArray.includes(classItem)) {
					console.warn(
						warningText(classItem, CLASS_TARGET, true),
						element
					);
				}
			});
	}

	/** Get class list for trigger and targets from attributes */
	const lists = [CLASS, CLASS_TRIGGER, CLASS_TARGET].reduce(
		(acc, val) => {
			const list = classFromAttribute(element, val);
			(val === CLASS || val === CLASS_TRIGGER) && acc.trigger.push(...list);
			(val === CLASS || val === CLASS_TARGET) && acc.target.push(...list);
			return acc;
		},
		{
			trigger: [],
			target: []
		}
	);

	!lists.trigger.length && (element.hasAttribute(CLASS) || element.hasAttribute(CLASS_TRIGGER)) && lists.trigger.push(DEFAULT_CLASS);
	!lists.target.length && (element.hasAttribute(CLASS) || element.hasAttribute(CLASS_TARGET)) && lists.target.push(DEFAULT_CLASS);

	return lists;
};
