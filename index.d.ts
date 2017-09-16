declare module 'blockml' {
  interface BlockNode {
    isVoidElement(): boolean;
    parse(): void;
    createDOMNode(): HTMLElement;
    renderToString(): string;
  }

  module BlockNode {
    export function registerCustomHandler(tagName: string, handler: {
      createDOMNode: (node: BlockNode)=>HTMLElement;
      renderToString: (node: BlockNode)=>string;
    });
  }

  export function createDOMNodes(input: string, cb: (errors: string[], result: string)=>void): void;
  export function render(input: string, cb: (errors: string[], result: string)=>void): void;
  export function registerCustomBlockHandler(tagName: string, handlers: {
    createDOMNode: (node: BlockNode)=>HTMLElement;
    renderToString: (node: BlockNode)=>string;
  }): void;
  export function registerCustomAttributeHandler(tagName: string, handlers: {
    createDOMNode: (node: BlockNode)=>HTMLElement;
    renderToString: (node: BlockNode)=>string;
  }): void;
}
