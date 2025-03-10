
import React from 'react';
import { forwarderLogos } from '@/utils/forwarderLogos';

type FreightLogoProps = {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
};

const FreightLogo: React.FC<FreightLogoProps> = ({ name, size = 'md' }) => {
  const cleanName = name.toLowerCase().trim();
  
  // Get logo URL and fallback
  const logoInfo = Object.entries(forwarderLogos).find(([key, _]) => 
    cleanName.includes(key.toLowerCase())
  );
  
  const logoUrl = logoInfo ? logoInfo[1].url : null;
  
  // Size classes
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
  
  // If no logo found, render initials
  if (!logoUrl) {
    const initials = name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-secondary/30 flex items-center justify-center text-white font-bold text-xs`}>
        {initials}
      </div>
    );
  }
  
  return (
    <div className={`${sizeClasses[size]} rounded-full bg-white flex items-center justify-center overflow-hidden border border-mint/10`}>
      <img 
        src={logoUrl} 
        alt={`${name} logo`} 
        className="w-full h-full object-contain p-0.5" 
      />
    </div>
  );
};

export default FreightLogo;
