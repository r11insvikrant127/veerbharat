// src/constants/idPrefixes.ts

export const ID_PREFIXES = {
  HERO: "HERO",
  PER: "PER",
  KGD: "KGD",
  BAT: "BAT",
  BOOK: "BOOK",
  SRC: "SRC",
  IMG: "IMG",
  DYN: "DYN",
  EVT: "EVT",
  FORT: "FORT",
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
} as const;

export type IdPrefix = (typeof ID_PREFIXES)[keyof typeof ID_PREFIXES];