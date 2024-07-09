export type UserType = {
  id: string;
  username: string;
  fullname: string;
  email: string;
  avatar: {
    filename: string;
    url: string;
    public_id: string;
  } | null;
  posts: {
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
  }[];
  savedPosts: {
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
  }[];
};
