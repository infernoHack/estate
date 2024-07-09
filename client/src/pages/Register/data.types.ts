export type DataType = {
  fullname: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  policy: boolean;
  singleErrorInput: string;
};

export type AvatarType = {
  filename: string;
  url: string;
  public_id: string;
}[];
