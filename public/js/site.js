/* ============================================================
   PuraPaw — site.js
   Header scroll, mobile menu, reveal-on-scroll, stat counters,
   smooth anchor behaviour.
   ============================================================ */
(function () {
    "use strict";

    function ready(fn) {
        if (document.readyState !== "loading") fn();
        else document.addEventListener("DOMContentLoaded", fn);
    }

    ready(function () {
        var header = document.getElementById("header");
        var toTop = document.getElementById("toTop");

        window.addEventListener("scroll", function () {
            var y = window.scrollY || window.pageYOffset;
            if (header) header.classList.toggle("scrolled", y > 20);
            if (toTop) toTop.classList.toggle("show", y > 500);
        });

        if (toTop) {
            toTop.addEventListener("click", function () {
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        }

        // Mobile menu
        var hamburger = document.getElementById("hamburger");
        var navLinks = document.getElementById("navLinks");
        if (hamburger && navLinks) {
            hamburger.addEventListener("click", function () {
                navLinks.classList.toggle("open");
                var icon = hamburger.querySelector("i");
                if (icon) {
                    icon.className = navLinks.classList.contains("open")
                        ? "fa-solid fa-xmark"
                        : "fa-solid fa-bars";
                }
            });
            var links = navLinks.querySelectorAll("a");
            for (var i = 0; i < links.length; i++) {
                links[i].addEventListener("click", function () {
                    navLinks.classList.remove("open");
                    var icon = hamburger.querySelector("i");
                    if (icon) icon.className = "fa-solid fa-bars";
                });
            }
        }

        // Reveal on scroll
        var revealEls = document.querySelectorAll(".reveal");
        if ("IntersectionObserver" in window && revealEls.length) {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (e) {
                    if (e.isIntersecting) {
                        e.target.classList.add("in");
                        io.unobserve(e.target);
                    }
                });
            }, { threshold: 0.12 });
            revealEls.forEach(function (el) { io.observe(el); });
        } else {
            // Fallback: just show everything
            revealEls.forEach(function (el) { el.classList.add("in"); });
        }

        // Counter animation for hero stats
        var counters = document.querySelectorAll(".hstat .num");
        var counted = false;

        function animateCount(el) {
            var target = parseInt(el.getAttribute("data-count"), 10) || 0;
            var duration = 1600;
            var start = performance.now();

            function step(now) {
                var p = Math.min((now - start) / duration, 1);
                el.textContent = Math.floor(p * target).toString();
                if (p < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        }

        if (counters.length && "IntersectionObserver" in window) {
            var heroIO = new IntersectionObserver(function (entries) {
                entries.forEach(function (e) {
                    if (e.isIntersecting && !counted) {
                        counters.forEach(animateCount);
                        counted = true;
                        heroIO.disconnect();
                    }
                });
            }, { threshold: 0.3 });
            heroIO.observe(counters[0]);
        } else {
            counters.forEach(function (el) {
                el.textContent = el.getAttribute("data-count");
            });
        }
    });
})();
