$(document).ready(function () {
  $('#submit').on('click', function (e) {
    e.preventDefault();
    const newPassword = $('#password').val();
    const confirmPassword = $('#confirm-password').val();
    console.log(newPassword, confirmPassword);
    $('#error').html('');
    $('#success').html('');
    if (!newPassword || !confirmPassword) {
      $('#error').html('Bạn phải nhập đầy đủ trước khi cập nhật');
      return;
    }
    if (newPassword !== confirmPassword) {
      $('#error').html('Mật khẩu nhập lại không khớp');
      return;
    }
    let params = new URL(document.location).searchParams;
    let user_id = params.get('user_id');
    let _token = params.get('token');

    updatePassword(user_id, _token, newPassword);
  });
});

function updatePassword(user_id, token, password) {
  fetch('/be/v1/auth/update-password-by-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: +user_id,
      token,
      password,
    }),
  })
    .then((res) => {
      console.log(res);
      if (res.status !== 200) {
        $('#error').html('Cập nhật thất bại, mật khẩu không phù hợp');
        $('#success').html('');
        return;
      }

      $('#success').html('Cập nhật mật khẩu thành công');
      $('#submit').remove();
      $('#form-inputs').remove();
      $('a').removeClass('d-none');
    })
    .catch((err) => {
      console.log(err);
    });
}
