// types/next.d.ts
import "next";

declare module "next" {
  export type PageProps = {
    params?: Record<string, string | string[]>;
    searchParams?: Record<string, string | string[] | undefined>;
  };

  export type GenerateMetadataProps = PageProps;
  export type GenerateViewportProps = PageProps;
}
