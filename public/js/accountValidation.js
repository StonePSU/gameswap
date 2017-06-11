  $.validate({
    validateOnBlur : false, // disable validation when input looses focus
    errorMessagePosition : 'top', // Instead of 'inline' which is default
    scrollToTopOnError : false, // Set this property to true on longer forms
    modules: 'security'
  });