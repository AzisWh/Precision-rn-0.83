
export type DriverApproval = {
  status?: 'pending' | 'in_transit' | 'arrived' | 'completed';
};

export type DriverApprovalPayload = { id: string } & DriverApproval;
