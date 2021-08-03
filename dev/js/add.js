$(function () {
    //addPost
    $('#sendPost').on('click', function(e){
        e.preventDefault();

        var data = {
            title: $('#titlePost').val(),
            body : $('#bodyPost').val()
        }

        $.ajax({
            method: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/posts/create'
        })
        .done(function (data) {
            console.log(data);
            $(location).attr('href', '/posts');
        })
        .fail(function (data) {
            console.log(data.responseJSON);
        });
    });

    //deletePost
    $('.deletePost').on('click', function(e){
        e.preventDefault();
        
        var data = {
            post: this.parentElement.parentElement.getAttribute('id')
        }

        $.ajax({
            method: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/posts/delete'
        })
        .done(function (data) {
            console.log(data);
            $(location).attr('href', window.location.href);
        })
        .fail(function (data) {
            console.log(data.responseJSON);
        });;
    });
});
