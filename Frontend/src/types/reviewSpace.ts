export type SpaceInfo = {
  spaceName: string;
  companyLogo: File | null | string;
  headerTitle: string;
  customMessage: string;
  questions: string[];
};

export type TextReview = {
  rating: number;
  review: string;
  attachedImages: File[];
  reviewerName: string;
  reviewerEmail: string;
  reviewerImage: File | null;
};

export type VideoReview = {
  rating: number;
  reviewerName: string;
  reviewerEmail: string;
  reviewerImage: File | null;
  video: File | null;
};
