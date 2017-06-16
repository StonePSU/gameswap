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
            console.log(data.games);
            
            if (data.status === "Success") {
                
                $.each(data.games, function(index, value) {
                    var coverImage = "";
                    if (value.cover) {
                        coverImage = value.cover.url;
                    } else {
                        coverImage = "/public/img/image-not-available.jpg";
                    }
                                
                    let html = "<li class='game' data-gameswapId='" + value.id + "' data-gameswapTitle='" + value.name + "' data-gameswap-imageurl='" + coverImage + "'>";
                    html += "<div class='game-card'>";
                    html += "<div class='game-front'>";
                    html +="<img width='99%' height='150px' class='img-responsive' src='" + coverImage + "'>";
                    html += "<div class='game-card-caption'>";
                    html += "<span class='game-id'>" + value.id + "</span>";
                    html += "<span class='game-name'>" + value.name + "</span>";
                    html += "</div>";
                    html += "</div>";
                    html += "<div class='game-back'>";
                    //html += "<a href='#' class='game-cover'>";
                    html += "<div class='game-card-overlay'>Add<br />" + value.name + "<br />to My Games</div>";
                    // html += "</a>";
                    html += "</div>";
                    html += "</div>";
                    html += "</li>";
                    
                    /*let html = "<li id='game'>"
                    html += "<div class='game-card'>";
                    html += "<a href='#' class='game-cover'><img width='100%' height='150px' class='img-responsive' src='" + coverImage + "'>";
                    html += "<div class='game-card-overlay'>Add<br />" + value.name + "</div></a>";
                    html += "<div class='game-card-caption'>";
                    html += "<span class='game-id'>" + value.id + "</span>";
                    html += "<span class='game-name'>" + value.name + "</span>";
                    html += "</div></div>"
                    html += "</li>"*/
                    $('#games-list').append(html);
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