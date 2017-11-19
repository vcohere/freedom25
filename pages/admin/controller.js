$(document).ready(function() {
	$('h2').on('click', function() {
		$(this).next('.collapsable').toggleClass('active');
		$(this).toggleClass('active');
	});

	$('.form').on('submit', function(e) {
		e.preventDefault();

		var data = {
			path: $(this).attr('data-path'),
			key: $(this).attr('data-key')
		};

		var $load = $(this).find('.load'),
				$validate = $(this).find('input[type="submit"]');

		$load.addClass('active');

		$(this).ajaxSubmit({
			data: data,
			contentType: 'application/json',
			success: function(res) {
				setTimeout(function() {
					$load.removeClass('active');
					$validate.addClass('success');
				}, 1000);
			}
		});

		return false;
	})

	$('#validate').on('click', function(e) {
		e.preventDefault();

		$('.load').addClass('active');

		var data = old;

		for (var cat in data) {
			for (var tab in data[cat]) {
				for (var i = 0; i < data[cat][tab].length; i++) {
					let tmp = data[cat][tab][i];

					if (tmp.type === 'file')
						continue;
					if (tmp.type === 'radio')
						var $input = $('[data-id="' + cat + tab + tmp.name + '"]:checked');
					else
						var $input = $('[data-id="' + cat + tab + tmp.name + '"]');

					if (tmp.value !== $input.val() && $input.val() && $input.val().length > 0)
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

  	return false;
	});
});
