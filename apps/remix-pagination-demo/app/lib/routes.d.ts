declare module "routes-gen" {
  export type RouteParams = {
    "/pokemon": Record<string, never>;
    "/": Record<string, never>;
  };

  export function route<
    T extends
      | ["/pokemon"]
      | ["/"]
  >(...args: T): typeof args[0];
}
