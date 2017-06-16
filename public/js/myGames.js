'use strict';

$(document).ready(function() {
    $.get(window.location.origin + "/api/games/user/", function(data) {
        console.log(data);
        
        if (data.status === "Success") {
            
            $.each(data.games, function(index, value) {
                let html = "<li id='game'>"
                html += "<div class='game-card'>";
                html += "<img width='100%' height='150px' class='img-resonsive' src='" + value.imageUrl + "'>";
                html += "<div class='game-card-caption'>";
                html += "<span class='game-id'>" + value.gameId + "</span>";
                html += "<span class='game-name'>" + value.title + "</span>";
                html += "</div></div>"
                html += "</li>"
                $('#games-list').append(html);
            });
        } else {
            $('#error-message').css('display', 'block');
            $('#message-text').text(data.message);
        }
    })
});