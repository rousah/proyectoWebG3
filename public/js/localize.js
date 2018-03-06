var i18n = $.i18n();

//i18n.locale = 'en';
i18n.load('lang/' + i18n.locale + '.json', i18n.locale).done(
    function() {
    	$('head').i18n();
        $('body').i18n();
    });