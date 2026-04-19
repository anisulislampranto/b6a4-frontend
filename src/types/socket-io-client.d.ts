declare module "socket.io-client" {
  export type Socket = {
    on: (event: string, cb: (...args: unknown[]) => void) => void;
    off: (event: string, cb?: (...args: unknown[]) => void) => void;
  };

  export const io: (url: string, options?: Record<string, unknown>) => Socket;
}
