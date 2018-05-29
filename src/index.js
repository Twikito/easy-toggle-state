/* eslint no-unused-vars: "off" */
import ie11 from "./polyfill/ie11";
import init from "./main/main";

const onLoad = () => {
	init();
	document.removeEventListener("DOMContentLoaded", onLoad);
};

document.addEventListener("DOMContentLoaded", onLoad);
window.initEasyToggleState = init;
