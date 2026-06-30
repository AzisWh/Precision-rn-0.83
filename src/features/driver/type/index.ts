
export type DriverApproval = {
  status?: 'pending' | 'in_transit' | 'arrived' | 'completed' | 'rejected';
};

export type DriverApprovalPayload = { id: string } & DriverApproval;
