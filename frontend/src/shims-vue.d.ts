declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '@/stores/*';
declare module '@/types/*';
declare module '@/plugins/*';
declare module 'vue';
declare module 'pinia';

