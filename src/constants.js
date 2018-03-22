const PREFIX = 'toggle';

const dataset = key => 'data-' + PREFIX + ( PREFIX != '' ? '-' : '' ) + key;
const ATTR = {
	CLASS         : dataset('class'),
	TARGET_ALL    : dataset('target-all'),
	TARGET_PARENT : dataset('target-parent'),
	TARGET_SELF   : dataset('target-self'),
	IS_ACTIVE     : dataset('is-active'),
	GROUP         : dataset('group'),
	EVENT         : dataset('event'),
	OUTSIDE       : dataset('outside'),
	TARGET_ONLY   : dataset('target-only'),
	ESCAPE        : dataset('escape'),
	TRIGGER_OFF   : dataset('trigger-off'),
	TARGET_STATE  : dataset('state'),
	EXPANDED      : 'aria-expanded',
	SELECTED      : 'aria-selected'
};

module.exports = ATTR;
