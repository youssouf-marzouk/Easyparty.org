document.addEventListener("DOMContentLoaded", function () {
    var root = document.documentElement;
    var nav = document.querySelector(".site-nav");
    var reveals = document.querySelectorAll(".reveal");
    var yearNodes = document.querySelectorAll("[data-current-year]");
    var collapseElement = document.querySelector(".navbar-collapse");
    var navLinks = document.querySelectorAll(".navbar-collapse .nav-link");
    var themeToggle = document.querySelector("[data-theme-toggle]");
    var themeToggleLabel = themeToggle ? themeToggle.querySelector("[data-theme-label]") : null;
    var themeStorageKey = "easyparty-theme";
    var systemThemeQuery = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
    var collapseInstance = null;

    function getStoredTheme() {
        try {
            return localStorage.getItem(themeStorageKey);
        } catch (error) {
            return null;
        }
    }

    function getPreferredTheme() {
        var storedTheme = getStoredTheme();

        if (storedTheme === "light" || storedTheme === "dark") {
            return storedTheme;
        }

        return systemThemeQuery && systemThemeQuery.matches ? "dark" : "light";
    }

    function applyTheme(theme) {
        root.setAttribute("data-theme", theme);
        root.setAttribute("data-bs-theme", theme);
    }

    function syncThemeToggle(theme) {
        if (!themeToggle) {
            return;
        }

        var nextThemeLabel = theme === "dark" ? "Light mode" : "Dark mode";

        themeToggle.setAttribute("aria-label", "Switch to " + nextThemeLabel.toLowerCase());
        themeToggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");

        if (themeToggleLabel) {
            themeToggleLabel.textContent = nextThemeLabel;
        }
    }

    applyTheme(getPreferredTheme());
    syncThemeToggle(root.getAttribute("data-theme") || "light");

    function syncNavState() {
        if (!nav) {
            return;
        }

        if (window.scrollY > 16) {
            nav.classList.add("scrolled");
        } else {
            nav.classList.remove("scrolled");
        }
    }

    function showRevealIfInView(item) {
        var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        var rect = item.getBoundingClientRect();
        var visibleTop = Math.max(rect.top, 0);
        var visibleBottom = Math.min(rect.bottom, viewportHeight);
        var visibleHeight = visibleBottom - visibleTop;

        if (visibleHeight <= 0) {
            return false;
        }

        var visibleRatio = visibleHeight / Math.max(rect.height, 1);

        if (visibleRatio >= 0.08 || rect.height > viewportHeight) {
            item.classList.add("is-visible");
            return true;
        }

        return false;
    }

    function syncVisibleReveals(observer) {
        reveals.forEach(function (item) {
            if (item.classList.contains("is-visible")) {
                if (observer) {
                    observer.unobserve(item);
                }

                return;
            }

            if (showRevealIfInView(item) && observer) {
                observer.unobserve(item);
            }
        });
    }

    yearNodes.forEach(function (node) {
        node.textContent = String(new Date().getFullYear());
    });

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            var nextTheme = (root.getAttribute("data-theme") || "light") === "dark" ? "light" : "dark";

            applyTheme(nextTheme);
            syncThemeToggle(nextTheme);

            try {
                localStorage.setItem(themeStorageKey, nextTheme);
            } catch (error) {
                // Ignore storage failures and still let the in-memory theme change work.
            }
        });
    }

    if (systemThemeQuery) {
        var syncSystemTheme = function (event) {
            var storedTheme = getStoredTheme();

            if (storedTheme === "light" || storedTheme === "dark") {
                return;
            }

            var nextTheme = event.matches ? "dark" : "light";
            applyTheme(nextTheme);
            syncThemeToggle(nextTheme);
        };

        if (typeof systemThemeQuery.addEventListener === "function") {
            systemThemeQuery.addEventListener("change", syncSystemTheme);
        } else if (typeof systemThemeQuery.addListener === "function") {
            systemThemeQuery.addListener(syncSystemTheme);
        }
    }

    syncNavState();
    window.addEventListener("scroll", syncNavState, { passive: true });

    if (window.bootstrap && collapseElement) {
        collapseInstance = bootstrap.Collapse.getOrCreateInstance(collapseElement, { toggle: false });

        navLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                if (window.innerWidth < 992 && collapseElement.classList.contains("show")) {
                    collapseInstance.hide();
                }
            });
        });
    }

    if ("IntersectionObserver" in window && reveals.length) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: "0px 0px -8% 0px"
        });

        reveals.forEach(function (item) {
            if (!showRevealIfInView(item)) {
                observer.observe(item);
            }
        });

        requestAnimationFrame(function () {
            syncVisibleReveals(observer);
        });

        window.addEventListener("load", function () {
            syncVisibleReveals(observer);
        }, { once: true });

        window.addEventListener("resize", function () {
            syncVisibleReveals(observer);
        }, { passive: true });
    } else {
        reveals.forEach(function (item) {
            item.classList.add("is-visible");
        });
    }

    if (window.baguetteBox && document.querySelector("[data-bss-baguettebox]")) {
        window.baguetteBox.run("[data-bss-baguettebox]", {
            animation: "slideIn"
        });
    }
});
