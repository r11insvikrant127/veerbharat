// src/constants/idPrefixes.ts

export const ID_PREFIXES = {
  HERO: "HERO",
  PER: "PER",
  KGD: "KGD",
  BAT: "BAT",
  BOK: "BOK",
  SRC: "SRC",
  IMG: "IMG",
  DYN: "DYN",
  EVT: "EVT",
  FRT: "FRT",
  PLC: "PLC",
  QTE: "QTE",
  MUS: "MUS",
  MEM: "MEM",
  EXH: "EXH",
  CMD: "CMD",
  TRB: "TRB",
  WAN: "WAN",
  WST: "WST",
  ALL: "ALL",
  WPN: "WPN",
  KNG: "KNG",
  BTL: "BTL",
  ANL: "ANL",
  MCO: "MCO",
} as const;

export type IdPrefix = (typeof ID_PREFIXES)[keyof typeof ID_PREFIXES];