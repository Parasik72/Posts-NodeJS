$(function(){
    $('.posts').css('max-height', window.screen.height / 2);
    $(window).resize(function(){
        $('.posts').css('max-height', window.screen.height / 2);
    })
});