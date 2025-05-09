'use client'
import React, { useState, useEffect } from 'react';
import { Menu, Home, Star, Settings, ChevronLeft, ChevronRight, Youtube, Mail, Globe, Tag, Search } from 'lucide-react';
import ContentCard from '@/components/dashboard/ContentCard';

type Content = {
  _id?: string;
  id?: number;
  title: string;
  summary: string;
  tags: string[];
  source: {
    name: string;
    avatarUrl: string;
    type: string;
    url: string;
  };
  date: string;
  readTime: string;
  favorite: boolean;
  originalUrl: string;
};

const mockContent = [
  {
    id: 1,
    title: 'The Future of AI: Beyond ChatGPT and Large Language Models',
    summary: 'This video explores the next frontiers in artificial intelligence beyond large language models like ChatGPT. Key topics include multimodal AI systems that can process and generate different types of data (text, images, audio), AI agents capable of reasoning and planning, and advancements in reinforcement learning from human feedback.',
    tags: ['AI', 'Technology', 'Future'],
    source: {
      name: 'Tech Insights',
      avatarUrl: 'https://yt3.ggpht.com/ytc/AMLnZu9vQw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Q=s88-c-k-c0x00ffffff-no-rj',
      type: 'youtube',
      url: 'https://www.youtube.com/channel/UC123456789',
    },
    date: 'Sep 25, 2023',
    readTime: '4 min read',
    favorite: false,
    originalUrl: 'https://www.youtube.com/watch?v=abcdefghij',
  },
  {
    id: 2,
    title: 'Sample Article',
    summary: 'This is a sample article summary.',
    tags: ['Sample', 'Article'],
    source: {
      name: 'Sample News',
      avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      type: 'article',
      url: 'https://news.example.com',
    },
    date: 'Sep 20, 2023',
    readTime: '3 min read',
    favorite: true,
    originalUrl: 'https://news.example.com/article',
  },
];

const contentTypes = [
  { label: 'All', value: 'all' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'Websites', value: 'article' },
  { label: 'Newsletters', value: 'newsletter' },
];

const tabTypes = [
  { label: 'All', value: 'all' },
  { label: 'Favorites', value: 'favorites' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'Websites', value: 'article' },
  { label: 'Newsletters', value: 'newsletter' },
];

function Sidebar({ isOpen, onClose, collapsed, onToggle }: { isOpen: boolean; onClose: () => void; collapsed: boolean; onToggle: () => void }) {
  return (
    <>
      {/* Sidebar only on desktop */}
      <aside className={`hidden md:flex md:flex-col md:relative md:h-screen md:z-10 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${collapsed ? 'md:w-16' : 'md:w-64'}`}>
        <div className="h-full flex flex-col py-6">
          {/* Collapse/Expand button for desktop */}
          <button className="mb-4 ml-auto mr-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800" onClick={onToggle} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          <nav className={`flex flex-col gap-1 px-2 ${collapsed ? 'items-center' : ''}`}>
            <a className={`flex items-center py-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 font-medium gap-2 ${collapsed ? 'justify-center' : ''}`} href="#"><Home size={20} />{!collapsed && 'Feed'}</a>
            <a className={`flex items-center py-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 font-medium gap-2 ${collapsed ? 'justify-center' : ''}`} href="#"><Star size={20} />{!collapsed && 'Favorites'}</a>
            <a className={`flex items-center py-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 font-medium gap-2 ${collapsed ? 'justify-center' : ''}`} href="#"><Settings size={20} />{!collapsed && 'Settings'}</a>
          </nav>
        </div>
      </aside>
    </>
  );
}

function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 w-full sticky top-0 z-50">
      <div className="w-full px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Menu icon only on desktop */}
          <button className="hidden md:inline-flex p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" onClick={onMenuClick} aria-label="Open sidebar">
            <Menu size={24} />
          </button>
          <span className="text-gray-700 dark:text-gray-200 text-xl font-semibold tracking-wide select-none">Briefly<span className="text-teal-500 dark:text-teal-400">AI</span></span>
        </div>
      </div>
    </header>
  );
}

function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-around items-center h-16 md:hidden">
      <a href="#" className="flex flex-col items-center text-xs text-gray-700 dark:text-gray-200 hover:text-teal-500 dark:hover:text-teal-400">
        <Home size={22} />
        Feed
      </a>
      <a href="#" className="flex flex-col items-center text-xs text-gray-700 dark:text-gray-200 hover:text-teal-500 dark:hover:text-teal-400">
        <Star size={22} />
        Favs
      </a>
      <a href="#" className="flex flex-col items-center text-xs text-gray-700 dark:text-gray-200 hover:text-teal-500 dark:hover:text-teal-400">
        <Youtube size={22} />
        YT
      </a>
      <a href="#" className="flex flex-col items-center text-xs text-gray-700 dark:text-gray-200 hover:text-teal-500 dark:hover:text-teal-400">
        <Mail size={22} />
        News
      </a>
      <a href="#" className="flex flex-col items-center text-xs text-gray-700 dark:text-gray-200 hover:text-teal-500 dark:hover:text-teal-400">
        <Tag size={22} />
        Topics
      </a>
    </nav>
  );
}

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    async function fetchContent() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/content');
        if (!res.ok) throw new Error('Failed to fetch content');
        const data = await res.json();
        setContent(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching content');
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, []);

  const handleToggleFavorite = (id: string | number | undefined) => {
    setContent(prev => prev.map(item => (item._id === id || item.id === id) ? { ...item, favorite: !item.favorite } : item));
  };

  // Filter content by search and type/tab
  const filteredContent = content.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.summary.toLowerCase().includes(search.toLowerCase());
    let matchesType =
      (activeTab === 'all' && (typeFilter === 'all' || item.source.type === typeFilter)) ||
      (activeTab === 'favorites' && item.favorite) ||
      (activeTab !== 'all' && activeTab !== 'favorites' && item.source.type === activeTab);
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pb-16 md:pb-0">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c => !c)} />
        <main className={`flex-1 w-full max-w-full px-2 sm:px-4 py-4 md:py-6 md:pl-4 md:pr-6 md:max-w-5xl md:mx-auto ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
          {/* Welcome section */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold mb-1">Good morning, Danilo! 👋</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Here's your personalized feed. Stay updated with AI-summarized content from your favorite sources.</p>
          </div>
          {/* Sticky search/filter bar with embedded tabs */}
          <div className="sticky top-20 z-30 mb-6">
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
                key={item._id || item.id}
                title={item.title}
                summary={item.summary}
                tags={item.tags}
                source={item.source as any}
                date={item.date}
                readTime={item.readTime}
                favorite={item.favorite}
                onToggleFavorite={() => handleToggleFavorite(item._id || item.id)}
                originalUrl={item.originalUrl}
              />
            ))}
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
} 