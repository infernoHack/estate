export type HouseListPageType = {
  id: string;
  title: string;
  price: number;
  images: {
    filename: string;
    url: string;
    public_id: string;
  }[];
  latitude: number;
  longitude: number;
  address: string;
  transaction: string;
  property: string;
  features: {
    sizes: {
      house: number;
      bedrooms: number;
      bathrooms: number;
    };
  };
  user: {
    id: string;
    username: string;
    fullname: string;
    email: string;
  };
}[];
