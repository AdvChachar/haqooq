const __DEV__ = globalThis.__DEV__ === true;

export const logError = (context, error) => {
  if (__DEV__) {
    console.error(`[${context}]`, error);
  }
};
