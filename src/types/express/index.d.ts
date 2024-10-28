declare global {
  interface Request {
    user?: { id: string };
  }
}
