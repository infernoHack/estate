export type UserType = {
  id: string;
  username: string;
  fullname: string;
  email: string;
  avatar?: {
    id: string;
    url: string;
    filename: string;
    public_id: string;
  };
} | null;

export type FinalDataType = {
  password?: string | undefined;
  fullname: string;
  email: string;
};

export type AvatarType = {
  filename: string;
  url: string;
  public_id: string;
}[];
