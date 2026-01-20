"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Pagination from "./components/Pagination";

type LogData = {
  _id: string;
  fileName: string;
  completedAt: string;
  totalFetched: number;
  newJobs: number;
  updatedJobs: number;
  failedJobs: number;
};

type PaginationMeta = {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
};

export default function Home() {
  const [logs, setLogs] = useState<LogData[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchLogs = async (page: number = 1) => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await axios.get(API_BASE!, {
        params: { page, limit: 10 }
      });

      setLogs(response.data.data || []);
      setPagination(response.data.pagination);
      setHasLoadedOnce(true);
    } catch (error) {
      console.error("Failed to fetch import logs", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!hasLoadedOnce) {
      fetchLogs(1);
    }
  }, [hasLoadedOnce]);

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Import History
        </h2>

        <button
          type="button"
          disabled={isLoading}
          onClick={() => fetchLogs(pagination?.currentPage ?? 1)}
          className="border px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow relative">
        

        {!hasLoadedOnce && isLoading ? (
          <table className="min-w-full">
            <tbody>
              {Array.from({ length: 10 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-4 py-4">
                      <div className="h-4 bg-gray-200 rounded w-full" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "File Name",
                  "Import Date & Time",
                  "Total",
                  "New",
                  "Updated",
                  "Failed"
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-5 text-sm font-semibold text-gray-700 text-left"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{log.fileName}</td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(log.completedAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">{log.totalFetched}</td>
                  <td className="px-4 py-3 text-right text-green-600">
                    {log.newJobs}
                  </td>
                  <td className="px-4 py-3 text-right text-blue-600">
                    {log.updatedJobs}
                  </td>
                  <td className="px-4 py-3 text-right text-red-600">
                    {log.failedJobs}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={fetchLogs}
          disabled={isLoading}
        />
      )}
    </div>
  );
}
