$(document).ready(function() {
	$('h2').on('click', function() {
		$(this).next('.collapsable').toggleClass('active');
		$(this).toggleClass('active');
	});

	$('#form').submit(function(e) {
		e.preventDefault();

		$('.load').addClass('active');

		var data = old;

		for (var cat in data) {
			for (var tab in data[cat]) {
				for (var i = 0; i < data[cat][tab].length; i++) {
					let tmp = data[cat][tab][i];
					let $input = $('[data-id="' + cat + tab + tmp.name + '"]');

					if (tmp.value !== $input.val())
						data[cat][tab][i].value = $input.val();
				}
			}
		}

		$.ajax({
			type: 'POST',
			url: '/updateContent',
			data: {
				data: data
			},
			success: function(res) {
				setTimeout(function() {
					$('.load').removeClass('active');
					$('.validate').addClass('success');
				}, 2000);
			}
		});

		/*
		$(this).ajaxSubmit({
    	data: data,
    	contentType: 'application/json',
    	success: function(response){
				$('.load').removeClass('active');
				$('.validate').addClass('success');
    	}
		});*/

  	return false;
	});
});
