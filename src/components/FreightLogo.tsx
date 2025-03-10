
import React from 'react';
import { forwarderLogos } from '@/utils/forwarderLogos';

type FreightLogoProps = {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glow';
};

const FreightLogo: React.FC<FreightLogoProps> = ({ name, size = 'md', variant = 'default' }) => {
  const cleanName = name.toLowerCase().trim();
  
  const logoInfo = Object.entries(forwarderLogos).find(([key, _]) => 
    cleanName.includes(key.toLowerCase())
  );
  
  const logoUrl = logoInfo ? logoInfo[1].url : null;
  
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
  
  const baseClasses = `${sizeClasses[size]} rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 ease-in-out`;
  
  const variantClasses = {
    default: 'bg-palette-darkblue/80 border border-palette-mint/30',
    glow: 'bg-palette-darkblue shadow-lg shadow-palette-mint/20 border-2 border-palette-mint/50 animate-pulse'
  };

  if (!logoUrl) {
    const initials = name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    return (
      <div className={`${baseClasses} ${variantClasses[variant]} relative group`}>
        <div className="absolute inset-0 bg-gradient-to-r from-palette-mint/10 to-palette-teal/10 group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>
        <span className="relative text-xs font-bold text-palette-mint">{initials}</span>
      </div>
    );
  }
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} group`}>
      <div className="absolute inset-0 bg-gradient-to-r from-palette-mint/10 to-palette-teal/10 group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>
      <img 
        src={logoUrl} 
        alt={`${name} logo`} 
        className="w-full h-full object-contain p-0.5 brightness-125" 
      />
    </div>
  );
};

export default FreightLogo;
