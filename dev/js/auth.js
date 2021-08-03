$(function () {
    //login
    $("form #loginSend").on("click", function (e) {
        e.preventDefault();

        var data = {
            login: $("#loginLogin").val(),
            password: $("#loginPassword").val(),
        };

        $.ajax({
            method: "POST",
            data: JSON.stringify(data),
            contentType: "application/json",
            url: "/api/auth/login",
        })
            .done(function (data) {
                console.log(data);
                $(location).attr('href', window.location.href);
            })
            .fail(function (data) {
                clear();
                data.responseJSON.fields.forEach(function (item) {
                    $('#' + item).addClass('error');
                });
                $(".formLogin h2").after('<p class="error">' + data.responseJSON.error + '</p>')
                console.log(data.responseJSON);
            });
    });

    //registration
    $("form #registrationSend").on("click", function (e) {
        e.preventDefault();

        var data = {
            login: $("#registrationLogin").val(),
            password: $("#registrationPassword").val(),
            confirmPassword: $("#registrationConfirmPassword").val(),
        };

        $.ajax({
            method: "POST",
            data: JSON.stringify(data),
            contentType: "application/json",
            url: "/api/auth/registration",
        })
            .done(function (data) {
                console.log(data);
                $(location).attr('href', window.location.href);
            })
            .fail(function (data) {
                clear();
                data.responseJSON.fields.forEach(function (item) {
                    $('#' + item).addClass('error');
                });
                $(".formRegistration h2").after('<p class="error">' + data.responseJSON.error + '</p>')
                console.log(data.responseJSON);
            });
    });

    //logout
    $('#logout').on('click', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'GET',
            url: '/api/auth/logout'
        })
            .done(function (data) {
                console.log(data);
                $(location).attr('href', window.location.href);
            })
            .fail(function (data) {
                console.log(data.responseJSON);
            });;
    });

    $("#toLogin").on("click", function (e) {
        e.preventDefault();
        clear();
        $('input').val('');
        $(".formRegistration").hide();
        $(".formLogin").show("slow");
    });

    $("#toRegistration").on("click", function (e) {
        e.preventDefault();
        clear();
        $('input').val('');
        $(".formRegistration").show("slow");
        $(".formLogin").hide();
    });

    $('input').on('focus', clear);

    function clear() {
        if ($('.formLogin').has('p'))
            $('.formLogin p').remove();
        if ($('.formRegistration').has('p'))
            $('.formRegistration p').remove();
        $('input').removeClass('error');
    }
});
