import PREFIX from "./prefix";

/**
 * Retrieve a valid HTML attribute string.
 * @param {string} key - A string to build a html attribute
 * @returns {string} - A valid html attribute
 */
const dataset = key => ["data", PREFIX, key].filter(Boolean).join("-");

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
