export interface ApiPlace {
  _id: string;

  placeId: string;

  name: string;

  nativeName?: string;

  type:
    | "City"
    | "Village"
    | "Fort"
    | "Hill"
    | "Valley"
    | "Pass"
    | "Canal"
    | "River";

  coordinates?: {
    latitude: number;
    longitude: number;
  };

  state?: string;

  country?: string;

  region?: string;

  significance?: string;

  description: string;

  historicalPeriodId?: string;

  tags?: string[];

  status: "Draft" | "Verified" | "Published" | "Needs Review";
}

export interface PlacesApiResponse {
  data: ApiPlace[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}