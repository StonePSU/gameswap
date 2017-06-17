'use strict';

function escapeString(string) {
    var string2 = string.replace("'", "\\'");
    return string2;
}

function getDate(strDateIn) {
    var dateOut;
    var str = strDateIn.substring(0, 10);

    var arrStr = str.split("-");
    return arrStr[1] + "/" + arrStr[2] + "/" + arrStr[0];
}

function GameCard(gameSwapId, name, imageUrl, overLayHtml) {
    this.id = gameSwapId;
    this.name = name;
    this.coverUrl = imageUrl || "/public/img/image-not-available.jpg";
    this.overLay = overLayHtml;
    this.gameClass = "";
    
    this.buildCardHtml = function() {
        this.setCardType();
        
        let html = '<li class="' + this.gameClass + '" data-gameswapId="' + this.id + '" data-gameswapTitle="' + escapeString(this.name) + '" data-gameswap-imageurl="' + this.coverUrl + '">';
        html += "<div class='game-card'>";
        html += "<div class='game-front'>";
        html +="<img width='99%' height='150px' class='img-responsive' src='" + this.coverUrl + "'>";
        html += "<div class='game-card-caption'>";
        html += "<span class='game-name'>" + this.name + "</span>";
        html += "</div>";
        html += "</div>";
        if (this.overLay) {
            html += this.buildCardBack();
        }
        html += "</div>";
        html += "</li>";
        
        return html;
    }
    
    this.buildCardBack = function() {
        var html = "<div class='game-back'>";
        html += "<div class='game-card-overlay'>" + this.overLay + this.name + "</div>";
        html += "</div>";
        
        return html;
    }
    
    this.setCardType = function() {
        if (this.overLay) {
            this.gameClass = "game";
        } else {
            this.gameClass = "game-no-overlay"
        }
    }
}