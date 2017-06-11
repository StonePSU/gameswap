$(document).ready(function() {
    $.get(window.location.origin + "/api/games", function(data) {
        console.log(data);
        
        if (data.status === "Success") {
            
            $.each(data.games, function(index, value) {
                var coverImage = "";
                let html = "<li id='game'>"
                html += "<div class='game-card'>";
                html += "<a href='#' class='game-cover'><img width='100%' height='150px' class='img-responsive' src='" + value.imageUrl + "'>";
                html += "<div class='game-card-overlay'>Request Trade for<br />" + value.title + "</div></a>";
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
        
        $(".game-cover").click(function() {
            var caption = $(this).siblings(".game-card-caption");
                var imageUrl = $(this).children("img").attr("src");
                var gameId = caption.children(".game-id").text()
                var name = caption.children(".game-name").text();
                var summary = caption.children(".game-summary").text();
                $.post(window.location.origin + "/api/trades", {
                    name: name,
                    gameId: gameId
                }, function(results) {
                    $("#pop-message").click();
                })
        })
    })
    
    $("#pop-message").modaal({
        type: 'confirm',
        confirm_title: 'Trade Confirmed',
        confirm_button_text: 'OK',
        confirm_content: '<p>Your requested trade has been saved.</p>',
        confirm_cancel_button_text: ''
    });
});