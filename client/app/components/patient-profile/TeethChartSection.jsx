
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InteractiveTeethChart from './teeth-chart/InteractiveTeethChart';
import { Button } from '@/components/ui/button';

export default function TeethChartSection({ teethStatus, onToothSelect, selectedTeeth, onOpenNewTreatmentDialog }) {
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="font-headline">Teeth Chart</CardTitle>
        {selectedTeeth && selectedTeeth.length > 0 && (
          <Button onClick={onOpenNewTreatmentDialog} size="sm">
            Start Treatment ({selectedTeeth.length} {selectedTeeth.length === 1 ? 'Tooth' : 'Teeth'})
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <InteractiveTeethChart 
          teethStatus={teethStatus}
          onToothSelect={onToothSelect}
          selectedTeeth={selectedTeeth} // Changed from selectedTooth
        />
      </CardContent>
    </Card>
  );
}
