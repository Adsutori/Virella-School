// ===== ZMIENNE GLOBALNE =====
var zdjeciaGalerii = []; // tablica ze zdjeciami do lightboxa
var aktualneZdjecie = 0; // indeks zdjecia otwartego w lightboxie


// ===== START =====
window.onload = function() {
    inicjalizujNav(); // z script.js
    inicjalizujGalerie();
};


// ===== GALERIA I LIGHTBOX =====

function inicjalizujGalerie() {
    zbierzIBindujGalerie(); // zbierz zdjecia i podepnij klikniecia
    inicjalizujFiltry();    // filtry kategorii

    // podpinamy przyciski lightboxa przez obiekt zamiast 4x if
    var mapa = {
        "lightboxOverlay": zamknijLightbox,
        "lightboxClose":   zamknijLightbox,
        "lightboxPrev":    poprzednieZdjecie,
        "lightboxNext":    nastepneZdjecie
    };
    for (var id in mapa) {
        var el = document.getElementById(id);
        if (el) el.addEventListener("click", mapa[id]);
    }
}

// zbiera zdjecia do tablicy i dodaje klikniecia - w jednej funkcji
// wywolujemy to tez po filtrowaniu zeby odswiezycz tablice
function zbierzIBindujGalerie() {
    zdjeciaGalerii = [];
    var elementy = document.querySelectorAll(".gallery-item");

    for (var i = 0; i < elementy.length; i++) {
        var img  = elementy[i].querySelector("img");
        var opis = elementy[i].querySelector(".gallery-overlay-content span");
        if (img) {
            zdjeciaGalerii.push({ src: img.src, alt: img.alt, opis: opis ? opis.textContent : img.alt });
        }
        // IIFE - zeby zmienna i miala dobra wartosc w kazdym listenerze
        elementy[i].addEventListener("click", (function(n) {
            return function() { otworzyLightbox(n); };
        })(i));
    }
}

function otworzyLightbox(n) {
    var lb = document.getElementById("lightbox");
    if (!lb || !zdjeciaGalerii.length) return;
    aktualneZdjecie = n;
    var z = zdjeciaGalerii[n];
    // ustawiamy zdjecie, podpis i licznik
    document.getElementById("lightboxImg").src             = z.src;
    document.getElementById("lightboxImg").alt             = z.alt;
    document.getElementById("lightboxCaption").textContent = z.opis;
    document.getElementById("lightboxCounter").textContent = (n + 1) + " / " + zdjeciaGalerii.length;
    lb.classList.add("open");
    document.body.style.overflow = "hidden"; // blokuj scroll w tle
}

function zamknijLightbox() {
    var lb = document.getElementById("lightbox");
    if (lb) { lb.classList.remove("open"); document.body.style.overflow = ""; }
}

function nastepneZdjecie()   { otworzyLightbox((aktualneZdjecie + 1) % zdjeciaGalerii.length); }
function poprzednieZdjecie() { otworzyLightbox((aktualneZdjecie - 1 + zdjeciaGalerii.length) % zdjeciaGalerii.length); }

function inicjalizujFiltry() {
    var przyciski = document.querySelectorAll(".filter-btn");
    for (var i = 0; i < przyciski.length; i++) {
        przyciski[i].addEventListener("click", function() {
            // usun active ze wszystkich, dodaj do kliknitego
            var all = document.querySelectorAll(".filter-btn");
            for (var j = 0; j < all.length; j++) all[j].classList.remove("active");
            this.classList.add("active");
            filtrujGalerie(this.getAttribute("data-filter"));
        });
    }
}

function filtrujGalerie(kat) {
    var elementy = document.querySelectorAll(".gallery-item");
    for (var i = 0; i < elementy.length; i++) {
        // pokaz jesli "all" albo kategoria sie zgadza
        elementy[i].style.display = (kat === "all" || elementy[i].getAttribute("data-category") === kat) ? "" : "none";
    }
    zbierzIBindujGalerie(); // odswiez tablice po filtrowaniu
}