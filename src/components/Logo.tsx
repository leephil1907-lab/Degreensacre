import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  href?: string;
  className?: string;
}

const sizes = {
  sm: { img: 36, text: 'text-sm', sub: 'text-[9px]' },
  md: { img: 48, text: 'text-base', sub: 'text-[10px]' },
  lg: { img: 64, text: 'text-lg', sub: 'text-xs' },
};

export default function Logo({ size = 'md', showText = true, href = '/', className = '' }: LogoProps) {
  const s = sizes[size];

  const content = (
    <div className={`flex items-center space-x-3 ${className}`}>
      <Image
        src="/logo-icon.png"
        alt="De-Greenacres Properties Limited"
        width={s.img}
        height={s.img}
        className="object-contain"
        priority={href === '/'}
      />
      {showText && (
        <div>
          <div className={`font-bold ${s.text} text-charcoal tracking-tight leading-tight`}>
            De-Greenacres
          </div>
          <div className={`${s.sub} text-gray-500 tracking-wide uppercase leading-tight`}>
            Properties Limited
          </div>
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
