(function () {
  'use strict';

  // The renderer injects its own component-scoped CSS. Do not load style.css here:
  // that file also contains demo-page styles (body/main/footer) and would leak into
  // the host website.
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
  wrapper.appendChild(root);

  if (script && script.parentNode) {
    script.parentNode.insertBefore(wrapper, script);
  } else {
    (document.body || document.documentElement).appendChild(wrapper);
  }

  const runtime = document.createElement('script');
  runtime.src = 'https://gsvegetable.github.io/pixel-daylight-switch/app.js';
  runtime.async = true;
  runtime.onerror = function () {
    const message = document.createElement('p');
    message.textContent = 'Pixel Daylight Switch could not load. Please check your network connection.';
    message.style.cssText = 'padding:16px;color:#9b1c1c;font:14px/1.5 system-ui,sans-serif;';
    wrapper.replaceChildren(message);
  };
  (document.body || document.documentElement).appendChild(runtime);
})();
