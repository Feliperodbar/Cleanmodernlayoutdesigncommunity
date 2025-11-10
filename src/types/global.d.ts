// Temporary JSX typing workaround to unblock TSX compilation when React types are missing.
// Proper fix: install @types/react and @types/react-dom.
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

