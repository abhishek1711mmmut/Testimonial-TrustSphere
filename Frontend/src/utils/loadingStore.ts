let count = 0;
let listener: ((isLoading: boolean) => void) | null = null;

export const subscribe = (fn: (isLoading: boolean) => void) => {
  listener = fn;
};

export const startLoading = () => {
  count++;
  listener?.(true);
};

export const stopLoading = () => {
  count = Math.max(0, count - 1);
  if (count === 0) listener?.(false);
};
