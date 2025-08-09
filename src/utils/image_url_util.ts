const getR2Endpoint = (): string => {
  const endpoint = import.meta.env.VITE_R2_ENDPOINT;
  if (!endpoint) {
    throw new Error('VITE_R2_ENDPOINT environment variable is not defined');
  }
  return endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
};

export const getUserImageUrl = (uid: string, imageName?: string): string => {
  const baseUrl = `${getR2Endpoint()}/users/${uid}`;
  return baseUrl;
};

export const getPostImageUrl = (uid: string, postId: string, imageName?: string): string => {
  const baseUrl = `${getR2Endpoint()}/users/${uid}/posts/${postId}`;
  return baseUrl;
};