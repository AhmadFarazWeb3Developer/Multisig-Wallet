export interface QueuedTxIface {
  tx_id: string;
  operation_name: string;
  operation_description: string;
  sender_address: string;
  sender_name: string;
  queued_at: string;
  metadata: {
    eth_amount?: string;
    eth_recipient?: string;
    token_amount?: string;
    token_recipient?: string;
    owner_for_removal?: string;
    newOwner_with_threshold?: string;
    new_threshold1?: string;
    new_threshold2?: string;
    guardAddress?: string;
    newOwner_for_swap?: string;
  };
}

export interface SignTxIfac {
  tx_id: string;
  operation_name: string;
  operation_description: string;
  sender_address: string;
  sender_name: string;
  queued_at: string;
  metadata: {
    eth_amount?: string;
    eth_recipient?: string;
    token_amount?: string;
    token_recipient?: string;
    mint_token_amount?: string;
    newOwner_with_threshold?: string;
    new_threshold1?: string;
    prevOwner_for_removal?: string;
    newOwner_for_removal?: string;
    newThreshold_for_removal?: string;
    prevOwner_for_swap?: string;
    oldOwner_for_swap?: string;
    newOwner_for_swap?: string;
    new_threshold2?: string;
    guard_address?: string;
  };
}

export interface RejectedTxIface {
  tx_id: string;
  operation_name?: string;
  sender_address?: string;
  rejected_by: string;
  status: number;
  rejected_at: string;
  metadata: {
    eth_amount?: string;
    eth_recipient?: string;
    token_amount?: string;
    token_recipient?: string;
    mint_token_amount?: string;
    newOwner_with_threshold?: string;
    new_threshold1?: string;
    prevOwner_for_removal?: string;
    newOwner_for_removal?: string;
    newThreshold_for_removal?: string;
    prevOwner_for_swap?: string;
    oldOwner_for_swap?: string;
    newOwner_for_swap?: string;
    new_threshold2?: string;
    guard_address?: string;
  };
}
