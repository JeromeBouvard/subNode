var isLoading = false;
$(document).ready(function() {
	$("[rel=tooltip]").tooltip();

	$("#settings").click(function (e) {
		e.preventDefault();
		$('#charms').charms('showSection', 'theme-charms-section');
	});
});

function toggleLoading(e, active) {
	isLoading = active;
	if(!isLoading) {
		$(e).siblings('.loader').addClass('hidden');
	} else {
		$(e).siblings('.loader').removeClass('hidden');
	}
}

function getSubs(e, episode) {
	var $target = $(e.currentTarget);
	if(!isLoading && ($target.hasClass('label-success') || $target.hasClass('label-important'))) {
		$target = $target.siblings('.subtitles');
		if(!$target.hasClass('active') && $target.html() == '') {
			toggleLoading($target, true);
			now.ready(function() {
				now.getSubs($('#showName').text(), episode, function(subtitles, providerName) {
					var text = '';
						for(var i in subtitles) {
							text = text + '<div class="tile wide text"><div class="column3-info tile wide text qualite'+subtitles[i].quality+'">Source: '+subtitles[i].source+'</div><div class="text-header">' + subtitles[i].file + '</div>';
							for(var j in subtitles[i].content) {
								if(subtitles[i].content[j].type == 'subtitle') {
									text = text + '<div><span rel="tooltip" data-placement="right" title="Compatibility score: ' + subtitles[i].content[j].score + '">[' + subtitles[i].content[j].score + ']</span> <a onClick=\'download(event, "' + escape(episode) + '", "' + escape(subtitles[i].url) + '", "' + escape(subtitles[i].content[j].name) + '");\'>' + subtitles[i].content[j].name + '</a> <div class="loader hidden"></div></div>';
								}
							}
							text = text + '</div>';
						}
					if(text == '') {
						text = '<div class="tile wide text"><div class="text">No subtitles available on <b>' + providerName + '</b></div></div>';
					}
					$target.parent().find('.subtitles').append(text);
					$target.addClass('active');
					$("[rel=tooltip]").tooltip();
				}, function() {
					toggleLoading($target, false);
				});
			});
		} else {
			$target.removeClass('active');
		}
	}
}

function download(e, episode, url, subtitle) {
	var $target = $(e.currentTarget);
	if(!isLoading && !$target.hasClass('label-success')) {
		toggleLoading($target, true);
		episode = unescape(episode);
		url = unescape(url);
		subtitle = unescape(subtitle);
		now.download(episode, url, subtitle, function(success) {
			toggleLoading($target, false);
			if(success) {
				$target.addClass('label label-success').removeClass('label-important');
				$target.closest('.subtitles').siblings('span.label').addClass('label-success').removeClass('label-important');
			} else {
				$target.addClass('label label-important');
			}
		});
	}
}

function saveParams() {
	var username = $('#username').val();
	var password = $('#password').val();
	var baseFolder = $('#baseFolder').val();
	var sickbeardUrl = $('#sickbeardUrl').val();
	var sickbeardApiKey = $('#sickbeardApiKey').val();
	var autorename = $('#autorename').is(':checked');
	if(baseFolder != '' || (sickbeardUrl != '' && sickbeardApiKey != ''))   {
		now.saveParams({
			username: password == '' ? '' : username,
			password: username == '' ? '' : password,
			baseFolder: baseFolder,
			sickbeardUrl: sickbeardUrl,
			sickbeardApiKey: sickbeardApiKey,
			autorename: autorename
		});
		return true;
	} else {
		return false;
	}
}