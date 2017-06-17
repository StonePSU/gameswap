'use strict';

$(document).ready(function() {
    $.get(window.location.origin + "/api/games/user/", function(data) {
        console.log(data);
        
        if (data.status === "Success") {
            
            $.each(data.games, function(index, value) {
                var card = new GameCard(value.gameId, value.title, value.imageUrl);
                $('#games-list').append(card.buildCardHtml());
            });
        } else {
            $('#error-message').css('display', 'block');
            $('#message-text').text(data.message);
        }
    })
});