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

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  /**
   * Prefix set to all attributes.
   */
  var PREFIX = document.documentElement.getAttribute("data-easy-toggle-state-custom-prefix") || "toggle";
  var getPrefix = function getPrefix() {
    return PREFIX;
  };

  /**
   * Retrieve a valid HTML attribute string.
   * @param {string} key - A string to build a html attribute
   * @param {string} prefix - The prefix maybe set by user
   * @returns {string} - A valid html attribute
   */

  var dataset = function dataset(key) {
    var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getPrefix();
    return ["data", prefix, key].filter(Boolean).join("-");
  };
  /**
   * All constants containing HTML attributes string.
   */


  var ARROWS = dataset("arrows"),
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
  var TOGGLE_AFTER = new Event("toggleAfter"),
      TOGGLE_BEFORE = new Event("toggleBefore");

  /**
   * Retrieve all trigger elements with a specific attribute, or all nodes in a specific scope.
   * @param {string} selector - A string that contains a selector
   * @param {node} node - An element in which to make the selection
   * @returns {array} - An array of elements
   */

  var $$ = (function (selector, node) {
    var scope = selector ? "[".concat(selector, "]") : "";

    if (node) {
      return _toConsumableArray(node.querySelectorAll(scope));
    }

    var query = ["[".concat(CLASS, "]").concat(scope), "[".concat(CLASS_TRIGGER, "]").concat(scope), "[".concat(CLASS_TARGET, "][").concat(TARGET, "]").concat(scope), "[".concat(CLASS_TARGET, "][").concat(TARGET_ALL, "]").concat(scope), "[".concat(CLASS_TARGET, "][").concat(TARGET_NEXT, "]").concat(scope), "[".concat(CLASS_TARGET, "][").concat(TARGET_PREVIOUS, "]").concat(scope), "[".concat(CLASS_TARGET, "][").concat(TARGET_PARENT, "]").concat(scope), "[".concat(CLASS_TARGET, "][").concat(TARGET_SELF, "]").concat(scope)].join().trim();
    return _toConsumableArray(document.querySelectorAll(query));
  });

  /**
   * Dispatch hooks
   * @param {node} element - An element on which dispatch the hook
   * @param {string} action - An event to dispatch
   * @returns {boolean} - True or False
   */
  var dispatchHook = (function (element, action) {
    return element.dispatchEvent(action);
  });

  /**
   * Add a namespace for element properties.
   * @param {string} property - The property aadded on any element
   * @returns {string} - The property with the namespace
   */
  var namespacedProp = (function (property) {
    return "easyToggleState_".concat(property);
  });

  /**
   * Aria attributes toggle manager.
   * @param {node} element - Current element with aria attributes to manage.
   * @param {json} [config] - List of aria attributes and value to assign.
   * @returns {undefined}
   */

  var manageAria = (function (element) {
    var _ref;

    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (_ref = {}, _defineProperty(_ref, CHECKED, element[namespacedProp('isActive')]), _defineProperty(_ref, EXPANDED, element[namespacedProp('isActive')]), _defineProperty(_ref, HIDDEN, !element[namespacedProp('isActive')]), _defineProperty(_ref, PRESSED, element[namespacedProp('isActive')]), _defineProperty(_ref, SELECTED, element[namespacedProp('isActive')]), _ref);
    return Object.keys(config).forEach(function (key) {
      return element.hasAttribute(key) && element.setAttribute(key, config[key]);
    });
  });

  var warningText = function warningText(classItem, attribute) {
    var isTarget = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    return "This trigger has the class name '".concat(classItem, "' filled in both attributes '").concat(CLASS, "' and '").concat(attribute, "'. As a result, this class will be toggled ").concat(isTarget && 'on its target(s)', " twice at the same time.");
  };
  /**
   * Retrieve an array of class names from an attribute value.
   * @param {node} element - The trigger element on which get the attribute
   * @param {string} attribute - The attribute on which get class names
   * @returns {array} - An array of class names
   */


  var classFromAttribute = function classFromAttribute(element, attribute) {
    return (element.getAttribute(attribute) || '').split(' ').filter(Boolean);
  };
  /**
   * Retrieve class lists for trigger and target elements.
   * @param {node} element - The trigger element on which get all class names
   * @returns {object} - An object with two arrays with trigger and target class lists
   */


  var retrieveClassList = (function (element) {
    if (element.hasAttribute(CLASS) && element.getAttribute(CLASS) && (element.hasAttribute(CLASS_TRIGGER) || element.hasAttribute(CLASS_TARGET))) {
      var triggerClassArray = classFromAttribute(element, CLASS_TRIGGER);
      var targetClassArray = classFromAttribute(element, CLASS_TARGET);
      /** Warn if there repetition class name between CLASS and CLASS_TRIGGER or CLASS and CLASS_TARGET */

      classFromAttribute(element, CLASS).forEach(function (classItem) {
        if (triggerClassArray.includes(classItem)) {
          console.warn(warningText(classItem, CLASS_TRIGGER), element);
        }

        if (targetClassArray.includes(classItem)) {
          console.warn(warningText(classItem, CLASS_TARGET, true), element);
        }
      });
    }
    /** Get class list for trigger and targets from attributes */


    var lists = [CLASS, CLASS_TRIGGER, CLASS_TARGET].reduce(function (acc, val) {
      var _acc$trigger, _acc$target;

      var list = classFromAttribute(element, val);
      (val === CLASS || val === CLASS_TRIGGER) && (_acc$trigger = acc.trigger).push.apply(_acc$trigger, _toConsumableArray(list));
      (val === CLASS || val === CLASS_TARGET) && (_acc$target = acc.target).push.apply(_acc$target, _toConsumableArray(list));
      return acc;
    }, {
      trigger: [],
      target: []
    });
    !lists.trigger.length && (element.hasAttribute(CLASS) || element.hasAttribute(CLASS_TRIGGER)) && lists.trigger.push(DEFAULT_CLASS);
    !lists.target.length && (element.hasAttribute(CLASS) || element.hasAttribute(CLASS_TARGET)) && lists.target.push(DEFAULT_CLASS);
    return lists;
  });

  /**
   * Retrieve all active elements of a group.
   * @param {node} element - An element of a group
   * @returns {array} - An array of active elements of a group
   */

  var retrieveGroupActiveElement = (function (element) {
    var type = element.hasAttribute(GROUP) ? GROUP : RADIO_GROUP;
    return $$("".concat(type, "=\"").concat(element.getAttribute(type), "\"")).filter(function (groupElement) {
      return groupElement[namespacedProp('isActive')];
    });
  });

  /**
   * Test a selector.
   * @param {string} selector - The selector corresponding to the targets list
   * @param {string} attribute - The selector scope, set by the user
   * @returns {undefined}
   */

  var testSelector = function testSelector(selector, attribute) {
    if (!selector) {
      console.warn("You should fill the attribute '".concat(attribute, "' with a selector"));
    }
  };
  /**
   * Test a targets list.
   * @param {string} selector - The selector corresponding to the targets list
   * @param {nodeList} targetList - A target elements list
   * @returns {nodeList} - The targets list
   */


  var testTargets = function testTargets(selector, targetList) {
    /** Test if there's no match for a selector */
    if (targetList.length === 0) {
      console.warn("There's no match with the selector '".concat(selector, "' for this trigger"));
      return [];
    }
    /** Test if there's more than one match for an ID selector */


    var matches = selector.match(/#\w+/gi);

    if (matches) {
      matches.forEach(function (match) {
        var result = _toConsumableArray(targetList).filter(function (target) {
          return target.id === match.slice(1);
        });

        if (result.length > 1) {
          console.warn("There's ".concat(result.length, " matches with the selector '").concat(match, "' for this trigger"));
        }
      });
    }

    return _toConsumableArray(targetList);
  };
  /**
   * Retrieve all targets of a trigger element, depending of its target attribute.
   * @param {node} element - A trigger element
   * @returns {nodeList} - All targets of a trigger element
   */


  var retrieveTargets = (function (element) {
    if (element.hasAttribute(TARGET) || element.hasAttribute(TARGET_ALL)) {
      var selector = element.getAttribute(TARGET) || element.getAttribute(TARGET_ALL);
      testSelector(selector, element.hasAttribute(TARGET) ? TARGET : TARGET_ALL);
      return testTargets(selector, document.querySelectorAll(selector));
    }

    if (element.hasAttribute(TARGET_PARENT)) {
      var _selector = element.getAttribute(TARGET_PARENT);

      testSelector(_selector, TARGET_PARENT);
      return testTargets(_selector, element.parentElement.querySelectorAll(_selector));
    }

    if (element.hasAttribute(TARGET_SELF)) {
      var _selector2 = element.getAttribute(TARGET_SELF);

      testSelector(_selector2, TARGET_SELF);
      return testTargets(_selector2, element.querySelectorAll(_selector2));
    }

    if (element.hasAttribute(TARGET_PREVIOUS)) {
      return testTargets("previous", [element.previousElementSibling].filter(Boolean));
    }

    if (element.hasAttribute(TARGET_NEXT)) {
      return testTargets("next", [element.nextElementSibling].filter(Boolean));
    }

    return [];
  });

  /**
   * Toggle each class in list on the element.
   * @param {node} element - An element on which toggle each class
   * @param {array} list - An array of classlist to toggle
   * @returns {undefined}
   */
  var toggleClassList = (function (element, list) {
    return list.forEach(function (listItem) {
      element.classList.toggle(listItem);
    });
  });

  /** Need to use a map for some event handler to ensure to have the same signature */

  var HANDLER_MAP = {};
  /**
   * Manage event listener on document
   * @param {element} element - The element on which test if there event type specified
   * @returns {undefined}
   */

  var addEventListenerOnDocument = function addEventListenerOnDocument(element) {
    return document.addEventListener(element.getAttribute(OUTSIDE_EVENT) || element.getAttribute(EVENT) || "click", documentEventHandler, false);
  };
  /**
   * Toggle off all elements width 'data-toggle-outside' attribute
   * when reproducing specified or click event outside itself or its targets.
   * @param {event} event - Event triggered on document
   * @returns {undefined}
   */


  var documentEventHandler = function documentEventHandler(event) {
    var eTarget = event.target,
        eType = event.type;
    var insideTarget = false;
    $$(OUTSIDE).filter(function (element) {
      return element.getAttribute(OUTSIDE_EVENT) === eType || element.getAttribute(EVENT) === eType && !element.hasAttribute(OUTSIDE_EVENT) || eType === "click" && !element.hasAttribute(EVENT) && !element.hasAttribute(OUTSIDE_EVENT);
    }).forEach(function (element) {
      var e = eTarget.closest("[".concat(TARGET_STATE, "=\"true\"]"));

      if (e && e[namespacedProp('trigger')] === element) {
        insideTarget = true;
      }

      if (!insideTarget && element !== eTarget && !element.contains(eTarget) && element[namespacedProp('isActive')]) {
        (element.hasAttribute(GROUP) || element.hasAttribute(RADIO_GROUP) ? manageGroup : manageToggle)(element);
      }
    });

    if (!insideTarget) {
      document.removeEventListener(eType, documentEventHandler, false);
    } // eTarget may be an element inside a trigger


    var newTarget = eTarget.closest("[".concat(CLASS, "][").concat(OUTSIDE, "],[").concat(CLASS_TRIGGER, "][").concat(OUTSIDE, "],[").concat(CLASS_TARGET, "][").concat(OUTSIDE, "]"));

    if (newTarget && newTarget[namespacedProp('isActive')]) {
      addEventListenerOnDocument(eTarget);
    }
  };
  /**
   * Manage click on elements with 'data-trigger-off' attribute.
   * @param {event} event - Event triggered on element with 'trigger-off' attribute
   * @returns {undefined}
   */


  var triggerOffHandler = function triggerOffHandler(event) {
    return manageToggle(event.currentTarget[namespacedProp('target')]);
  };
  /**
   * Manage event ouside trigger or target elements.
   * @param {node} element - The element to toggle when 'click' or custom event is triggered on document
   * @returns {undefined}
   */


  var manageTriggerOutside = function manageTriggerOutside(element) {
    if (!element.hasAttribute(OUTSIDE)) {
      return;
    }

    if (element.hasAttribute(RADIO_GROUP)) {
      return console.warn("You can't use '".concat(OUTSIDE, "' on a radio grouped trigger"));
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


  var manageTriggerOff = function manageTriggerOff(targetElement, triggerElement) {
    var triggerOffList = $$(TRIGGER_OFF, targetElement).filter(function (triggerOff) {
      return !triggerOff.getAttribute(TRIGGER_OFF) || targetElement.matches(triggerOff.getAttribute(TRIGGER_OFF));
    });

    if (triggerOffList.length === 0) {
      return;
    }

    if (triggerElement[namespacedProp('isActive')]) {
      return triggerOffList.forEach(function (triggerOff) {
        // Do not override if another reference is already set
        if (!triggerOff[namespacedProp('target')]) {
          triggerOff[namespacedProp('target')] = triggerElement;
          triggerOff.addEventListener("click", triggerOffHandler, false);
        }
      });
    }

    triggerOffList.forEach(function (triggerOff) {
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


  var focusTrapHandler = function focusTrapHandler(targetElement) {
    return function (event) {
      var focusablesList = _toConsumableArray(targetElement.querySelectorAll("a[href], area[href], input:not([type='hidden']):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]"));

      if (!focusablesList.length || event.key !== "Tab") {
        return;
      }

      var currentItem = event.target,
          firstItem = focusablesList[0],
          lastItem = focusablesList[focusablesList.length - 1]; // Outside focus trap container: focus on first

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
  };
  /**
   * Manage attributes and events of targets elements.
   * @param {node} triggerElement - The trigger element
   * @param {array} classListForTarget - The class list to toggle
   * @param {boolean} onLoadActive - A flag for active by default
   * @returns {undefined}
   */


  var manageTargets = function manageTargets(triggerElement, classListForTarget, onLoadActive) {
    return retrieveTargets(triggerElement).forEach(function (targetElement) {
      dispatchHook(targetElement, TOGGLE_BEFORE);
      targetElement[namespacedProp('isActive')] = !targetElement[namespacedProp('isActive')];
      manageAria(targetElement);

      if (onLoadActive) {
        var _targetElement$classL;

        (_targetElement$classL = targetElement.classList).add.apply(_targetElement$classL, _toConsumableArray(classListForTarget));
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
  };
  /**
   * Toggle class and aria on trigger and target elements.
   * @param {node} element - The element to toggle state and attributes
   * @returns {undefined}
   */


  var manageToggle = function manageToggle(element) {
    dispatchHook(element, TOGGLE_BEFORE);
    var classList = retrieveClassList(element);
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


  var manageGroup = function manageGroup(element) {
    var groupActiveElements = retrieveGroupActiveElement(element);

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


  var isActive = function isActive(element) {
    return !!element[namespacedProp('isActive')];
  };
  /**
   * Unbind toggling management from an element list.
   * @param {node} elementList - An element, or element list, on which remove the toggling management
   * @returns {node} - Same element, or element list
   */

  var unbind = function unbind(elementList) {
    (elementList[Symbol.iterator] ? _toConsumableArray(elementList) : [elementList]).forEach(function (element) {
      element[namespacedProp('unbind')] && element[namespacedProp('unbind')]();
    });
    return elementList;
  };
  /**
   * Unbind toggling management from all initialized elements in the page.
   * @returns {nodeList} - A list of unbinded triggers
   */

  var unbindAll = function unbindAll() {
    return unbind($$().filter(function (trigger) {
      return trigger[namespacedProp('isInitialized')];
    }));
  };
  /**
   * Initialization.
   * @returns {array} - An array of initialized triggers
   */

  var initialize = (function () {
    /**
     * Warn if there some CLASS_TARGET triggers with no specified target.
     */
    _toConsumableArray(document.querySelectorAll("[".concat(CLASS_TARGET, "]:not([").concat(TARGET, "]):not([").concat(TARGET_ALL, "]):not([").concat(TARGET_NEXT, "]):not([").concat(TARGET_PREVIOUS, "]):not([").concat(TARGET_PARENT, "]):not([").concat(TARGET_SELF, "])"))).forEach(function (element) {
      console.warn("This trigger has the attribute '".concat(CLASS_TARGET, "', but no specified target\n"), element);
    });
    /**
     * Active by default management.
     */


    $$(IS_ACTIVE).filter(function (trigger) {
      return !trigger[namespacedProp('isDefaultInitialized')];
    }).forEach(function (trigger) {
      if ((trigger.hasAttribute(GROUP) || trigger.hasAttribute(RADIO_GROUP)) && retrieveGroupActiveElement(trigger).length > 0) {
        return console.warn("Toggle group '".concat(trigger.getAttribute(GROUP) || trigger.getAttribute(RADIO_GROUP), "' must not have more than one trigger with '").concat(IS_ACTIVE, "'"));
      }

      manageToggle(trigger);
      trigger[namespacedProp('isDefaultInitialized')] = true;
    });
    /**
     * Set specified or click event on each trigger element.
     */

    var triggerList = $$().filter(function (trigger) {
      return !trigger[namespacedProp('isInitialized')];
    });
    triggerList.forEach(function (trigger) {
      var handler = function handler(event) {
        event.preventDefault();
        (trigger.hasAttribute(GROUP) || trigger.hasAttribute(RADIO_GROUP) ? manageGroup : manageToggle)(trigger);
      };

      var eventName = trigger.getAttribute(EVENT) || "click";
      trigger.addEventListener(eventName, handler, false);

      trigger[namespacedProp('unbind')] = function () {
        trigger.removeEventListener(eventName, handler, false);
        trigger[namespacedProp('isInitialized')] = false;
      };

      trigger[namespacedProp('isInitialized')] = true;
    });
    /**
     * Escape key management.
     */

    if ($$(ESCAPE).length > 0 && !document[namespacedProp('isEscapeKeyInitialized')]) {
      document.addEventListener("keydown", function (event) {
        if (!(event.key === "Escape") && !(event.key === "Esc")) {
          return;
        }

        $$(ESCAPE).forEach(function (trigger) {
          if (!trigger[namespacedProp('isActive')]) {
            return;
          }

          if (trigger.hasAttribute(RADIO_GROUP)) {
            return console.warn("You can't use '".concat(ESCAPE, "' on a radio grouped trigger"));
          }

          return (trigger.hasAttribute(GROUP) ? manageGroup : manageToggle)(trigger);
        });
      }, false);
      document[namespacedProp('isEscapeKeyInitialized')] = true;
    }
    /**
     * Arrows key management.
     */


    if ($$(ARROWS).length > 0 && !document[namespacedProp('isArrowKeysInitialized')]) {
      document.addEventListener("keydown", function (event) {
        var activeElement = document.activeElement;

        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"].indexOf(event.key) === -1 || !activeElement.hasAttribute(CLASS) && !activeElement.hasAttribute(CLASS_TRIGGER) && !activeElement.hasAttribute(CLASS_TARGET) || !activeElement.hasAttribute(ARROWS)) {
          return;
        }

        if (!activeElement.hasAttribute(GROUP) && !activeElement.hasAttribute(RADIO_GROUP)) {
          return console.warn("You can't use '".concat(ARROWS, "' on a trigger without '").concat(GROUP, "' or '").concat(RADIO_GROUP, "'"));
        }

        event.preventDefault();
        var groupList = activeElement.hasAttribute(GROUP) ? $$("".concat(GROUP, "='").concat(activeElement.getAttribute(GROUP), "'")) : $$("".concat(RADIO_GROUP, "='").concat(activeElement.getAttribute(RADIO_GROUP), "'"));
        var newElement = activeElement;

        switch (event.key) {
          case "ArrowUp":
          case "ArrowLeft":
            newElement = groupList.indexOf(activeElement) > 0 ? groupList[groupList.indexOf(activeElement) - 1] : groupList[groupList.length - 1];
            break;

          case "ArrowDown":
          case "ArrowRight":
            newElement = groupList.indexOf(activeElement) < groupList.length - 1 ? groupList[groupList.indexOf(activeElement) + 1] : groupList[0];
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
      }, false);
      document[namespacedProp('isArrowKeysInitialized')] = true;
    }

    return triggerList;
  });

  var handler = function handler() {
    initialize();
    document.removeEventListener("DOMContentLoaded", handler);
  };

  document.addEventListener("DOMContentLoaded", handler);
  window.easyToggleState = Object.assign(initialize, {
    isActive: isActive,
    unbind: unbind,
    unbindAll: unbindAll
  });

}());
