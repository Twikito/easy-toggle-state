import initialize, { isActive, unbind, unbindAll } from "./main/main";

const handler = () => {
	initialize();
	document.removeEventListener("DOMContentLoaded", handler);
};
document.addEventListener("DOMContentLoaded", handler);

window.easyToggleState = Object.assign(
	initialize,
	{
		isActive,
		unbind,
		unbindAll
	}
);
