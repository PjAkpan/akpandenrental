declare module 'react-signature-canvas' {
  import React from 'react';

  export interface SignatureCanvasProps {
    canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>;
    penColor?: string;
    onEnd?: () => void;
    onBegin?: () => void;
    clearOnResize?: boolean;
  }

  export default class SignatureCanvas extends React.Component<SignatureCanvasProps> {
    clear(): void;
    isEmpty(): boolean;
    fromDataURL(base64String: string): void;
    toDataURL(type?: string, encoderOptions?: number): string;
    fromData(data: any[]): void;
    toData(): any[];
  }
}
