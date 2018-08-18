/**
 * Prefix set to all attributes.
 */

const PREFIX = document.documentElement.getAttribute("data-easy-toggle-state-custom-prefix") || "toggle";

export const getPrefix = () => PREFIX;
