$(document).ready(function() {
	$('.validate').on('click', function() {
		var res = new Object();
		res.landing = new Object();
		res.pres = new Object();
		res.navigation = new Object();

		res.navigation.choice = $('.navigationChoice:checked').val();

		res.landing.imageBackground = $('.landingImageBackground').val();
		res.landing.colorBackground = $('.landingColorBackground').val();
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
		res.pres.textBody1 = $('.presTextBody1').val();
		res.pres.textBody2 = $('.presTextBody2').val();
		res.pres.textBody3 = $('.presTextBody3').val();

		$.post('/updateContent',
			{ data: JSON.stringify(res) },
			function() {
				$('.validate').addClass('success');
			}
		);
	});
});
