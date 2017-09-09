$(document).ready(function() {
	$('.validate').on('click', function() {
		var res = new Object();
		res.landing = new Object();
		res.textOnly = new Object();
		res.navigation = new Object();

		res.navigation.choice = $('.navigationChoice:checked').val();

		res.landing.textTitle = $('.landingTextTitle').val();
		res.landing.colorTitle = $('.landingColorTitle').val();
		res.landing.textSubtitle = $('.landingTextSubtitle').val();
		res.landing.colorSubtitle = $('.landingColorSubtitle').val();
		res.landing.textButton = $('.landingTextButton').val();
		res.landing.colorButton = $('.landingColorButton').val();
		res.landing.bgcolorButton = $('.landingBgcolorButton').val();

		res.textOnly.textBody = $('.textonlyTextBody').val();
		res.textOnly.colorBody = $('.textonlyColorBody').val();

		$.post('/updateContent',
			{ data: JSON.stringify(res) },
			function() {
				$('.validate').addClass('success');
			}
		);
	});
});
