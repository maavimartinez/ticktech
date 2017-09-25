$(function () {

    $('#ticket-form').on('submit', function (e) {

        var approved = true;
        var message="";

        if (document.getElementById('ticket-title').value.length < 1) {
            message += '*Title field is required\n';
            approved = false;
        }
        if (document.getElementById('ticket-status').value == '') {
            message += '*Status field is required\n';
            approved = false;
        }
        if (document.getElementById('ticket-assignee').value == '') {
            message += '*Assignee field is required\n';
            approved = false;
        }
        if (document.getElementById('ticket-body').value.length < 1 ) {
            message += '*Description field is required';
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
