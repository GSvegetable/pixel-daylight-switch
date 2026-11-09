(function() {
  // 1. 自动注入所需样式
  if (!document.getElementById('ld-switch-styles')) {
    const link = document.createElement('link');
    link.id = 'ld-switch-styles';
    link.rel = 'stylesheet';
    link.href = 'https://gsvegetable.github.io/pixel-daylight-switch/style.css';
    document.head.appendChild(link);
  }

  // 2. 自动创建一个自带尺寸的容器
  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'width: 100%; max-width: 800px; height: 450px; margin: 20px auto; position: relative; background: #f5ecd9; border-radius: 16px; overflow: hidden;';
  
  // 3. 塞入组件需要的 DOM 结构
  const inner = document.createElement('div');
  inner.setAttribute('data-ld-part', 'toggle-daylight');
  inner.style.cssText = 'width: 100%; height: 100%;';
  inner.innerHTML = `
    <canvas class="scene" aria-hidden="true"></canvas>
    <button class="hit" type="button" role="switch" aria-checked="false" aria-label="昼夜开关"></button>
    <span class="vh" role="status" aria-live="polite" data-status></span>
    <span class="probe" aria-hidden="true"></span>
  `;
  wrapper.appendChild(inner);

  // 4. 把容器插入到当前 script 标签的前面
  const script = document.currentScript;
  if (script && script.parentNode) {
    script.parentNode.insertBefore(wrapper, script);
  } else {
    document.body.appendChild(wrapper);
  }

  // 5. 最后加载核心逻辑，并加时间戳强制刷新缓存
  const appScript = document.createElement('script');
  appScript.src = 'https://gsvegetable.github.io/pixel-daylight-switch/app.js?v=' + Date.now();
  appScript.onerror = () => {
    wrapper.innerHTML = '<div style="color:red; padding:20px;">组件加载失败，请检查网络或跨域设置。</div>';
  };
  document.body.appendChild(appScript);
})();
