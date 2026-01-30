
import { Users } from 'lucide-react';

interface ArchetypeCardProps {
  archetype: {
    archetype_name: string;
    estimated_percentage: number;
    description: string;
    typical_responses?: { question_id: string; typical_choice: string }[];
  };
}

export const ArchetypeCard = ({ archetype }: ArchetypeCardProps) => (
  <div className="flex flex-col p-6 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 relative overflow-hidden group hover:border-[#FF3B00]/40 transition-all duration-300 h-full">
    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF3B00]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#FF3B00]/10 transition-colors" />

    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className="flex-1 pr-4">
        <div className="flex items-center gap-2 mb-2">
           <div className="p-1.5 rounded-lg bg-white/5 text-gray-400 group-hover:text-white group-hover:bg-white/10 transition-colors">
             <Users size={16} />
           </div>
           <h4 className="font-bold text-gray-200 font-display text-sm tracking-wide">{archetype.archetype_name}</h4>
        </div>
      </div>
      <div className="text-3xl font-bold font-mono text-[#FF3B00]">{Math.round(archetype.estimated_percentage)}%</div>
    </div>

    <p className="text-sm text-gray-400 leading-relaxed font-light border-t border-white/5 pt-3 mb-4 flex-grow">
      {archetype.description}
    </p>

    {/* Typical Responses Pills */}
    {archetype.typical_responses && archetype.typical_responses.length > 0 && (
       <div className="flex flex-wrap gap-2 mt-auto">
          {archetype.typical_responses.slice(0, 3).map((resp, idx) => (
             <span key={idx} className="text-[10px] px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-500 font-mono truncate max-w-full">
               {resp.typical_choice}
             </span>
          ))}
       </div>
    )}
  </div>
);