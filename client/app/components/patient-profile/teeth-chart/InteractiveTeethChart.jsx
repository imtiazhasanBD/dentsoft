
'use client';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ToothDisplay from './ToothDisplay';
import { PERMANENT_TEETH, DECIDUOUS_TEETH } from '@/app/lib/dentalData';

export default function InteractiveTeethChart({ teethStatus, onToothSelect, selectedTeeth }) {
  const [activeTab, setActiveTab] = useState('permanent');

  const renderQuadrant = (quadrantName, teethNumbers, statusMap) => (
   <div className="flex flex-col items-center mx-1">
      <div className="text-xs font-medium text-muted-foreground mb-1">{quadrantName}</div>
      <div className={`flex gap-2 ${quadrantName.includes('R') ? 'flex-row' : 'flex-row'}`}>
        {teethNumbers.map(num => (
          <ToothDisplay
            key={num}
            toothNumber={num.toString()}
            status={statusMap[num]?.status || 'healthy'}
            isSelected={selectedTeeth.includes(num.toString())}
            onClick={() => onToothSelect(num.toString())}
          />
        ))}
      </div>
    </div>
  );
  
  const renderArch = (qLeftName, qLeftTeeth, qRightName, qRightTeeth, statusMap) => (
    <div className="flex justify-center items-start my-2">
      {renderQuadrant(qLeftName, qLeftTeeth, statusMap)}
      <div className="self-center border-l-2 border-muted-foreground h-10 mx-1 sm:mx-2"></div>
      {renderQuadrant(qRightName, qRightTeeth, statusMap)}
    </div>
  );

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="permanent">Permanent Teeth</TabsTrigger>
        <TabsTrigger value="deciduous">Deciduous Teeth</TabsTrigger>
      </TabsList>
      <TabsContent value="permanent">
        <div className="p-2 rounded-lg border bg-card shadow">
          {renderArch('Upper Right (1)', PERMANENT_TEETH.UR, 'Upper Left (2)', PERMANENT_TEETH.UL, teethStatus)}
          <hr className="my-4 border-dashed border-border"/>
          {renderArch('Lower Right (4)', PERMANENT_TEETH.LR, 'Lower Left (3)', PERMANENT_TEETH.LL, teethStatus)}
        </div>
      </TabsContent>
      <TabsContent value="deciduous">
         <div className="p-2 rounded-lg border bg-card shadow">
          {renderArch('UR (5)', DECIDUOUS_TEETH.UR, 'UL (6)', DECIDUOUS_TEETH.UL, teethStatus)}
          <hr className="my-2 border-dashed border-border"/>
          {renderArch('LR (8)', DECIDUOUS_TEETH.LR, 'LL (7)', DECIDUOUS_TEETH.LL, teethStatus)}
        </div>
      </TabsContent>
    </Tabs>
  );
}
