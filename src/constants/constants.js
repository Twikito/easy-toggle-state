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
export const CHECKED = "aria-checked",
	CLASS = dataset("class"),
	ESCAPE = dataset("escape"),
	EVENT = dataset("event"),
	EXPANDED = "aria-expanded",
	GROUP = dataset("group"),
	HIDDEN = "aria-hidden",
	IS_ACTIVE = dataset("is-active"),
	OUTSIDE = dataset("outside"),
	RADIO_GROUP = dataset("radio-group"),
	SELECTED = "aria-selected",
	TARGET = dataset("target"),
	TARGET_ALL = dataset("target-all"),
	TARGET_NEXT = dataset("target-next"),
	TARGET_ONLY = dataset("target-only"),
	TARGET_PARENT = dataset("target-parent"),
	TARGET_PREVIOUS = dataset("target-previous"),
	TARGET_SELF = dataset("target-self"),
	TARGET_STATE = dataset("state"),
	TRIGGER_OFF = dataset("trigger-off");
