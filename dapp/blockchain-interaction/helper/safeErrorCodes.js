export const SAFE_ERRORS = {
  // Owner / Signature Related
  GS001: "Invalid owner provided",
  GS002: "Owner already exists",
  GS003: "Invalid threshold",
  GS004: "Address is not an owner",
  GS005: "Invalid owner count",
  GS006: "Threshold must be greater than 0",
  GS007: "Threshold cannot exceed owner count",
  GS008: "Signatures data too short",
  GS009: "Invalid signature length",
  GS010: "Invalid signature type",
  GS020: "Not enough valid signatures / approvals",
  GS021: "Contract signature pointer invalid",
  GS025: "Approved hash missing or invalid",
  GS026: "Owners not sorted / duplicate / invalid owner",

  // Module / Guard Related
  GS100: "Module not enabled",
  GS101: "Module already enabled",
  GS102: "Invalid module address",
  GS103: "Guard already set",
  GS104: "Guard invalid",
  GS105: "Guard does not implement expected interface",
  GS106: "Cannot disable guard — no guard set",

  // Execution Related
  GS200: "Safe transaction failed",
  GS201: "Invalid operation type (must be CALL or DELEGATECALL)",
  GS202:
    "Cannot remove the last owner — a Safe must always have at least one owner.",
  GS203: "Incorrect gas payment setup",
  GS204: "No duplicate owners allowed.",
  GS205: "Transaction signature verification failed",
  GS206: "EOA owner signature missing",
  GS300: "Invalid fallback handler address",
  GS400: "Safe is locked",
  GS500: "Invalid nonce",
  GS501: "Reentrancy not allowed",

  //  Guards
  GUARD000: "Transaction blocked by guard",
  GUARD001: "Guard validation failed",
  GUARD002: "Guard does not allow module execution",

  // ModuleManager
  MODULE000: "Module not authorized",
  MODULE001: "Module transaction failed",
  MODULE002: "Module already disabled",
  MODULE003: "Invalid module execution",
  MODULE004: "Invalid module return value",

  //  MultiSend
  MULTISEND001: "Length mismatch in multi-transaction data",
  MULTISEND002: "Invalid operation in multisend",
  MULTISEND003: "One of the sub-transactions reverted",

  //  Fallback Handler
  FH001: "Invalid fallback handler",
  FH002: "Fallback handler execution failed",

  // EIP1271 / Off-chain signatures
  SIG001: "Signature validation failed",
  SIG002: "Owner signature invalid",
  SIG003: "Wrong signing method used",
  SIG004: "Hash signed incorrectly",
  SIG005: "EIP-712 signature verification failed",
};
