(() => {

	const clickEventHandler = async (event) => {
		let data = {
			"title"       : `Example of ${event.target.dataset.title} with Easy Toggle State`,
			"layout"      : "left",
			"html"        : "",
			"css"         : ":root {\n	--theme: #00b074;\n}\nbody {\n	padding: 2em;\n	background: #e6e8ea;\n	font-size: 1.125em;\n	line-height: 1.5;\n}\n",
			"css_starter" : "normalize",
			"css_prefix"  : "autoprefixer",
			"js"          : "/*\n * Easy Toggle State is added here as external resource.\n * You can see this in this pen's JS settings.\n *\n * Go check other demos at https://twikito.github.io/easy-toggle-state/\n */",
			"js_external" : "https://rawgit.com/Twikito/easy-toggle-state/master/dist/easy-toggle-state.es6.min.js"
		};
		data.html = document.getElementById(event.target.dataset.demo).innerHTML;
		const response = await fetch(`https://rawgit.com/Twikito/easy-toggle-state/master/docs/assets/css/${event.target.dataset.css}.css`);
		data.css += await response.text();

		const form = document.createElement("FORM");
		form.method = "post";
		form.action = "https://codepen.io/pen/define";
		form.target = "_blank";
		form.className = "hidden";
		form.innerHTML = `
			<input type="hidden" name="data">
			<button type="submit"></button>
		`;
		form.querySelector("input").value = JSON.stringify(data);
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	};

	[...document.querySelectorAll(".codepen")].forEach(button => button.addEventListener("click", clickEventHandler, false));
})();
