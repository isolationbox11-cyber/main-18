import React from "react";
import Image from 'next/image';

export function AvatarBadge() {
  return (
    <div className="flex items-center gap-2" aria-label="User avatar badge">
  <Image src="/placeholder-user.jpg" alt="Avatar" className="w-8 h-8 rounded-full border border-white/20" width={32} height={32} />
      <span className="text-sm text-primary">Cyber Explorer</span>
    </div>
  );
}
