document.addEventListener("DOMContentLoaded", function () {
    var elems = document.querySelectorAll(".sidenav");
    M.Sidenav.init(elems, {
        edge: "left",
        preventScrolling: false,
        draggable: false,
    });
});
