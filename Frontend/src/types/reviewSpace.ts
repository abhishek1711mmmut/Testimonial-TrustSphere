export type SpaceInfo = {
  spaceName: string;
  companyLogo: File | null | string;
  headerTitle: string;
  customMessage: string;
  questions: string[];
};

export type Space = {
  id: number;
  spaceName: string;
  companyLogo: string | null;
  headerTitle: string;
  customMessage: string;
  questions: string[];
  text_review_count: number;
  video_review_count: number;
  created_at: string;
  user_id: number;
};

export type UserData = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  planName: string;
  maxSpaces: number;
  maxTextReviews: number;
  maxVideoReviews: number;
  spaceCount: number;
};

export type Review = {
  rating: number;
  reviewerName: string;
  reviewerEmail: string;
  reviewerImage: File | null;
  review: string;
  attachedImages: File[];
  video: File | null;
};