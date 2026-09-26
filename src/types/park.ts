export interface ParkFeature {
  id: string;
  name: string;
}

export interface Park {
  id: string;
  name: string;
  rating: number;
  features: string[];
  imageUrl?: string;
  region: string;
}
