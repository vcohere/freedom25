$(document).ready(function() {
	$('h2').on('click', function() {
		$(this).next('.collapsable').toggleClass('active');
		$(this).toggleClass('active');
	});

	$('.validate').on('click', function(e) {
		$(this).closest('form').submit();
	});

	$('.form').on('submit', function(e) {
		e.preventDefault();

		var data = {
			path: $(this).attr('data-path'),
			key: $(this).attr('data-key')
		};

		var $validate = $(this).find('.validate');

		$validate.addClass('progress');

		$(this).ajaxSubmit({
			data: data,
			contentType: 'application/json',
			success: function(res) {
				setTimeout(function() {
					$validate.removeClass('progress').addClass('success');
				}, 1000);
			},
			error: function() {
				$validate.removeClass('progress').addClass('error');
			}
		});

		return false;
	})

	$('#validate').on('click', function(e) {
		e.preventDefault();

		var $validate = $(this);

		$validate.addClass('progress');

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
					$validate.removeClass('progress').addClass('success');
				}, 2000);
			}
		});

  	return false;
	});

	$('#sidebar .element').on('click', function() {
		if ($(this).parent('.collapsable').length === 0) {
			$('#sidebar .element').removeClass('active');
			$(this).addClass('active');

			if ($(this).hasClass('collapser')) {
				$(this).toggleClass('open');
				$(this).next('.collapsable').toggleClass('open');
			}
			else {
				$('#sidebar .collapsable').removeClass('open');
				$('#sidebar .collapser').removeClass('open');
			}
		}

		var i = $(this).index('.element');
		$('#body .view').removeClass('active');
		$('#body .view').eq(i).addClass('active');
	});

	$('#body .view').eq(0).addClass('active');
});
