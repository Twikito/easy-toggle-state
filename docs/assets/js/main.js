(() => {

	const clickEventHandler = event => {
		let JSON = {"title": "Example of tabs", "layout": "left", "js": "/* Easy Toggle State is added as external resource */", "js_external": "https://rawgit.com/Twikito/easy-toggle-state/master/dist/easy-toggle-state.es6.min.js"};
		JSON.html = document.getElementById("tabs-demo").textContent;
		const response = await fetch('../assets/css/tabs.css');
		JSON.css = await response.text();

		const form = (
			  '<form method="post" action="https://codepen.io/pen/define" class="hidden" target="_blank">'
			+ '<input type="hidden" name="data">'
			+ '<button type="submit"></button>'
			+ '</form>'
		).appendTo(document.body);
		form.find("input[name=data]").val(JSON);
		form.get(0).submit();
	};

	document.getElementById('test').addEventListener('click', clickEventHandler, false);
})();
