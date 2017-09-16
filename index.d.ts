declare module 'blockml' {
  export function registerCustomHandler(tagName: string, handlers: {
    createDOMNode: (node: BlockNode)=>HTMLElement;
    renderToString: (node: BlockNode)=>string;
  }): void;
}