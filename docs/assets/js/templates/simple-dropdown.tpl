<div class="example-dropdown">
	<!--
	The data-toggle-class attribute tells this button
	to toggle the class `is-open` on itself and its target on click.

	The data-toggle-target-next attribute tells that the target
	of this trigger is the next sibling element.

	The data-toggle-outside attribute tells to use the `click` event by default
	outside to toggle back off this trigger.

	The data-toggle-escape attribute tells that you can use
	the escape key to toggle back off this trigger.
	-->
	<button
		type="button"
		class="example-dropdown-button"
		data-toggle-class="is-open"
		data-toggle-target-next
		data-toggle-outside
		data-toggle-escape>
		Select something here
	</button>

	<ul class="example-dropdown-list">
		<li>
			<!--
			Since the data-toggle-trigger-off attribute is set on a button inside
			the target, it tells those elements to toggle back off the original trigger on click.
			-->
			<button
				type="button"
				data-toggle-trigger-off>
				Lorem ipsum dolor
			</button>
		</li>
		<li>
			<button
				type="button"
				data-toggle-trigger-off>
				Consectetur adipiscing elit
			</button>
		</li>
		<li>
			<button
				type="button"
				data-toggle-trigger-off>
				Ut bibendum nisi
			</button>
		</li>
		<li>
			<button
				type="button"
				data-toggle-trigger-off>
				A tincidunt velit
			</button>
		</li>
		<li>
			<button
				type="button"
				data-toggle-trigger-off>
				Duis egestas purus
			</button>
		</li>
		<li>
			<button
				type="button"
				data-toggle-trigger-off>
				In sapien porta
			</button>
		</li>
		<li>
			<button
				type="button"
				data-toggle-trigger-off>
				Pellentesque
			</button>
		</li>
		<li>
			<button
				type="button"
				data-toggle-trigger-off>
				Condimentum risus
			</button>
		</li>
		<li>
			<button
				type="button"
				data-toggle-trigger-off>
				Fringilla augue sed
			</button>
		</li>
		<li>
			<button
				type="button"
				data-toggle-trigger-off>
				Nunc fermentum
			</button>
		</li>
	</ul>
</div>
