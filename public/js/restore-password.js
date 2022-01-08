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
    }
    if (newPassword !== confirmPassword) {
      $('#error').html('Mật khẩu nhập lại không khớp');
    }
    let params = new URL(document.location).searchParams;
    let _id = params.get('_id');
    let _token = params.get('token');

    updatePassword(_id, _token, newPassword);
  });
});

function updatePassword(_id, token, password) {
  fetch('/auth/update-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      _id,
      token,
      password,
    }),
  })
    .then((res) => {
      $('#success').html('Cập nhật mật khẩu thành công');
      $('#submit').remove();
      $('#form-inputs').remove();
      $('a').removeClass('d-none');
    })
    .catch((err) => {
      console.log(err);

      $('#error').html('Cập nhật thất bại, mật khẩu không phù hợp');
      $('#success').html('');
    });
}
