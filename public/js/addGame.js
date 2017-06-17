'use strict';

$(document).ready(function() {
    
    $("button").click(function() {
        // reset search page
        $("#games-list").html("");
        $('#error-message').css('display', 'none');
        
        if ($("#gameTitle").val() === null || $("#gameTitle").val() === "") {
            $('#error-message').css('display', 'block');
            $('#message-text').text("You must enter a game title to start your search");
            return;
        }
        $.get(window.location.origin + "/api/games/" + $("#gameTitle").val(), function(data) {
            if (data.status === "Success") {
                $.each(data.games, function(index, value) {
                    var coverImage = null;
                    if (value.cover) {
                        coverImage = value.cover.url;
                    }
                    var card = new GameCard(value.id, value.name, coverImage, "Add<br />" )
                    $("#games-list").append(card.buildCardHtml());
                });
            } else {
                $('#error-message').css('display', 'block');
                $('#message-text').text(data.message);
            }
            
            $(".game-back").click(function() {
                
                var gp = $(this).parent().parent();
                var imageUrl = gp.data("gameswapImageurl");
                var igdbId = gp.data("gameswapid")
                var name = gp.data("gameswaptitle")
                var summary = '';
                
                $.post(window.location.origin + "/api/games", {
                    name: name,
                    igdbId: igdbId,
                    imageUrl: imageUrl,
                    summary: summary
                }, function(results) {
                    $("#pop-message").click();
                })
                
            })
        })
    })
    
    $("#pop-message").modaal({
        type: 'confirm',
        confirm_title: 'Game Saved',
        confirm_button_text: 'OK',
        confirm_content: '<p>Game has been added to your library.</p>',
        confirm_cancel_button_text: ''
    });
});