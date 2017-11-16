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

		res.pres.textTitle = $('.presTextTitle').val();
		res.pres.colorTitle = $('.presColorTitle').val();
		res.pres.textSubtitle1 = $('.presTextSubtitle1').val();
		res.pres.textSubtitle2 = $('.presTextSubtitle2').val();
		res.pres.textSubtitle3 = $('.presTextSubtitle3').val();

		$.post('/updateContent',
			{ data: JSON.stringify(res) },
			function() {
				$('.validate').addClass('success');
			}
		);
	});
});
