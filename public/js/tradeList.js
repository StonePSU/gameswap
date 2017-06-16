'use strict'

var apiBaseURL = "/api/trades/";

function getDate(strDateIn) {
    var dateOut;
    var str = strDateIn.substring(0, 10);

    var arrStr = str.split("-");
    return arrStr[1] + "/" + arrStr[2] + "/" + arrStr[0];
}

function escapeString(string) {
    var string2 = string.replace("'", "\\'");
    return string2;
}

$(document).ready(function() {
    /* load the My Trades section */
    $.get(apiBaseURL + "requestor", function(results) {
       
       if (results.status === "Error") {
       $("#error-message").css("display", "block");
       $("#message-text").text(results.message);
       } else {
       
       var html = "";
       $.each(results.trades, function(index, val) {
           html += "<li data-gameswap-title='" + val.title + "' data-gameswap-tradeid='" + val.tradeId + "'>";
           html += "<strong>Game Title:</strong>&nbsp;&nbsp;" + escapeString(val.title);
           html += "<br><strong>Trade Status:&nbsp;&nbsp;</strong>" + val.tradeStatus;
           html += "<br><strong>Date Created:&nbsp&nbsp;</strong>" + getDate(val.dateRequested);
           if (val.tradeStatus === "Pending") {
            html += "<div class='trade-buttons'><i class='fa fa-minus-circle fa-2x delete-trade' /></div>"
           }
           html += "</li>";
       })
       
       $("#my-trade-list").append(html);
       
       $(".delete-trade").click(function() {
           var tradeId = $(this).parent().parent().data("gameswapTradeid");
           var parent = $(this).parent().parent();
           $.ajax({
               url: window.location.origin + "/api/trades/" + tradeId,
               type: "DELETE",
               success: function(results) {
                   parent.remove();
               }
           })
           
       })
       }
    });
    
    /* load the Incoming Trades section */
    $.get(apiBaseURL + "owner", function(results) {
        if (results.status === "Error") {
            $("#error-message2").css("display", "block");
            $("#message-text2").text(results.message);
        } else {
            
           var html = "";
           
           $.each(results.trades, function(index, val) {
                html += "<li data-gameswap-title='" + val.title + "' data-gameswap-tradeid='" + val.tradeId + "'>";
                html += "<strong>Game Title:</strong>&nbsp;&nbsp;" + escapeString(val.title);
                html += "<br><strong>Trade Status:&nbsp;&nbsp;</strong>" + val.tradeStatus;
                html += "<br><strong>Date Created:&nbsp&nbsp;</strong>" + getDate(val.dateRequested);
                if (val.tradeStatus ==="Pending") {
                    html += "<div class='trade-buttons'><i class='fa fa-check fa-2x approve-btn' /><i class='fa fa-times fa-2x reject-btn' /></div>";
                }
           })
           
           $("#incoming-trade-list").append(html);
           
           $(".reject-btn").click(function() {
               var li = $(this).parent().parent();
               let tradeId = li.data("gameswapTradeid")
               
               $.ajax({
                   url: window.location.origin + "/api/trades/" + tradeId,
                   type: "PUT",
                   success: function(results) {
                       console.log(results);
                   }
                })
            })
            
            $(".approve-btn").click(function() {
               var li = $(this).parent().parent();
               let tradeId = li.data("gameswapTradeid")
               
               $.ajax({
                   url: window.location.origin + "/api/trades/" + tradeId,
                   type: "PATCH",
                   success: function(results) {
                       console.log(results);
                   }
                })
            })
        }
    })
    
})