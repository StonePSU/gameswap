'use strict';

$(document).ready(function() {
    $.get(window.location.origin + "/api/games", function(data) {
        console.log(data);
        
        if (data.status === "Success") {
            
            $.each(data.games, function(index, value) {
                var card = new GameCard(value.gameId, value.title, value.imageUrl, "Request<br />Trade for<br />" );
                $('#games-list').append(card.buildCardHtml());
                
            });
        } else {
            console.log("no games were found")
            $('#error-message').css('display', 'block');
            $('#message-text').text(data.message);
        }
        
        $(".game-back").click(function() {
            var gameId = $(this).parent().parent().data("gameswapid");
            var name = $(this).parent().parent().data("gameswaptitle");

            $.post(window.location.origin + "/api/trades", {
                name: name,
                gameId: gameId
            }, function(results) {
                console.log(results);
                if (results.status === "Error") {
                    $("#error-message").click();
                } else {
                    $("#pop-message").click();  
                }
            
            })
        })
    })
    
    $("#pop-message").modaal({
        type: 'confirm',
        confirm_title: "Trade Confirmation",
        confirm_button_text: 'OK',
        confirm_content: '<p>Your trade request has been saved!</p>',
        confirm_cancel_button_text: ''
    });
    
    $("#error-message").modaal({
        type: 'confirm',
        confirm_title: "Oops!",
        confirm_button_text: 'OK',
        confirm_content: '<p>This game is already in your library.  You cannot request a trade for games that you already own.</p>',
        confirm_cancel_button_text: ''
    });

});