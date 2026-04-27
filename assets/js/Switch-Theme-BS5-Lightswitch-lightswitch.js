    /**
 *  Light Switch @version v0.1.4
 */

(function () {
  let lightSwitch = document.getElementById('lightSwitch');
  if (!lightSwitch) {
    return;
  }

  function darkMode() {
  let lightIcon = document.getElementById('lightswitchLightIcon');
  if (!lightIcon) return;
  lightIcon.style.display = "none";

  let darkIcon = document.getElementById('lightswitchDarkIcon');
  if (!darkIcon) return;
  darkIcon.style.display = "initial";

  document.querySelectorAll('[data-bs-theme="light"]').forEach((element) => {
    element.setAttribute('data-bs-theme', 'dark');
  });

  if (!lightSwitch.checked) {
    lightSwitch.checked = true;
  }
  localStorage.setItem('lightSwitch', 'dark');
}

function lightMode() {
  let lightIcon = document.getElementById('lightswitchLightIcon');
  if (!lightIcon) return;
  lightIcon.style.display = "initial";

  let darkIcon = document.getElementById('lightswitchDarkIcon');
  if (!darkIcon) return;
  darkIcon.style.display = "none";

  document.querySelectorAll('[data-bs-theme="dark"]').forEach((element) => {
    element.setAttribute('data-bs-theme', 'light');
  });

  if (lightSwitch.checked) {
    lightSwitch.checked = false;
  }
  localStorage.setItem('lightSwitch', 'light');
}


  /**
   * @function onToggleMode
   * @summary: the event handler attached to the switch. calling @darkMode or @lightMode depending on the checked state.
   */
  function onToggleMode() {
    if (lightSwitch.checked) {
      darkMode();
    } else {
      lightMode();
    }
  }

  /**
   * @function getSystemDefaultTheme
   * @summary: get system default theme by media query
   */
  function getSystemDefaultTheme() {
    const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
    if (darkThemeMq.matches) {
      return 'dark';
    }
    return 'light';
  }

  function setup() {
    var settings = localStorage.getItem('lightSwitch');
    if (settings == null) {
      settings = getSystemDefaultTheme();
    }

    if (settings == 'dark') {
      lightSwitch.checked = true;
    }

    lightSwitch.addEventListener('change', onToggleMode);
    onToggleMode();
  }

  setup();
})();

