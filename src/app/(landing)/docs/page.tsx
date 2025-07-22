"use client";

import { useState, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { docDocuments, DocDocument } from "~/constants/docs";
import DocListItem from "~/components/docs/doc-list-item";
import DocListSkeleton from "~/components/docs/doc-list-skeleton";
import Title from "~/components/title";

const pageSize = 6;

export default function DocsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [documents, setDocuments] = useState<DocDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const router = useRouter();

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      let filteredDocs = docDocuments;
      if (search) {
        filteredDocs = docDocuments.filter(doc => 
          doc.name.toLowerCase().includes(search.toLowerCase()) ||
          doc.description.toLowerCase().includes(search.toLowerCase()) ||
          doc.documentCode.toLowerCase().includes(search.toLowerCase())
        );
      }
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedDocs = filteredDocs.slice(startIndex, endIndex);
      setDocuments(paginatedDocs);
      setTotalDocuments(filteredDocs.length);
      setTotalPages(Math.ceil(filteredDocs.length / pageSize));
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleNavigate = (id: string) => {
    router.push(`/docs/${id}`);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    scrollToTop();
  };

  return (
    <main className="relative pt-20">
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-950 to-gray-900">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <Title
            title="Documentation"
            description="Learn about Cardano and build with confidence. Our comprehensive documentation covers everything from basic concepts to advanced development techniques."
          />
          
          <div className="flex flex-col md:flex-row md:items-end gap-4 mb-8">
            <div className="flex-1 flex flex-col gap-2">
              <label className="font-medium text-white">Search Documents</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Document name, code..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/20 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-800/50 text-white placeholder-gray-400 transition-all duration-300 hover:border-white/40 backdrop-blur-sm"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-300">
                Total: {totalDocuments} documents
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <DocListSkeleton key={i} />
              ))}
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-gray-300 text-lg mb-4">
                {search ? 'No documents found' : 'No documents available'}
              </div>
              {search && (
                <button 
                  onClick={() => setSearch('')} 
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-300 hover:scale-105 px-6 py-2"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="bg-gray-800/50 p-4 md:p-8 rounded-2xl border border-white/20 backdrop-blur-sm">
                <div className="w-full">
                  {documents.map(doc => (
                    <DocListItem
                      key={doc.id}
                      document={doc}
                      onNavigate={handleNavigate}
                    />
                  ))}
                </div>
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    title="Previous page"
                    className={`p-2 rounded-full transition-all duration-300 ${
                      page === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => {
                      const shouldShow = 
                        pageNum === 1 || 
                        pageNum === totalPages || 
                        Math.abs(pageNum - page) <= 1;

                      if (shouldShow) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            title={`Page ${pageNum}`}
                            className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                              pageNum === page
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        (pageNum === 2 && page > 3) ||
                        (pageNum === totalPages - 1 && page < totalPages - 2)
                      ) {
                        return <span key={pageNum} className="px-2 py-2 text-gray-400">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    title="Next page"
                    className={`p-2 rounded-full transition-all duration-300 ${
                      page === totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
} 