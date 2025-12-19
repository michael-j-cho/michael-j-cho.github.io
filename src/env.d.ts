/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare global {
  interface Window {
    adsbygoogle?: any[] & { loaded?: boolean };
  }
}

declare module "*.yml" {
  const content: any;
  export default content;
}

export {};
