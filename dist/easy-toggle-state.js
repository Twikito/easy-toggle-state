/**
 * -------------------------------------------------------------------
 * easy-toggle-state
 * A tiny JavaScript library to easily toggle the state of any HTML element in any contexts, and create UI components in no time.
 *
 * @author Matthieu Bué <https://twikito.com>
 * @version v1.16.0
 * @link https://twikito.github.io/easy-toggle-state/
 * @license MIT : https://github.com/Twikito/easy-toggle-state/blob/master/LICENSE
 * -------------------------------------------------------------------
 */

(function () {
	'use strict';

	/**
	 * Prefix set to all attributes.
	 */

	const PREFIX = document.documentElement.getAttribute("data-easy-toggle-state-custom-prefix") || "toggle";

	const getPrefix = () => PREFIX;

	/**
	 * Retrieve a valid HTML attribute string.
	 * @param {string} key - A string to build a html attribute
	 * @param {string} prefix - The prefix maybe set by user
	 * @returns {string} - A valid html attribute
	 */
	const dataset = (key, prefix = getPrefix()) => ["data", prefix, key].filter(Boolean).join("-");

	/**
	 * All constants containing HTML attributes string.
	 */
	const ARROWS = dataset("arrows"),
		CHECKED = "aria-checked",
		CLASS = dataset("class"),
		CLASS_TARGET = dataset("class-on-target"),
		CLASS_TRIGGER = dataset("class-on-trigger"),
		DEFAULT_CLASS = "is-active",
		ESCAPE = dataset("escape"),
		EVENT = dataset("event"),
		EXPANDED = "aria-expanded",
		GROUP = dataset("group"),
		HIDDEN = "aria-hidden",
		IS_ACTIVE = dataset("is-active"),
		MODAL = dataset("modal"),
		OUTSIDE = dataset("outside"),
		OUTSIDE_EVENT = dataset("outside-event"),
		PRESSED = "aria-pressed",
		RADIO_GROUP = dataset("radio-group"),
		SELECTED = "aria-selected",
		TARGET = dataset("target"),
		TARGET_ALL = dataset("target-all"),
		TARGET_NEXT = dataset("target-next"),
		TARGET_PARENT = dataset("target-parent"),
		TARGET_PREVIOUS = dataset("target-previous"),
		TARGET_SELF = dataset("target-self"),
		TARGET_STATE = dataset("state"),
		TRIGGER_OFF = dataset("trigger-off");

	/**
	 * Hooks
	 */
	const TOGGLE_AFTER = new Event("toggleAfter"),
		TOGGLE_BEFORE = new Event("toggleBefore");

	/**
	 * Retrieve all trigger elements with a specific attribute, or all nodes in a specific scope.
	 * @param {string} selector - A string that contains a selector
	 * @param {node} node - An element in which to make the selection
	 * @returns {array} - An array of elements
	 */
	const $$ = (selector, node) => {
		const scope = selector ? `[${selector}]` : "";

		if (node) {
			return [...node.querySelectorAll(scope)];
		}

		const query = [
			`[${CLASS}]${scope}`,
			`[${CLASS_TRIGGER}]${scope}`,
			`[${CLASS_TARGET}][${TARGET}]${scope}`,
			`[${CLASS_TARGET}][${TARGET_ALL}]${scope}`,
			`[${CLASS_TARGET}][${TARGET_NEXT}]${scope}`,
			`[${CLASS_TARGET}][${TARGET_PREVIOUS}]${scope}`,
			`[${CLASS_TARGET}][${TARGET_PARENT}]${scope}`,
			`[${CLASS_TARGET}][${TARGET_SELF}]${scope}`
		]
			.join()
			.trim();

		return [...document.querySelectorAll(query)];
	};

	/**
	 * Dispatch hooks
	 * @param {node} element - An element on which dispatch the hook
	 * @param {string} action - An event to dispatch
	 * @returns {boolean} - True or False
	 */
	const dispatchHook = (element, action) => element.dispatchEvent(action);

	/**
	 * Add a namespace for element properties.
	 * @param {string} property - The property aadded on any element
	 * @returns {string} - The property with the namespace
	 */
	const namespacedProp = (property) => `easyToggleState_${property}`;

	/**
	 * Aria attributes toggle manager.
	 * @param {node} element - Current element with aria attributes to manage.
	 * @param {json} [config] - List of aria attributes and value to assign.
	 * @returns {undefined}
	 */
	const manageAria = (
		element,
		config = {
			[CHECKED]: element[namespacedProp('isActive')],
			[EXPANDED]: element[namespacedProp('isActive')],
			[HIDDEN]: !element[namespacedProp('isActive')],
			[PRESSED]: element[namespacedProp('isActive')],
			[SELECTED]: element[namespacedProp('isActive')]
		}
	) => Object.keys(config).forEach(key => element.hasAttribute(key) && element.setAttribute(key, config[key]));

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
	const retrieveClassList = (element) => {
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

	/**
	 * Retrieve all active elements of a group.
	 * @param {node} element - An element of a group
	 * @returns {array} - An array of active elements of a group
	 */
	const retrieveGroupActiveElement = element => {
		const type = element.hasAttribute(GROUP) ? GROUP : RADIO_GROUP;
		return $$(`${type}="${element.getAttribute(type)}"`).filter(groupElement => groupElement[namespacedProp('isActive')]);
	};

	/**
	 * Test a selector.
	 * @param {string} selector - The selector corresponding to the targets list
	 * @param {string} attribute - The selector scope, set by the user
	 * @returns {undefined}
	 */
	const testSelector = (selector, attribute) => {
		if (!selector) {
			console.warn(`You should fill the attribute '${attribute}' with a selector`);
		}
	};

	/**
	 * Test a targets list.
	 * @param {string} selector - The selector corresponding to the targets list
	 * @param {nodeList} targetList - A target elements list
	 * @returns {nodeList} - The targets list
	 */
	const testTargets = (selector, targetList) => {

		/** Test if there's no match for a selector */
		if (targetList.length === 0) {
			console.warn(`There's no match with the selector '${selector}' for this trigger`);
			return [];
		}

		/** Test if there's more than one match for an ID selector */
		const matches = selector.match(/#\w+/gi);
		if (matches) {
			matches.forEach(match => {
				const result = [...targetList].filter(target => target.id === match.slice(1));
				if (result.length > 1) {
					console.warn(`There's ${result.length} matches with the selector '${match}' for this trigger`);
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
	const retrieveTargets = element => {
		if (element.hasAttribute(TARGET) || element.hasAttribute(TARGET_ALL)) {
			const selector = element.getAttribute(TARGET) || element.getAttribute(TARGET_ALL);
			testSelector(selector, element.hasAttribute(TARGET) ? TARGET : TARGET_ALL);
			return testTargets(selector, document.querySelectorAll(selector));
		}

		if (element.hasAttribute(TARGET_PARENT)) {
			const selector = element.getAttribute(TARGET_PARENT);
			testSelector(selector, TARGET_PARENT);
			return testTargets(selector, element.parentElement.querySelectorAll(selector));
		}

		if (element.hasAttribute(TARGET_SELF)) {
			const selector = element.getAttribute(TARGET_SELF);
			testSelector(selector, TARGET_SELF);
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

	/**
	 * Toggle each class in list on the element.
	 * @param {node} element - An element on which toggle each class
	 * @param {array} list - An array of classlist to toggle
	 * @returns {undefined}
	 */
	const toggleClassList = (element, list) => list.forEach(listItem => {
		element.classList.toggle(listItem);
	});

	/** Need to use a map for some event handler to ensure to have the same signature */
	const HANDLER_MAP = {};

	/**
	 * Manage event listener on document
	 * @param {element} element - The element on which test if there event type specified
	 * @returns {undefined}
	 */
	const addEventListenerOnDocument = element => document.addEventListener(
			element.getAttribute(OUTSIDE_EVENT) || element.getAttribute(EVENT) || "click",
			documentEventHandler,
			false
		);

	/**
	 * Toggle off all elements width 'data-toggle-outside' attribute
	 * when reproducing specified or click event outside itself or its targets.
	 * @param {event} event - Event triggered on document
	 * @returns {undefined}
	 */
	const documentEventHandler = event => {
		const eTarget = event.target,
			eType = event.type;
		let insideTarget = false;

		$$(OUTSIDE)
			.filter(element => element.getAttribute(OUTSIDE_EVENT) === eType ||
					(element.getAttribute(EVENT) === eType && !element.hasAttribute(OUTSIDE_EVENT)) ||
					(eType === "click" && !element.hasAttribute(EVENT) && !element.hasAttribute(OUTSIDE_EVENT)))
			.forEach(element => {
				const e = eTarget.closest(`[${TARGET_STATE}="true"]`);
				if (e && e[namespacedProp('trigger')] === element) {
					insideTarget = true;
				}
				if (!insideTarget && element !== eTarget && !element.contains(eTarget) && element[namespacedProp('isActive')]) {
					(element.hasAttribute(GROUP) || element.hasAttribute(RADIO_GROUP) ? manageGroup : manageToggle)(element);
				}
			});

		if (!insideTarget) {
			document.removeEventListener(eType, documentEventHandler, false);
		}

		// eTarget may be an element inside a trigger
		const newTarget = eTarget.closest(`[${CLASS}][${OUTSIDE}],[${CLASS_TRIGGER}][${OUTSIDE}],[${CLASS_TARGET}][${OUTSIDE}]`);
		if (newTarget && newTarget[namespacedProp('isActive')]) {
			addEventListenerOnDocument(eTarget);
		}
	};

	/**
	 * Manage click on elements with 'data-trigger-off' attribute.
	 * @param {event} event - Event triggered on element with 'trigger-off' attribute
	 * @returns {undefined}
	 */
	const triggerOffHandler = event => manageToggle(event.currentTarget[namespacedProp('target')]);

	/**
	 * Manage event ouside trigger or target elements.
	 * @param {node} element - The element to toggle when 'click' or custom event is triggered on document
	 * @returns {undefined}
	 */
	const manageTriggerOutside = element => {
		if (!element.hasAttribute(OUTSIDE)) {
			return;
		}

		if (element.hasAttribute(RADIO_GROUP)) {
			return console.warn(`You can't use '${OUTSIDE}' on a radio grouped trigger`);
		}

		if (element[namespacedProp('isActive')]) {
			return addEventListenerOnDocument(element);
		}
	};

	/**
	 * Manage elements inside a target element which have 'data-toggle-trigger-off' attribute.
	 * @param {node} targetElement - An element targeted by the trigger element
	 * @param {node} triggerElement - The trigger element
	 * @returns {undefined}
	 */
	const manageTriggerOff = (targetElement, triggerElement) => {
		const triggerOffList = $$(TRIGGER_OFF, targetElement).filter(triggerOff => !triggerOff.getAttribute(TRIGGER_OFF) || targetElement.matches(triggerOff.getAttribute(TRIGGER_OFF)));

		if (triggerOffList.length === 0) {
			return;
		}

		if (triggerElement[namespacedProp('isActive')]) {
			return triggerOffList.forEach(triggerOff => {
				// Do not override if another reference is already set
				if (!triggerOff[namespacedProp('target')]) {
					triggerOff[namespacedProp('target')] = triggerElement;
					triggerOff.addEventListener("click", triggerOffHandler, false);
				}
			});
		}

		triggerOffList.forEach(triggerOff => {
			// Remove reference only if it equals current trigger
			if (triggerOff[namespacedProp('target')] === triggerElement) {
				triggerOff[namespacedProp('target')] = null;
				triggerOff.removeEventListener("click", triggerOffHandler, false);
			}
		});
		return triggerElement.focus();
	};

	/**
	 * Manage focus trap inside a target element:
	 * When Tab key is pressed, if focus is outside of the container, give focus on first item ;
	 * when Tab key is pressed, if focus is on last item, give focus on first one ;
	 * when Shift + Tab keys are pressed, if focus is on first item, give focus on last one.
	 * @param {node} targetElement - The focus trap container
	 * @returns {undefined}
	 */
	const focusTrapHandler = targetElement => event => {
		const focusablesList = [...targetElement.querySelectorAll("a[href], area[href], input:not([type='hidden']):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]")];

		if (!focusablesList.length || event.key !== "Tab") {
			return;
		}

		const currentItem = event.target,
			firstItem = focusablesList[0],
			lastItem = focusablesList[focusablesList.length - 1];

		// Outside focus trap container: focus on first
		if (focusablesList.indexOf(currentItem) === -1) {
			event.preventDefault();
			return firstItem.focus();
		}

		if (event.shiftKey && currentItem === firstItem) {
			event.preventDefault();
			return lastItem.focus();
		}

		if (!event.shiftKey && currentItem === lastItem) {
			event.preventDefault();
			return firstItem.focus();
		}
	};

	/**
	 * Manage attributes and events of targets elements.
	 * @param {node} triggerElement - The trigger element
	 * @param {array} classListForTarget - The class list to toggle
	 * @param {boolean} onLoadActive - A flag for active by default
	 * @returns {undefined}
	 */
	const manageTargets = (triggerElement, classListForTarget, onLoadActive) => retrieveTargets(triggerElement).forEach(targetElement => {
			dispatchHook(targetElement, TOGGLE_BEFORE);

			targetElement[namespacedProp('isActive')] = !targetElement[namespacedProp('isActive')];
			manageAria(targetElement);

			if (onLoadActive) {
				targetElement.classList.add(...classListForTarget);
			} else {
				toggleClassList(targetElement, classListForTarget);
			}

			if (triggerElement.hasAttribute(OUTSIDE)) {
				targetElement.setAttribute(TARGET_STATE, triggerElement[namespacedProp('isActive')]);
				targetElement[namespacedProp('trigger')] = triggerElement;
			}

			if (triggerElement.hasAttribute(MODAL)) {
				if (targetElement[namespacedProp('isActive')]) {
					HANDLER_MAP[targetElement] = focusTrapHandler(targetElement);
					document.addEventListener("keydown", HANDLER_MAP[targetElement], false);
				} else {
					document.removeEventListener("keydown", HANDLER_MAP[targetElement], false);
					delete HANDLER_MAP[targetElement];
				}
			}

			dispatchHook(targetElement, TOGGLE_AFTER);

			manageTriggerOff(targetElement, triggerElement);
		});

	/**
	 * Toggle class and aria on trigger and target elements.
	 * @param {node} element - The element to toggle state and attributes
	 * @returns {undefined}
	 */
	const manageToggle = element => {
		dispatchHook(element, TOGGLE_BEFORE);

		const classList = retrieveClassList(element);
		toggleClassList(element, classList.trigger);
		element[namespacedProp('isActive')] = !element[namespacedProp('isActive')];
		manageAria(element);

		dispatchHook(element, TOGGLE_AFTER);

		manageTargets(element, classList.target, false);
		return manageTriggerOutside(element);
	};

	/**
	 * Toggle elements of a same group.
	 * @param {node} element - The element to test if it's in a group
	 * @returns {undefined}
	 */
	const manageGroup = element => {
		const groupActiveElements = retrieveGroupActiveElement(element);
		if (groupActiveElements.length === 0) {
			return manageToggle(element);
		}

		if (groupActiveElements.indexOf(element) === -1) {
			groupActiveElements.forEach(manageToggle);
			return manageToggle(element);
		}

		if (groupActiveElements.indexOf(element) !== -1 && !element.hasAttribute(RADIO_GROUP)) {
			return manageToggle(element);
		}
	};

	/**
	 * Check if a trigger element is active.
	 * @param {node} element - A trigger element
	 * @returns {boolean} - The active state of the trigger element
	 */
	const isActive = element => !!element[namespacedProp('isActive')];

	/**
	 * Unbind toggling management from an element list.
	 * @param {node} elementList - An element, or element list, on which remove the toggling management
	 * @returns {node} - Same element, or element list
	 */
	const unbind = elementList => {
		(elementList[Symbol.iterator] ? [...elementList] : [elementList]).forEach(element => {
			element[namespacedProp('unbind')] && element[namespacedProp('unbind')]();
		});
		return elementList;
	};

	/**
	 * Unbind toggling management from all initialized elements in the page.
	 * @returns {nodeList} - A list of unbinded triggers
	 */
	const unbindAll = () => unbind($$().filter(trigger => trigger[namespacedProp('isInitialized')]));

	/**
	 * Initialization.
	 * @returns {array} - An array of initialized triggers
	 */
	const initialize = () => {

		/**
		 * Warn if there some CLASS_TARGET triggers with no specified target.
		 */
		[...document.querySelectorAll(`[${CLASS_TARGET}]:not([${TARGET}]):not([${TARGET_ALL}]):not([${TARGET_NEXT}]):not([${TARGET_PREVIOUS}]):not([${TARGET_PARENT}]):not([${TARGET_SELF}])`)]
			.forEach(element => {
				console.warn(`This trigger has the attribute '${CLASS_TARGET}', but no specified target\n`, element);
			});

		/**
		 * Active by default management.
		 */
		$$(IS_ACTIVE)
			.filter(trigger => !trigger[namespacedProp('isDefaultInitialized')])
			.forEach(trigger => {
				if ((trigger.hasAttribute(GROUP) || trigger.hasAttribute(RADIO_GROUP)) && retrieveGroupActiveElement(trigger).length > 0) {
					return console.warn(`Toggle group '${trigger.getAttribute(GROUP) ||
						trigger.getAttribute(RADIO_GROUP)}' must not have more than one trigger with '${IS_ACTIVE}'`);
				}
				manageToggle(trigger);
				trigger[namespacedProp('isDefaultInitialized')] = true;
			});

		/**
		 * Set specified or click event on each trigger element.
		 */
		const triggerList = $$().filter(trigger => !trigger[namespacedProp('isInitialized')]);
		triggerList.forEach(trigger => {
			const handler = event => {
				event.preventDefault();
				(trigger.hasAttribute(GROUP) || trigger.hasAttribute(RADIO_GROUP) ? manageGroup : manageToggle)(trigger);
			};
			const eventName = trigger.getAttribute(EVENT) || "click";
			trigger.addEventListener(eventName, handler, false);
			trigger[namespacedProp('unbind')] = () => {
				trigger.removeEventListener(eventName, handler, false);
				trigger[namespacedProp('isInitialized')] = false;
			};
			trigger[namespacedProp('isInitialized')] = true;
		});

		/**
		 * Escape key management.
		 */
		if ($$(ESCAPE).length > 0 && !document[namespacedProp('isEscapeKeyInitialized')]) {
			document.addEventListener(
				"keydown",
				event => {
					if (!(event.key === "Escape") && !(event.key === "Esc")) {
						return;
					}
					$$(ESCAPE).forEach(trigger => {
						if (!trigger[namespacedProp('isActive')]) {
							return;
						}

						if (trigger.hasAttribute(RADIO_GROUP)) {
							return console.warn(`You can't use '${ESCAPE}' on a radio grouped trigger`);
						}

						return (trigger.hasAttribute(GROUP) ? manageGroup : manageToggle)(trigger);
					});
				},
				false
			);
			document[namespacedProp('isEscapeKeyInitialized')] = true;
		}

		/**
		 * Arrows key management.
		 */
		if ($$(ARROWS).length > 0 && !document[namespacedProp('isArrowKeysInitialized')]) {
			document.addEventListener(
				"keydown",
				event => {
					const activeElement = document.activeElement;
					if (
						["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"].indexOf(event.key) === -1 ||
						(!activeElement.hasAttribute(CLASS) && !activeElement.hasAttribute(CLASS_TRIGGER) && !activeElement.hasAttribute(CLASS_TARGET)) ||
						!activeElement.hasAttribute(ARROWS)
					) {
						return;
					}

					if (!activeElement.hasAttribute(GROUP) && !activeElement.hasAttribute(RADIO_GROUP)) {
						return console.warn(`You can't use '${ARROWS}' on a trigger without '${GROUP}' or '${RADIO_GROUP}'`);
					}

					event.preventDefault();

					const groupList = activeElement.hasAttribute(GROUP)
						? $$(`${GROUP}='${activeElement.getAttribute(GROUP)}'`)
						: $$(`${RADIO_GROUP}='${activeElement.getAttribute(RADIO_GROUP)}'`);

					let newElement = activeElement;
					switch (event.key) {
						case "ArrowUp":
						case "ArrowLeft":
							newElement =
								groupList.indexOf(activeElement) > 0
									? groupList[groupList.indexOf(activeElement) - 1]
									: groupList[groupList.length - 1];
							break;
						case "ArrowDown":
						case "ArrowRight":
							newElement =
								groupList.indexOf(activeElement) < groupList.length - 1
									? groupList[groupList.indexOf(activeElement) + 1]
									: groupList[0];
							break;
						case "Home":
							newElement = groupList[0];
							break;
						case "End":
							newElement = groupList[groupList.length - 1];
							break;
					}

					newElement.focus();
					return newElement.dispatchEvent(new Event(newElement.getAttribute(EVENT) || "click"));
				},
				false
			);
			document[namespacedProp('isArrowKeysInitialized')] = true;
		}

		return triggerList;
	};

	const handler = () => {
		initialize();
		document.removeEventListener("DOMContentLoaded", handler);
	};
	document.addEventListener("DOMContentLoaded", handler);

	window.easyToggleState = Object.assign(
		initialize,
		{
			isActive,
			unbind,
			unbindAll
		}
	);

}());
