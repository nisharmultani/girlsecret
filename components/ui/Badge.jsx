import { SparklesIcon, FireIcon, TagIcon, BoltIcon, TrophyIcon } from '@heroicons/react/24/solid';

/**
 * Premium Badge Component
 * Shows product status with animated icons
 */
export default function Badge({ type = 'new', text, className = '' }) {
  const badges = {
    new: {
      className: 'badge-new',
      icon: SparklesIcon,
      defaultText: 'New',
    },
    hot: {
      className: 'badge-hot',
      icon: FireIcon,
      defaultText: 'Hot',
    },
    sale: {
      className: 'badge-sale',
      icon: TagIcon,
      defaultText: 'Sale',
    },
    limited: {
      className: 'badge-limited',
      icon: BoltIcon,
      defaultText: 'Limited',
    },
    trending: {
      className: 'badge-trending',
      icon: TrophyIcon,
      defaultText: 'Trending',
    },
    'sold-out': {
      className: 'badge-sold-out',
      icon: null,
      defaultText: 'Sold Out',
    },
  };

  const badge = badges[type] || badges.new;
  const Icon = badge.icon;
  const displayText = text || badge.defaultText;

  return (
    <div className={`${badge.className} ${className}`}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      <span>{displayText}</span>
    </div>
  );
}

/**
 * Discount Badge Component
 * Shows percentage discount
 */
export function DiscountBadge({ percent, className = '' }) {
  return (
    <div className={`badge-sale ${className}`}>
      <TagIcon className="w-3.5 h-3.5" />
      <span>-{percent}%</span>
    </div>
  );
}

/**
 * Badge Container
 * Stacks multiple badges
 */
export function BadgeContainer({ children, className = '' }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {children}
    </div>
  );
}
