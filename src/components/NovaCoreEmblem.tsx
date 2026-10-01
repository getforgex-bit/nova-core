import React from 'react';

interface NovaCoreEmblemProps {
  className?: string;
  size?: number;
  dark?: boolean;
}

export const NovaCoreEmblem: React.FC<NovaCoreEmblemProps> = ({
  className = '',
  size = 36,
  dark = false,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-label="Emblema Nova Core"
    >
      <img
        src="/nova_core_emblem.svg"
        alt="Nova Core Swiss Engineering Emblem"
        width={size}
        height={size}
        className={`w-full h-full object-contain ${dark ? 'invert' : ''}`}
        loading="eager"
      />
    </div>
  );
};
