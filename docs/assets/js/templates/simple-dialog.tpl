<!--
The data-toggle-class-on-target attribute tells this button
to toggle the class `is-active` only on its target.

The data-toggle-target attribute tells to look inside the whole page
for a target element matching `#dialog_Q6szN` selector.

The data-toggle-escape attribute tells that you can use
the escape key to toggle back off this trigger.

The data-toggle-modal attribute tells that the target is a modal,
and create a focus trap inside of it when active.
-->
<button
	type="button"
	class="example-dialog-trigger"
	data-toggle-class-on-target
	data-toggle-target="#dialog_Q6szN"
	data-toggle-escape
	data-toggle-modal>
	Click to see the awesomeness
</button>

<div class="example-dialog" id="dialog_Q6szN">
	<section class="example-dialog-container">
		<header class="example-dialog-header">
			<h5>Dialog title</h5>
		</header>
		<div class="example-dialog-content">
			<p><strong>Any content you want, such as text or form.</strong></p>
			<p>The following fake links are here to illustrate the focus trap inside this modal, thanks to <code class="language-html">data-toggle-modal</code> attribute on the trigger.</p>
			<p><a href="#">Lorem ipsum</a> dolor sit amet, consectetur adipisicing elit. Et quibusdam labore <a href="#">tempore repudiandae</a> minima earum adipisci, dolor distinctio <a href="#">facere</a> illo recusandae <a href="#">fuga</a> placeat amet <a href="#">corrupti</a> omnis ullam accusamus reprehenderit id.</p>
		</div>
		<footer class="example-dialog-footer">
			<!--
			Since the data-toggle-trigger-off attribute is set on a button inside
			the target, it tells those elements to toggle back off the original trigger on click.
			-->
			<button
				type="button"
				data-toggle-trigger-off>
				close
			</button>
		</footer>
	</section>
</div>
