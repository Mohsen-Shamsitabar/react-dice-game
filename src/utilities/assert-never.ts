const assertNever = (x: never): never => {
  throw new Error(`Unhandled case: ${x}`);
};

export default assertNever;
