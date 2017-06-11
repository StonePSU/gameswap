'use strict';
var apiURL = window.location.origin + "/api/user";

function ajaxCall(data) {
    $.ajax({
        url: apiURL,
        type: 'PATCH',
        data: data,
        success: function(result) {
            if (result.status === "Success") {
                $("#confirmation").click();
            } else {
                alert("oops something went wrong");
            }
        }
    })    
}

$(document).ready(function() {
    $("#confirmation").modaal({
        type: 'confirm',
        confirm_title: 'Changes Saved',
        confirm_button_text: 'OK',
        confirm_content: '<p>Your changes have been saved successfully.</p>',
        confirm_cancel_button_text: ''
    });
    
    $("#location").click(function() {
        var data = {
            firstName: $("#firstName").val(),
            lastName: $("#lastName").val(),
            city: $("#city").val(),
            state: $("#state").val()
        }
        
        ajaxCall(data);
    })
    
  $.validate({
    form: "#passwordForm",
    validateOnBlur : false, // disable validation when input looses focus
    errorMessagePosition : 'top', // Instead of 'inline' which is default
    scrollToTopOnError : false, // Set this property to true on longer forms
    modules: 'security',
    onSuccess: function($form) {
        var data = {
            password: $("#password").val()
        }

        ajaxCall(data);
        return false;
    }
  });    
})