
export type CompletedRequest = {
  status: 'completed';
}

export type CompletePayload = { id: string } & CompletedRequest;
