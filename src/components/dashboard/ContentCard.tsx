import React, { useState, useRef, useEffect } from 'react';
import { Star, ExternalLink, Youtube } from 'lucide-react';
import SafeImage from '@/components/ui/SafeImage';

interface ContentCardProps {
  title: string;
  summary: string;
  tags: string[];
  source: {
    name: string;
    avatarUrl: string;
    type: 'youtube' | 'article' | 'newsletter' | 'other';
    url: string;
  };
  date: string;
  readTime: string;
  favorite: boolean;
  onToggleFavorite: () => void;
  originalUrl: string;
}

const ContentCard: React.FC<ContentCardProps> = ({
  title,
  summary,
  tags,
  source,
  date,
  readTime,
  favorite,
  onToggleFavorite,
  originalUrl,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const summaryRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = summaryRef.current;
    if (el) {
      setIsTruncated(el.scrollHeight > el.clientHeight);
    }
  }, [summary]);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Prevent toggling when clicking on favorite or external link
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('a')
    ) {
      return;
    }
    setExpanded(prev => !prev);
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col gap-2 relative cursor-pointer"
      onClick={handleCardClick}
      title={expanded ? 'Click to collapse' : 'Click to expand'}
    >
      {/* Source and Date */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <SafeImage 
            src={source.avatarUrl} 
            alt={source.name} 
            width={32}
            height={32}
            className="w-8 h-8 rounded-md object-cover" 
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{source.name}</span>
        </div>
        <span className="text-xs text-gray-400">{date}</span>
      </div>
      {/* Title */}
      <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-gray-100">{title}</h3>
      {/* Summary */}
      <p
        ref={summaryRef}
        className={`text-gray-700 dark:text-gray-300 mb-2 ${expanded ? '' : 'line-clamp-3'}`}
      >
        {summary}
      </p>
      {/* Show more/less button only if truncated */}
      {isTruncated && (
        <button
          type="button"
          className="self-start text-xs text-blue-600 dark:text-blue-300 underline focus:outline-none mb-2"
          onClick={e => { e.stopPropagation(); setExpanded(prev => !prev); }}
          aria-expanded={expanded}
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <span key={tag} className="bg-gray-100 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-200 px-2 py-0.5 rounded-full">{tag}</span>
        ))}
      </div>
      {/* Meta Info and Actions */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1"><span role="img" aria-label="clock">⏱️</span>{readTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={async (e) => {
              e.stopPropagation();
              setIsTogglingFavorite(true);
              try {
                await onToggleFavorite();
              } finally {
                setIsTogglingFavorite(false);
              }
            }}
            disabled={isTogglingFavorite}
            className={`p-1 rounded-full transition-all duration-200 ${
              isTogglingFavorite 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-yellow-100 dark:hover:bg-yellow-900 hover:scale-110'
            } ${favorite ? 'text-yellow-500' : 'text-gray-400'}`}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            title={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star 
              fill={favorite ? 'currentColor' : 'none'} 
              size={20} 
              className={`transition-transform duration-200 ${isTogglingFavorite ? 'animate-pulse' : ''}`}
            />
          </button>
          <a
            href={originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
          >
            {source.type === 'youtube' ? <Youtube size={16} /> : <ExternalLink size={16} />}
            {source.type === 'youtube' ? 'Watch on YouTube' : 'Read Original'}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContentCard; 