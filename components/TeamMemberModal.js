'use client';

import { X, User } from 'lucide-react';
import { useEffect } from 'react';

const TeamMemberModal = ({ member, onClose }) => {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!member) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass dark:glass rounded-xl shadow-2xl animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg glass hover:bg-primary/20 transition-all duration-300 z-10"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-foreground" />
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Top Section: Name & Image */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
            {/* Left: Name and Title */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-foreground mb-2">{member.name}</h2>
              <p className="text-xl text-[#2E5CB8] font-semibold">{member.role}</p>
            </div>

            {/* Right: Image */}
            <div className="flex-shrink-0">
              <div className="w-40 h-40 rounded-lg glass flex items-center justify-center overflow-hidden">
                {member.image ? (
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-20 h-20 text-primary/40" />
                )}
              </div>
            </div>
          </div>

          {/* Biography */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-foreground mb-4">Biography</h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {member.bio.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberModal;
