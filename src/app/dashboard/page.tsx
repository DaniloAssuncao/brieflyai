'use client'
import React, { useState, useEffect } from 'react';
import {  Search } from 'lucide-react';
import ContentCard from '@/components/dashboard/ContentCard';
import {useSession } from 'next-auth/react';
import Layout from '@/components/layout/Layout';
import { IPublicContent } from '@/types';
import { contentApi } from '@/lib/api-client';
import ClientOnly from '@/components/ui/ClientOnly';
import { useToast } from '@/hooks/useToast';

const tabTypes = [
  { label: 'All', value: 'all' },
  { label: 'Favorites', value: 'favorites' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'Websites', value: 'article' },
  { label: 'Newsletters', value: 'newsletter' },
];

export default function DashboardPage() {
  const [content, setContent] = useState<IPublicContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    async function fetchContent() {
      setLoading(true);
      setError(null);
      try {
        const data = await contentApi.getAll();
        setContent(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Error fetching content');
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, []);

  const handleToggleFavorite = async (id: string | number | undefined) => {
    if (!id) return;
    
    // Find the current item to get its current favorite status
    const currentItem = content.find(item => item.id === id);
    if (!currentItem) return;
    
    const willBeFavorite = !currentItem.favorite;
    
    try {
      // Optimistically update the UI
      setContent(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, favorite: willBeFavorite }
            : item
        )
      );

      // Call the API to persist the change
      await contentApi.toggleFavorite(id.toString());
      
      // Show success toast
      showSuccess(
        willBeFavorite 
          ? 'Added to favorites!' 
          : 'Removed from favorites!',
        2000
      );
      
    } catch (error) {
      // Revert the optimistic update on error
      setContent(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, favorite: !willBeFavorite }
            : item
        )
      );
      
      console.error('Failed to toggle favorite:', error);
      showError('Failed to update favorite status. Please try again.');
    }
  };

  // Filter content by search and type/tab
  const filteredContent = content.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.summary.toLowerCase().includes(search.toLowerCase());
    const matchesType =
      (activeTab === 'all' && (typeFilter === 'all' || item.source.type === typeFilter)) ||
      (activeTab === 'favorites' && item.favorite) ||
      (activeTab !== 'all' && activeTab !== 'favorites' && item.source.type === activeTab);
    return matchesSearch && matchesType;
  });

  const { data: session } = useSession(); 

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pb-16 md:pb-0">
        <main className="flex-1 w-full max-w-full px-2 sm:px-4 py-4 md:py-6 md:pl-4 md:pr-6 md:max-w-5xl md:mx-auto">
          {/* Welcome section */}
          <div className="mb-4">
            <ClientOnly fallback={<h1 className="text-2xl font-bold mb-1">Good morning! 👋</h1>}>
              <h1 className="text-2xl font-bold mb-1">Good morning, {session?.user?.name}! 👋</h1>
            </ClientOnly>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Here&apos;s your personalized feed. Stay updated with AI-summarized content from your favorite sources.</p>
          </div>
          {/* Sticky search/filter bar with embedded tabs */}
          <div className="mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col w-full px-4 py-3">
              {/* Search Bar left, Tabs right */}
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                <div className="flex flex-1 items-center gap-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1">
                  {/* Search input left */}
                  <div className="flex items-center flex-1 gap-2 w-full">
                    <Search className="text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400"
                    />
                  </div>
                  {/* Tabs as pills right */}
                  <div className="flex gap-1 overflow-x-auto ml-2">
                    {tabTypes.map(tab => (
                      <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap border-2 ${activeTab === tab.value ? 'bg-teal-500 text-white border-teal-500' : 'bg-transparent text-gray-700 dark:text-gray-200 border-transparent hover:bg-teal-100 dark:hover:bg-teal-800'}`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {loading && <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>}
            {error && <div className="text-center text-red-500">{error}</div>}
            {!loading && !error && filteredContent.map(item => (
               <ContentCard
              key={item.id}
              title={item.title}
              summary={item.summary}
              tags={item.tags}
              source={item.source}
              date={item.date}
              readTime={item.readTime}
              favorite={item.favorite}
              onToggleFavorite={() => handleToggleFavorite(item.id)}
              originalUrl={item.originalUrl}
              />
            ))}
          </div>
        </main>
      </div>
    </Layout>
  );
} 