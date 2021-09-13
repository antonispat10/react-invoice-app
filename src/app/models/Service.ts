interface ServiceLoading {
  status: 'loading';
}

interface ServiceLoaded<T> {
  status: 'loaded';
  payload: T;
}

export type Service<T> = ServiceLoading | ServiceLoaded<T>
