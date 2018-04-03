import { init }
	from './_initializer';

const onLoad = () => {
	init();
	document.removeEventListener('DOMContentLoaded', onLoad);
}

document.addEventListener('DOMContentLoaded', onLoad);
window.initEasyToggleState = init;
