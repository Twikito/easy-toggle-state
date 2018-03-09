(document => {

	const TOGGLE_CLASS_PREFIX = 'toggle-'; // Prefix should end by hyphen

	const ATTR_CLASS = 'data-'+TOGGLE_CLASS_PREFIX+'class',
	      ATTR_TARGET_ALL = 'data-'+TOGGLE_CLASS_PREFIX+'target-all',
	      ATTR_TARGET_PARENT = 'data-'+TOGGLE_CLASS_PREFIX+'target-parent',
	      ATTR_TARGET_SELF = 'data-'+TOGGLE_CLASS_PREFIX+'target-self',
	      ATTR_IS_ACTIVE = 'data-'+TOGGLE_CLASS_PREFIX+'is-active',
	      ATTR_EVENT = 'data-'+TOGGLE_CLASS_PREFIX+'event',
	      ATTR_OUTSIDE = 'data-'+TOGGLE_CLASS_PREFIX+'outside',
	      ATTR_TARGET_ONLY = 'data-'+TOGGLE_CLASS_PREFIX+'target-only',
	      ATTR_ESCAPE = 'data-'+TOGGLE_CLASS_PREFIX+'escape',
	      ATTR_TRIGGER_OFF = 'data-'+TOGGLE_CLASS_PREFIX+'trigger-off',
	      ATTR_TARGET_STATE = 'data-'+TOGGLE_CLASS_PREFIX+'state';

	const ATTR_EXPANDED = 'aria-expanded',
	      ATTR_SELECTED = 'aria-selected';


	// Retrieve all targets of a trigger element
	const retrieveTargets = element => {
		if(element.hasAttribute(ATTR_TARGET_ALL))
			return document.querySelectorAll(element.getAttribute(ATTR_TARGET_ALL));
		else if(element.hasAttribute(ATTR_TARGET_PARENT))
			return element.parentElement.querySelectorAll(element.getAttribute(ATTR_TARGET_PARENT));
		else if(element.hasAttribute(ATTR_TARGET_SELF))
			return element.querySelectorAll(element.getAttribute(ATTR_TARGET_SELF));
		return [];
	}

	// Toggle off all 'toggle-outside' elements when reproducing specified or click event outside trigger or target elements
	const documentEventHandler = event => {
		let target = event.target;

		if (!target.closest('['+ATTR_TARGET_STATE+'="true"]')) {
			[...document.querySelectorAll('['+ATTR_CLASS+']['+ATTR_OUTSIDE+']')].forEach((element) => {
				if(element != target && element.isToggleActive)
					manageToggle(element);
			});
			if(target.hasAttribute(ATTR_OUTSIDE) && target.isToggleActive)
				document.addEventListener(target.getAttribute(ATTR_EVENT) || 'click', documentEventHandler, false);
		}
	}

	// Manage click on 'trigger-off' elements
	const triggerOffHandler = event => {
		manageToggle(event.target.targetElement);
	}

	// Manage event ouside trigger or target elements
	const manageTriggerOutside = element => {
		if(element.hasAttribute(ATTR_OUTSIDE)) {
			if(element.isToggleActive)
				document.addEventListener(element.getAttribute(ATTR_EVENT) || 'click', documentEventHandler, false);
			else
				document.removeEventListener(element.getAttribute(ATTR_EVENT) || 'click', documentEventHandler, false);
		}
	}

	// Manage attributes and events of target elements
	const manageTarget = (targetElement, triggerElement) => {
		if(triggerElement.hasAttribute(ATTR_OUTSIDE))
			targetElement.setAttribute(ATTR_TARGET_STATE, triggerElement.isToggleActive);

		let triggerOffList = targetElement.querySelectorAll('['+ATTR_TRIGGER_OFF+']');
		if(triggerOffList.length > 0) {
			if(triggerElement.isToggleActive) {
				triggerOffList.forEach(triggerOff => {
					triggerOff.targetElement = triggerElement;
					triggerOff.addEventListener('click', triggerOffHandler, false);
				});
			}else{
				triggerOffList.forEach(triggerOff => {
					triggerOff.removeEventListener('click', triggerOffHandler, false);
				});
			}
		}
	}

	// Toggle class and aria on trigger and target elements
	const manageToggle = element => {
		let className = element.getAttribute(ATTR_CLASS);
		element.isToggleActive = !element.isToggleActive;
		//console.log("toggle to "+element.isToggleActive);

		if(!element.hasAttribute(ATTR_TARGET_ONLY))
			element.classList.toggle(className);

		if(element.hasAttribute(ATTR_EXPANDED))
			element.setAttribute(ATTR_EXPANDED, element.isToggleActive);

		if(element.hasAttribute(ATTR_SELECTED))
			element.setAttribute(ATTR_SELECTED, element.isToggleActive);

		let targetElements = retrieveTargets(element);
		for(var i=0;i<targetElements.length;i++) {
			targetElements[i].classList.toggle(className);
			manageTarget(targetElements[i], element);
		}

		manageTriggerOutside(element);
	}

	// Initialization
	const init = () => {

		// Active by default management
		[...document.querySelectorAll('['+ATTR_CLASS+']['+ATTR_IS_ACTIVE+']')].forEach((trigger) => {
			trigger.isToggleActive = true;
			let className = trigger.getAttribute(ATTR_CLASS);

			if(!trigger.hasAttribute(ATTR_TARGET_ONLY) && !trigger.classList.contains(className))
				trigger.classList.add(className);

			if(trigger.hasAttribute(ATTR_EXPANDED) && trigger.getAttribute(ATTR_EXPANDED))
				trigger.setAttribute(ATTR_EXPANDED, true);

			if(trigger.hasAttribute(ATTR_SELECTED) && !trigger.getAttribute(ATTR_SELECTED))
				trigger.setAttribute(ATTR_SELECTED, true);

			let targetElements = retrieveTargets(trigger);
			for(var i=0;i<targetElements.length;i++) {
				if(!targetElements[i].classList.contains(trigger.getAttribute(ATTR_CLASS)))
					targetElements[i].classList.add(className);
				manageTarget(targetElements[i], trigger);
			}

			manageTriggerOutside(trigger);
		});

		// Set specified or click event on each trigger element
		[...document.querySelectorAll('['+ATTR_CLASS+']')].forEach((trigger) => {
			trigger.addEventListener(trigger.getAttribute(ATTR_EVENT) || 'click', (event) => {
				event.preventDefault();
				manageToggle(trigger);
			}, false);
		});

		// Escape key management
		let triggerEscElements = [...document.querySelectorAll('['+ATTR_CLASS+']['+ATTR_ESCAPE+']')];
		if(triggerEscElements.length > 0) {
			document.addEventListener('keyup', (event) => {
				event = event || window.event;
				let isEscape = false;

				if('key' in event)
					isEscape = (event.key === 'Escape' || event.key === 'Esc');
				else
					isEscape = (event.keyCode === 27);

				if(isEscape) {
					triggerEscElements.forEach((trigger) => {
						if(trigger.isToggleActive) manageToggle(trigger);
					});
				}
			}, false);
		}
	}

	const onLoad = () => {
		init();
		document.removeEventListener('DOMContentLoaded', onLoad);
	}

	document.addEventListener('DOMContentLoaded', onLoad);
	window.initEasyToggleState = init;

})(document);
