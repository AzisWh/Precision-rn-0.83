
export type RejectRequest = {
  reject_reason: string;
  reject_by: string;
  status: 'rejected';
}

export type RejectPayload = { id: string } & RejectRequest;
