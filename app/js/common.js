$(function () {
	// toggle "active" class at menu items
	$(".navbar-nav .nav-link").on("click", function () {
		$(".navbar-nav").find(".active").removeClass("active");
		$(this).addClass("active");
	});

	// nav-toogler animation
	$('#nav-toggler').click(function () {
		$(this).toggleClass('open');
	});
});