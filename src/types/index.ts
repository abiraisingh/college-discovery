export interface CollegeSummary {
  id: string;
  slug: string;
  name: string;
  location: string;
  imageUrl: string;
  rating: number;
  fees: number;
  description: string;
}

export interface CollegeCardProps {
  college: CollegeSummary;
  saved?: boolean;
  onSave: () => void;
}

export interface CollegeFilters {
  search?: string;
  location?: string;
  minFee?: number;
  maxFee?: number;
  rating?: number;
  courseType?: 'UG' | 'PG' | 'DIPLOMA' | 'CERTIFICATION';
  sort?: 'ratingDesc' | 'feesAsc' | 'nameAsc';
  page?: number;
}
