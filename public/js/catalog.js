'use strict';

function escapeString(string) {
    var string2 = string.replace("'", "\\'");
    return string2;
}


$(document).ready(function() {
    $.get(window.location.origin + "/api/games", function(data) {
        console.log(data);
        
        if (data.status === "Success") {
            
            $.each(data.games, function(index, value) {
                var coverImage = "";
                let html = '<li class="game" data-gameswapId="' + value.gameId + '" data-gameswapTitle="' + escapeString(value.title) + '">';
                html += "<div class='game-card'>";
                html += "<div class='game-front'>";
                html +="<img width='99%' height='150px' class='img-responsive' src='" + value.imageUrl + "'>";
                html += "<div class='game-card-caption'>";
                html += "<span class='game-id'>" + value.gameId + "</span>";
                html += "<span class='game-name'>" + value.title + "</span>";
                html += "</div>";
                html += "</div>";
                html += "<div class='game-back'>";
                //html += "<a href='#' class='game-cover'>";
                html += "<div class='game-card-overlay'>Request<br />Trade for<br />" + value.title + "</div>";
                // html += "</a>";
                html += "</div>";
                html += "</div>";
                html += "</li>";

                $('#games-list').append(html);
                
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