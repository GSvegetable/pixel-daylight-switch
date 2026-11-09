(function() {
  // 1. 自动注入样式
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://gsvegetable.github.io/pixel-daylight-switch/style.css';
  document.head.appendChild(link);

  // 2. 自动生成容器
  const div = document.createElement('div');
  div.setAttribute('data-ld-part', 'toggle-daylight');
  div.innerHTML = `
    <canvas class="scene" aria-hidden="true"></canvas>
    <button class="hit" type="button" role="switch" aria-checked="false" aria-label="昼夜开关"></button>
    <span class="vh" role="status" aria-live="polite" data-status></span>
    <span class="probe" aria-hidden="true"></span>
  `;
  // 找到当前脚本，插在它前面
  const script = document.currentScript;
  script.parentNode.insertBefore(div, script);

  // 3. 自动引入核心逻辑
  const appScript = document.createElement('script');
  appScript.src = 'https://gsvegetable.github.io/pixel-daylight-switch/app.js';
  document.body.appendChild(appScript);
})();
