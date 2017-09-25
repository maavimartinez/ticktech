$(function () {

    $('#register-form').on('submit', function (e) {

        var approved = true;
        var message="";

        if (document.getElementById('name').value.length < 1) {
            message += '*Name field is required\n';
            approved = false;
        }
        if (document.getElementById('name').value.length < 1 || !validateEmail(document.getElementById('email').value)) {
            message += '*Email is not valid\n';
            approved = false;
        }
        if (document.getElementById('password').value.length < 6) {
            message += '*Password must contain at least 6 characters\n';
            approved = false;
        }
        if (document.getElementById('password').value != document.getElementById('password2').value) {
            message += '*Passwords do not match\n';
            approved = false;
        }
        if (!approved) {
            e.preventDefault();
            alert(message);
        }else{
            alert('Operation Successful');
        }
        return approved;
    });
});

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

$(function () {

    $('#login-form').on('submit', function (e) {

        var approved = true;

        if (document.getElementById('name').value.length < 1 || !validateEmail(document.getElementById('email').value)) {
            approved = false;
        }
        if (document.getElementById('password').value.length < 6) {
            approved = false;
        }
        if (!approved) {
            e.preventDefault();
            alert('Invalid email/password');
        }
        return approved;
    });
});
