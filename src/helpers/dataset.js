import PREFIX from "../constants/prefix";

/**
 * Retrieve a valid HTML attribute string.
 * @param {string} key - A string to build a html attribute
 * @returns {string} A valid html attribute
 */
export default key => ["data", PREFIX, key].filter(Boolean).join("-");
