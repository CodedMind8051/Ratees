// For Vue files
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// For Svelte files
declare module '*.svelte' {
  import type { ComponentType } from 'svelte'
  const component: ComponentType
  export default component
}

declare module '*.css';
declare module '*.scss';
declare module '*.svg' {
  const content: string;
  export default content;
}
declare module '*.png' {
  const content: string;
  export default content;
}
