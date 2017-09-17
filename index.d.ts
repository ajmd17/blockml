declare module 'blockml' {
  interface CodeNode {
    parse(): void;
    createDOMNode(): HTMLElement;
    renderToString(): string;
  }

  interface BlockNode extends CodeNode {
    isVoidElement(): boolean;
  }

  module BlockNode {
    export function registerCustomHandler(tagName: string, handler: {
      createDOMNode: (node: BlockNode)=>HTMLElement;
      renderToString: (node: BlockNode)=>string;
    });
  }

  interface AttributeNode extends CodeNode {
    name: string;
    value: CodeNode;
  }

  export function createDOMNodes(input: string, cb: (errors: string[], result: string)=>void): void;
  export function render(input: string, cb: (errors: string[], result: string)=>void): void;
  export function registerCustomBlockHandler(tagName: string, handlers: {
    createDOMNode: (node: BlockNode)=>HTMLElement;
    renderToString: (node: BlockNode)=>string;
  }): void;
  export function registerCustomAttributeHandler(handler: (attributeNode: AttributeNode)=>AttributeNode): void;
}
