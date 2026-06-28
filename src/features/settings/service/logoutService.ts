const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

export const logoutApi = async (): Promise<void> => {
  await delay(500); 
};