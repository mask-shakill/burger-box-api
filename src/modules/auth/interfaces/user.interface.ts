export interface User {
  id: string;
  name: string;
  email: string;
  img_url?: string;
  role: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    country?: string;
    zipCode?: string;
  };
  created_at: string;
}
