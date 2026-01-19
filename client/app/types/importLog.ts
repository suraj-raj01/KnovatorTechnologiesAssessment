export interface ImportLog {
  _id: string;
  fileName: string;
  totalFetched: number;
  newJobs: number;
  updatedJobs: number;
  failedJobs: number;
  createdAt: string;
}

export interface PaginationMeta {
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface ImportLogResponse {
  success: boolean;
  data: ImportLog[];
  pagination: PaginationMeta;
}
