$(document).ready(function () {
    $('#submit').on('click', function (e) {
        e.preventDefault();
        const phone = $('#phone').val();
        console.log(phone);
        $('#error').html('');
        $('#success').html('');
        if (!phone) {
            $('#error').html('Bạn phải nhập đầy đủ trước khi gửi');
            return;
        }
        if (phone.length < 10)
            $('#error').html('Số điện thoại không hợp lệ');
      
//====================|Add function to send request here |=============
    });
});


