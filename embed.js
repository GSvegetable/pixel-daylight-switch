(function () {
  'use strict';

  // The renderer injects component-scoped CSS. Loading the repository's full-page demo
  // stylesheet here would leak body/main/footer rules into the host website.
  const script = document.currentScript;
  const wrapper = document.createElement('div');
  wrapper.className = 'pds-embed';
  wrapper.style.cssText = [
    'display:block',
    'position:relative',
    'box-sizing:border-box',
    'width:min(100%, 800px)',
    'aspect-ratio:1.6439',
    'margin:20px auto',
    'overflow:hidden',
    'border-radius:16px',
    'background:#f5ecd9'
  ].join(';');

  const root = document.createElement('div');
  root.setAttribute('data-ld-part', 'toggle-daylight');
  root.style.cssText = 'width:100%;height:100%;';

  // Optional data-* attributes on the embed script configure the generated instance.
  const config = [
    'data-label', 'data-speed', 'data-refraction', 'data-bezel',
    'data-start-night', 'data-friction', 'data-bounce', 'data-dispersion',
    'data-shine', 'data-time-speed', 'data-weather', 'data-scene'
  ];
  if (script) {
    for (const name of config) {
      if (script.hasAttribute(name)) root.setAttribute(name, script.getAttribute(name));
    }
  }
  wrapper.appendChild(root);

  const insertAndLoad = function () {
    // A script placed in <head> must not insert visual markup into <head>.
    if (script && script.parentNode && script.parentNode !== document.head) {
      script.parentNode.insertBefore(wrapper, script);
    } else {
      (document.body || document.documentElement).appendChild(wrapper);
    }

    const loadRuntime = function () {
      const runtime = document.createElement('script');
      runtime.src = 'https://gsvegetable.github.io/pixel-daylight-switch/app.js';
      runtime.async = true;
      runtime.onerror = showLoadError;
      (document.body || document.documentElement).appendChild(runtime);
    };
    const showLoadError = function () {
      const message = document.createElement('p');
      message.textContent = 'Pixel Daylight Switch could not load. Please check your network connection.';
      message.style.cssText = 'padding:16px;color:#9b1c1c;font:14px/1.5 system-ui,sans-serif;';
      wrapper.replaceChildren(message);
    };
    const plugins = document.createElement('script');
    plugins.src = 'https://gsvegetable.github.io/pixel-daylight-switch/scene-plugin.js';
    plugins.async = true;
    plugins.onload = loadRuntime;
    plugins.onerror = showLoadError;
    (document.body || document.documentElement).appendChild(plugins);
  };

  if (document.body) insertAndLoad();
  else document.addEventListener('DOMContentLoaded', insertAndLoad, { once: true });
})();
