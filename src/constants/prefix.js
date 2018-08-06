/**
 * You can change this PREFIX value to prevent conflict with another JS library.
 * This prefix will be set to all attributes like 'data-PREFIX-class'.
 */

const PREFIX = document.documentElement.getAttribute("data-easy-toggle-state-custom-prefix") || "toggle";

export const getPrefix = () => PREFIX;
