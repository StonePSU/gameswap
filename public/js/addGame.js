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
                    let html = "<li id='game'>"
                    html += "<div class='game-card'>";
                    html += "<a href='#' class='game-cover'><img width='100%' height='150px' class='img-responsive' src='" + coverImage + "'>";
                    html += "<div class='game-card-overlay'>Add<br />" + value.name + "</div></a>";
                    html += "<div class='game-card-caption'>";
                    html += "<span class='game-id'>" + value.id + "</span>";
                    html += "<span class='game-name'>" + value.name + "</span>";
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
                var igdbId = caption.children(".game-id").text()
                var name = caption.children(".game-name").text();
                var summary = caption.children(".game-summary").text();
                
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