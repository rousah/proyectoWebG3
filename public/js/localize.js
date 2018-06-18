var i18n = $.i18n();

$(document).ready(function() {
  applyLanguage();
});

function applyLanguage(locale_string = null) {
  if (locale_string) {
    $.i18n().locale = locale_string;
  }

  i18n.load('lang/' + i18n.locale + '.json', i18n.locale).done(() => {

    $('head').i18n();
    $('body').i18n();

    //Set correct language in dropdown button
    $('#languageMenuButton').html(getLanguageByLocale(i18n.locale));
  });
}

function getLanguageByLocale(locale_string) {

  if (locale_string === 'en') {
    return $.i18n('english');
  }
  if (locale_string === 'es') {
    return $.i18n('spanish');
  }
  if (locale_string === 'ca-es') {
    return $.i18n('catalan');
  }
  return $.i18n('english');
}

$(document).on('click', '#languageMenu a', function(event) {
  console.log('Change locale from: ' + i18n.locale);
  applyLanguage(event.target.getAttribute('value'));
  console.log('Change locale to: ' + i18n.locale);
  $('#languageMenuButton').html(getLanguageByLocale(i18n.locale));
});