var column;
var ticketTable = document.getElementById("ticketsTable");
var rows = ticketTable.getElementsByTagName("tr");
for (var i = 0; i < rows.length; i++) {
    column = rows[i].getElementsByTagName("td")[0];
    if (column) {
        if (column.innerHTML.toLowerCase().indexOf("open") > -1) {
            column.innerHTML = "o";
            column.setAttribute("style",
                "color: #89CB6D;" +
                "font-weight:200;" +
                "background-color:#89CB6D;" +
                "font-size:9px");
        } else {
            column.innerHTML = "c";
            column.setAttribute("style",
                "color: #EF3B3A;" +
                "font-weight:200;" +
                "background-color:#EF3B3A;");
        }
    }
}

function filterByTitle() {
    var input, filter, table, tr, td, i;
    input = document.getElementById("mySearch");
    filter = input.value.toUpperCase();
    table = document.getElementById("ticketsTable");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

$(document).ready(function () {
    $('.btn-filter').on('click', function () {
        var $target = $(this).data('target');
        if ($target != 'all') {
            $('#ticketsTable tbody tr').css('display', 'none');
            $('#ticketsTable tbody tr[data-status="' + $target + '"]').toggle();
        } else {
            $('#ticketsTable tbody tr').css('display', 'none').toggle();
        }
    });
});



