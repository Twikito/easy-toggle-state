<!--
The data-toggle-class-on-target attribute tells this button
to toggle the class `is-active` only on its target.

The data-toggle-target-parent attribute tells to look inside its parent element
for a target element matching `.example-lightbox` selector.

The data-toggle-escape attribute tells that you can use
the escape key to toggle back off this trigger.

The data-toggle-modal attribute tells that the target is a modal,
and create a focus trap inside of it when active.

This element is a link instead of a button because its natural behaviour
should be to go to the image.
-->
<a
	href="https://rawgit.com/Twikito/easy-toggle-state/master/docs/assets/img/rp1.jpg"
	class="example-lightbox-trigger"
	title="Zoom"
	role="button"
	data-toggle-class-on-target
	data-toggle-target-parent=".example-lightbox"
	data-toggle-escape
	data-toggle-modal>
	<img src="https://rawgit.com/Twikito/easy-toggle-state/master/docs/assets/img/rp1_s.jpg" alt="Ready Player One">
</a>

<!--
As the aria-hidden attribute is set on this target, its value changes too
-->
<div
	class="example-lightbox"
	role="dialog"
	aria-hidden="true">

	<!--
	Since the data-toggle-trigger-off attribute is set on those elements inside
	the target, it tells those elements to toggle back off the original trigger on click.

	This first element, the backdrop, is a div because we don't want it to be focusable.
	-->
	<div
		class="example-lightbox-backdrop"
		data-toggle-trigger-off>
	</div>
	<button
		type="button"
		class="example-lightbox-close"
		data-toggle-trigger-off
		aria-label="Close"
		title="Close this lightbox">
		&times;
	</button>

	<img class="example-lightbox-img" src="https://rawgit.com/Twikito/easy-toggle-state/master/docs/assets/img/rp1.jpg" alt="Ready Player One">
</div>
