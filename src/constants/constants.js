import { getPrefix } from "./prefix";

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
export const ARROWS = dataset("arrows"),
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
