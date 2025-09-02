// Types for the polling application

// User profile type
export type Profile = {
  id: string;
  name: string | null;
  created_at: string;
  updated_at: string;
};

// Poll type
export type Poll = {
  id: string;
  title: string;
  description: string | null;
  user_id: string;
  is_multiple_choice: boolean;
  is_public: boolean;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  options?: PollOption[];
  votes_count?: number;
  user?: Profile;
};

// Poll option type
export type PollOption = {
  id: string;
  poll_id: string;
  text: string;
  created_at: string;
  updated_at: string;
  votes_count?: number;
};

// Vote type
export type Vote = {
  id: string;
  poll_id: string;
  option_id: string;
  user_id: string | null;
  voter_ip: string | null;
  created_at: string;
};

// Form input types
export type CreatePollInput = {
  title: string;
  description?: string;
  is_multiple_choice: boolean;
  is_public: boolean;
  end_date?: string | null;
  options: { text: string }[];
};

// Update poll input type
export type UpdatePollInput = {
  id: string;
  title: string;
  description?: string;
  is_multiple_choice: boolean;
  is_public: boolean;
  end_date?: string | null;
  options: { text: string }[];
};

// Vote input type
export type CreateVoteInput = {
  poll_id: string;
  option_id: string;
};