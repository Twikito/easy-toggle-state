const PREFIX = 'toggle-'; // Prefix should end by hyphen
const dataset = (key) => `data-${PREFIX}-${key}`;

const DATA = {
	CLASS: dataset('class'),
	GROUP: dataset('group'),
	EVENT: dataset('event'),
	ESCAPE: dataset('escape'),
	OUTSIDE: dataset('outside'),
	IS_ACTIVE: dataset('is-active'),
	TARGET_ALL: dataset('target-all'),
	TARGET_ONLY: dataset('target-only'),
	TRIGGER_OFF: dataset('trigger-off'),
	TARGET_SELF: dataset('target-self'),
	TARGET_STATE: dataset('state'),
	TARGET_PARENT: dataset('target-parent')
};

const ARIA = {
	EXPANDED : 'aria-expanded',
	SELECTED : 'aria-selected'
};

module.exports = { ARIA, DATA };
