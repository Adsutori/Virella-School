// ===== START =====
window.onload = function() {
    inicjalizujNav(); // z script.js
    sprawdzGodzinyOtwarcia();
    setInterval(sprawdzGodzinyOtwarcia, 60000); // odswiezaj co minute
};


// ===== GODZINY OTWARCIA =====

function sprawdzGodzinyOtwarcia() {
    var t = new Date();
    var d = t.getDay();     // 0=niedziela, 1=poniedzialek, ..., 6=sobota
    var h = t.getHours();
    var m = t.getMinutes();

    // godziny otwarcia: [od, do] lub null = zamkniete
    var godz = {
        0: null, 1:[8,20], 2:[8,20], 3:[8,20], 4:[8,20], 5:[8,20], 6:[9,15]
    };

    var banner = document.getElementById("openStatusBanner");
    if (!banner) return;

    // formatujemy czas np. "08:05"
    var hStr = (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;
    var timeEl = document.getElementById("statusTime");
    if (timeEl) timeEl.textContent = hStr;

    var g       = godz[d];
    var otwarte = g && (h + m / 60) >= g[0] && (h + m / 60) < g[1];

    var icon  = document.getElementById("statusIcon");
    var title = document.getElementById("statusTitle");
    var desc  = document.getElementById("statusDesc");

    if (otwarte) {
        icon.className    = "status-icon status-open";
        icon.innerHTML    = '<i class="fas fa-door-open"></i>';
        title.textContent = "Teraz otwarte";
        desc.textContent  = "Zapraszamy! Zamykamy o " + g[1] + ":00";
        banner.style.borderLeftColor = "#16a34a";
    } else {
        icon.className    = "status-icon status-closed";
        icon.innerHTML    = '<i class="fas fa-door-closed"></i>';
        // rozne komunikaty: niedziela / przed otwarciem / po zamknieciu
        title.textContent = !g ? "Dzisiaj zamkniete" : (h < g[0] ? "Jeszcze zamkniete" : "Juz zamkniete");
        desc.textContent  = !g ? "Niedziela - dzien wolny." : (h < g[0] ? "Otwarcie o " + g[0] + ":00" : "Otwarcie jutro o 8:00");
        banner.style.borderLeftColor = "#dc2626";
    }
}