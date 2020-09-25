/**
 * Toggle each class in list on the element.
 * @param {node} element - An element on which toggle each class
 * @param {array} list - An array of classlist to toggle
 * @returns {undefined}
 */
export default (element, list) => list.forEach(listItem => {
	element.classList.toggle(listItem);
});
