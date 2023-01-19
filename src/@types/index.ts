export interface StatusRecord {
  id: string;
  status: string;
  modified: string;
  user: {
    email: string;
    id: string;
  };
}
