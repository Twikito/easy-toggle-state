(() => {

	const scroll = new SmoothScroll("a[href^='#']:not([role='button'])", {
		speed: 500,
		easing: 'easeInOutQuint'
	});


	const dedent = (callSite, ...args) => {
		const format = str => {
			let size = -1;
			return str.replace(/\n(\s+)/g, (m, m1) => {
				if (size < 0)
					size = m1.length;
				return "\n" + m1.slice(Math.min(m1.length, size));
			});
		}
		if (typeof callSite === "string")
			return format(callSite);
		if (typeof callSite === "function")
			return (...args) => format(callSite(...args));
		let output = callSite
			.slice(0, args.length + 1)
			.map((text, i) => (i === 0 ? "" : args[i - 1]) + text)
			.join("");
		return format(output);
	}

	const getCSS = (html, css) => {
		const srOnly = dedent`
			/* Only for screen readers */
			.sr-only {
				position: absolute;
				width: 1px;
				height: 1px;
				margin: -1px;
				padding: 0;
				overflow: hidden;
				border: 0;
				white-space: nowrap;
				clip: rect(0 0 0 0);
				clip-path: inset(50%);
			}
		`;
		const forDemo = dedent`
			/* For demo */
			:root {
				--theme: #00b074;
			}
			body {
				padding: 2em;
				background: #e6e8ea;
				font-size: 1.125em;
				line-height: 1.5;
			}
		`;

		if (html.includes('sr-only')) {
			return `${css}${srOnly}${forDemo}`;
		}
		return `${css}${forDemo}`;
	}

	const clickEventHandler = async (event) => {
		const data = {
			"title"       : `Example of ${event.target.dataset.title} with Easy Toggle State`,
			"layout"      : "left",
			"css_starter" : "normalize",
			"css_prefix"  : "autoprefixer",
			"js"          : dedent`
				/*
				 * Easy Toggle State is added here as external resource.
				 * You can see this in this pen's JS settings.
				 *
				 * Go check other demos at https://twikito.github.io/easy-toggle-state/
				 */
			`,
			"js_external" : "https://rawgit.com/Twikito/easy-toggle-state/master/dist/easy-toggle-state.es6.min.js",
			html: dedent(document.getElementById(event.target.dataset.demo).innerHTML)
		};

		const response = await fetch(`https://rawgit.com/Twikito/easy-toggle-state/master/docs/assets/css/${event.target.dataset.css}.css`);
		data.css = getCSS(data.html, await response.text());

		const form = document.createElement("FORM");
		form.method = "post";
		form.action = "https://codepen.io/pen/define";
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
