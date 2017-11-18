$(document).ready(function() {
	$('h2').on('click', function() {
		$(this).next('.collapsable').toggleClass('active');
		$(this).toggleClass('active');
	});

	$('#form').submit(function(e) {
		e.preventDefault();

		$('.load').addClass('active');

		var data = {
			data: {
				navigation: {
					choice: $('.navigationChoice:checked').val()
				},
				landing: {
					colorBackground: $('.landingColorBackground').val(),
					textTitle: $('.landingTextTitle').val(),
					colorTitle: $('.landingColorTitle').val(),
					textSubtitle: $('.landingTextSubtitle').val(),
					colorSubtitle: $('.landingColorSubtitle').val(),
					textButton: $('.landingTextButton').val(),
					colorButton: $('.landingColorButton').val(),
					bgcolorButton: $('.landingBgcolorButton').val()
				},
				pres: {
					textTitle: $('.presTextTitle').val(),
					colorTitle: $('.presColorTitle').val(),
					textSubtitle1: $('.presTextSubtitle1').val(),
					textSubtitle2: $('.presTextSubtitle2').val(),
					textSubtitle3: $('.presTextSubtitle3').val(),
					textBody1: $('.presTextBody1').val(),
					textBody2: $('.presTextBody2').val(),
					textBody3: $('.presTextBody3').val()
				}
			}
		};

		$(this).ajaxSubmit({
    	data: data,
    	contentType: 'application/json',
    	success: function(response){
				$('.load').addClass('active');
				$('.validate').addClass('success');
    	}
		});

  	return false;
	});
});
