(() => {

	// Debounce function: https://davidwalsh.name/javascript-debounce-function
	const debounce = (func, wait, immediate) => {
		let timeout;
		return function () {
			const
				args = arguments,
				context = this;
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				timeout = null;
				if (!immediate) Reflect.apply(func, context, args);
			}, wait);
			if (immediate && !timeout) Reflect.apply(func, context, args);
		};
	};

	const scrollNav = () => {
		[...document.querySelectorAll("#navigation a")].forEach(link => {
			const
				section = document.querySelector(link.hash),
				scrollY = window.scrollY + 1;

			section &&
			section.offsetTop <= scrollY &&
			section.offsetTop + section.offsetHeight > scrollY
				? link.classList.add("is-current")
				: link.classList.remove("is-current");
		});
	};

	window.addEventListener("load", function (e) {
		scrollNav();
		e.target.removeEventListener(e.type, arguments.callee);
	});

	window.addEventListener("scroll", debounce(scrollNav, 10), true);

// ---

fetch('filesize.json')
	.then(response => response.json())
	.then(json => {
		['es6.min.js', 'es6.js'].forEach(element => {
			document.querySelector(`[data-file-size='${element}']`).innerHTML = Math.round(json[element].default/10)/100;
			document.querySelector(`[data-file-size='${element}.gzip']`).innerHTML = Math.round(json[element].gzipped/10)/100;
		});
	});

// ---

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
				--theme: #00885a;
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

	const clickCodePenHandler = async (event) => {
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

	const template = document.querySelector("#demo-template");

	fetch('assets/js/demos.json')
		.then(response => response.json())
		.then(demos => {

			[...document.querySelectorAll("[data-template]")].forEach(element => {

				const demoId = element.getAttribute("data-template");
				element.setAttribute("id", demoId);

				const demoCode = atob(demos[demoId].demo);

				let clone = document.importNode(template.content, true);

				const link = clone.querySelector("h4 a");
				link.setAttribute("href", `#${demoId}`);
				link.innerHTML = demos[demoId].title;

				const demoContainer = clone.querySelector(".demo");
				demoContainer.setAttribute("id", `${demoId}-demo`);
				demoContainer.innerHTML = demoCode;

				if (demos[demoId].category === "dropdown") {
					const dropdownTrigger = clone.querySelector(".demo [data-toggle-class]");
					[...clone.querySelectorAll(".demo [data-toggle-trigger-off]")].forEach(element => {
						element.addEventListener("click", e => {
							dropdownTrigger.innerHTML = element.innerHTML;
						}, false);
					});
				}

				const showCode = clone.querySelector(".show-code");
				showCode.setAttribute("data-toggle-target", `#${demoId}-code`);

				const codeContainer = clone.querySelector(".code-container");
				codeContainer.setAttribute("id", `${demoId}-code`);

				let parsedCode = demoCode;
				parsedCode = parsedCode.replace(/data-toggle-(\w-?)+/g, str => `[${str}](#${str})`);
				parsedCode = parsedCode.replace(/aria-(checked|expanded|hidden|pressed|selected)/g, str => `[${str}](#a11y)`);

				const code = clone.querySelector(".code-container code");
				code.textContent = parsedCode;

				const dlCss = clone.querySelector(".dl-css");
				dlCss.setAttribute("href", `assets/css/${demos[demoId].styles}.css`);
				dlCss.setAttribute("title", `Download this ${demos[demoId].category} demo stylesheet`);

				const dlScss = clone.querySelector(".dl-scss");
				dlScss.setAttribute("href", `assets/scss/${demos[demoId].styles}.scss`);
				dlScss.setAttribute("title", `Download this ${demos[demoId].category} demo stylesheet in SCSS`);

				const codePenBtn = clone.querySelector(".codepen");
				codePenBtn.setAttribute("title", `Open this ${demos[demoId].category} demo on CodePen`);
				codePenBtn.setAttribute("data-title", demos[demoId]['codepen-title']);
				codePenBtn.setAttribute("data-demo", `${demoId}-demo`);
				codePenBtn.setAttribute("data-css", demos[demoId].styles);
				codePenBtn.addEventListener("click", clickCodePenHandler, false);

				element.innerHTML = "";
				element.appendChild(clone);
			});
		})
		.then(() => {
			window.easyToggleState();
			window.Prism.highlightAll();
		});

// ---

	console.log("╭──╮\n│  │ EASY\n│  │ TOGGLE\n│◯│ STATE\n╰──╯");

})();
