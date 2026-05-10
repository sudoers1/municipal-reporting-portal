export type Notification = {
  id: string;
  type: string;
  title: string;
  body?: string;
  read: boolean;
  created_at: string;
};