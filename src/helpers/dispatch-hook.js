/**
 * Dispatch hooks
 * @param {node} element - An element on which dispatch the hook
 * @param {string} action - An event to dispatch
 * @returns {boolean} - True or False
 */
export default (element, action) => element.dispatchEvent(action);
