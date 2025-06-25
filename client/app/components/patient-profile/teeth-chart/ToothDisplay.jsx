
'use client';

import { toothImageMapping } from "@/app/lib/dentalData";
import Image from "next/image";

export default function ToothDisplay({ toothNumber, status, onClick, isSelected }) {
  let bgColor = 'bg-card hover:bg-secondary';
  let textColor = 'text-card-foreground';
  let borderColor = '';

  if (status === 'in-progress') {
    bgColor = 'bg-blue-400 hover:bg-blue-500'; // Using specific blue as theme primary is light
    textColor = 'text-white';
    borderColor = 'border-blue-700';
  } else if (status === 'completed') {
    bgColor = 'bg-green-400 hover:bg-green-500'; // Using theme accent (teal)
    textColor = 'text-white';
    borderColor = 'border-green-700';
  }

  if (isSelected) {
    borderColor = 'border-blue-600 border-2';
  }

    const imageUrl = toothImageMapping[toothNumber] || 'https://placehold.co/40x48.png'; // Fallback placeholder


  return (
    <button
      onClick={onClick}
      aria-label={`Tooth ${toothNumber}`}
      className={`py-1 px-2 flex flex-col items-center justify-center rounded-md transition-all duration-150 ease-in-out  ${borderColor} transform hover:scale-105 shadow-sm ${bgColor} ${textColor}`}
    >
      {/* Placeholder for a tooth icon/image - for now, just a shape */}
      <Image src={imageUrl} width={40} height={40} alt={`Tooth ${toothNumber}`} className="w-10 h-10 bg-current  rounded-sm mb-0.5" />
      <span className="text-xs font-medium">{toothNumber}</span>
    </button>
  );
}
