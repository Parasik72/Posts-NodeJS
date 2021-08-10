$(function(){
    $('#addImgBtn').on('change', function(){
        var formData = new FormData();
        formData.append('file', $('#addImgBtn')[0].files[0]);
        $.ajax({
            type: 'POST',
            data: formData,
            url: '/posts/uploadImg',
            processData: false,
            contentType: false,
            success: function(data){
                console.log(data);
                $('.uploadedImg').prepend('<img alt="img" src="/uploads'+data.filePath+'" id="'+data.fileId+'"></img>')
                if($('.uploadedImg').has('img'))
                    $('.uploadedImg').addClass('active');
                else
                    $('.uploadedImg').removeClass('active');
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});