$(function(){
    //add
    $('#addComment').on('click', function(e){
        e.preventDefault();

        var data = {
            body: $('#bodyComment').val(),
            post: $('.post').attr('id')
        }

        $.ajax({
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(data),
            url: '/comment/add'
        })
        .done(function (data) {
            console.log(data);
            $(location).attr('href', window.location.href);
        })
        .fail(function (data) {
            console.log(data.responseJSON);
        });;
    });

    //delete
    $('.deleteComment').on('click', function(e){
        e.preventDefault();

        var data = {
            comment: this.parentElement.parentElement.getAttribute('id')
        }

        $.ajax({
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(data),
            url: '/comment/delete'
        })
        .done(function (data) {
           $(location).attr('href', window.location.href);
        })
        .fail(function (data) {
            console.log(data.responseJSON);
        });;
    });
});