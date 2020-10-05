/**
 * Add a namespace for element properties.
 * @param {string} property - The property aadded on any element
 * @returns {string} - The property with the namespace
 */
export default (property) => `easyToggleState_${property}`;
