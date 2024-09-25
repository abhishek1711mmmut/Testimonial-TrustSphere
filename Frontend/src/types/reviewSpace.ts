export type SpaceInfo = {
  spaceName: string;
  companyLogo: File | null | string;
  headerTitle: string;
  customMessage: string;
  questions: string[];
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