/* Test the targets list */
export default (selector, targetList) => {

	/* Test if there's no match for a selector */
	if (targetList.length === 0) {
		console.warn(`There's no match for the selector '${selector}' for this trigger`);
	}

	/* Test if there's more than one match for an ID selector */
	const matches = selector.match(/#\w+/gi);
	if (matches) {
		matches.forEach(match => {
			let result = [...targetList].filter(target => target.id === match.slice(1));
			if (result.length > 1) {
				console.warn(`There's ${result.length} matches for the selector '${match}' for this trigger`);
			}
		});
	}

	return targetList;
};
