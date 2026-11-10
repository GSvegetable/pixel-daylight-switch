# Framework integration recipes

The core package has no React or Vue runtime dependency. Use the same HTML root and mount/unmount lifecycle from your framework. The component owns its internal canvas and interaction elements; your framework owns the surrounding container.

## React

Install the core package:

```bash
npm install pixel-daylight-switch-gsvegetable
```

```jsx
import { useEffect, useRef } from 'react';
import { mount, unmount } from 'pixel-daylight-switch-gsvegetable';

export function DaylightSwitch({ scene = 'countryside', weather = 'default' }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    mount(root);
    return () => unmount(root);
  }, [scene, weather]);

  return (
    <div style={{ width: 'min(100%, 800px)', marginInline: 'auto' }}>
      <div
        ref={rootRef}
        data-ld-part="toggle-daylight"
        data-scene={scene}
        data-weather={weather}
      />
    </div>
  );
}
```

The effect cleans up the previous instance before applying changed scene or weather attributes, so the renderer always reads the latest configuration.

## Vue 3

```vue
<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { mount, unmount } from 'pixel-daylight-switch-gsvegetable';

const root = ref(null);
onMounted(() => mount(root.value));
onBeforeUnmount(() => {
  if (root.value) unmount(root.value);
});
</script>

<template>
  <div class="daylight-switch-wrap">
    <div
      ref="root"
      data-ld-part="toggle-daylight"
      data-scene="japanese-street"
      data-weather="default"
    />
  </div>
</template>

<style scoped>
.daylight-switch-wrap {
  width: min(100%, 800px);
  margin-inline: auto;
}
</style>
```

## Plain HTML / CDN

For one default switch with no build step, use the one-line embed:

```html
<script src="https://gsvegetable.github.io/pixel-daylight-switch/embed.js"></script>
```

For custom configuration, place a root element where you want it and load the runtime:

```html
<div style="width:min(100%, 800px);margin-inline:auto">
  <div
    data-ld-part="toggle-daylight"
    data-scene="seaside"
    data-weather="snow"
    data-start-night="true"
  ></div>
</div>
<script src="https://gsvegetable.github.io/pixel-daylight-switch/app.js"></script>
```

The runtime injects component-scoped styles. Do not import `style.css` just to use the component; that file also contains styles for the repository's standalone demo page.

## Lifecycle and events

- Call `mount(root)` after the root is attached to the DOM.
- Call `unmount(root)` before the framework removes the root.
- Mounting the same root repeatedly is safe; it is idempotent.
- Listen for `daylight:change` on the root to synchronize application state. The event's `detail.night` property is a boolean.
- The root must be allowed to measure its width. A width of `100%` inside a parent with a real layout width is the usual choice.
- The component keeps its intrinsic 1.6439 aspect ratio and scales to the available width.

## Configuration

See [README.md](README.md) for the complete list of `data-*` attributes, CSS custom properties, rendering behavior and supported scene identifiers.
