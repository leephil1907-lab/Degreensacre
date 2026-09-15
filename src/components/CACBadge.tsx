export default function CACBadge({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shield shape */}
      <path d="M50 5L15 20V45C15 70 30 88 50 95C70 88 85 70 85 45V20L50 5Z" fill="currentColor" opacity="0.15" />
      <path d="M50 5L15 20V45C15 70 30 88 50 95C70 88 85 70 85 45V20L50 5Z" stroke="currentColor" strokeWidth="3" fill="none" />
      {/* Inner shield */}
      <path d="M50 12L22 24V45C22 66 34 82 50 88C66 82 78 66 78 45V24L50 12Z" fill="currentColor" opacity="0.1" />
      {/* CAC text */}
      <text x="50" y="48" textAnchor="middle" fill="currentColor" fontSize="16" fontWeight="bold" fontFamily="serif">CAC</text>
      {/* Verified checkmark */}
      <circle cx="50" cy="65" r="10" fill="currentColor" opacity="0.2" />
      <path d="M44 65L48 69L56 61" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Stars */}
      <circle cx="35" cy="35" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="65" cy="35" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="50" cy="28" r="2" fill="currentColor" opacity="0.5" />
    </svg>
  );
}
