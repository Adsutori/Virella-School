// ===== NAWIGACJA =====
// odpala sie na kazdej stronie przez window.onload w kazdym pliku

function inicjalizujNav() {
    var navbar    = document.getElementById("navbar");
    var hamburger = document.getElementById("hamburger");
    var navLinks  = document.getElementById("navLinks");
    if (!navbar) return;

    // sticky navbar - dodaje klase scrolled po przewineciu 60px
    window.addEventListener("scroll", function() {
        navbar.classList[window.scrollY > 60 ? "add" : "remove"]("scrolled");
    });

    if (!hamburger || !navLinks) return;

    // toggle menu po kliknieciu hamburgera
    hamburger.addEventListener("click", function() {
        hamburger.classList.toggle("open");
        navLinks.classList.toggle("open");
    });

    // zamknij menu po kliknieciu w link
    var linki = navLinks.querySelectorAll("a");
    for (var i = 0; i < linki.length; i++) {
        linki[i].addEventListener("click", function() {
            hamburger.classList.remove("open");
            navLinks.classList.remove("open");
        });
    }

    // zamknij menu po kliknieciu poza nim
    document.addEventListener("click", function(e) {
        if (!navbar.contains(e.target)) {
            hamburger.classList.remove("open");
            navLinks.classList.remove("open");
        }
    });
}