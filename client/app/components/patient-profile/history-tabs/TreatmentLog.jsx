import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileEdit, FileText } from 'lucide-react';

export default function TreatmentLog({ treatments, onEditTreatment, onOpenPrescription }) {
  if (!treatments || treatments.length === 0) {
    return <p className="text-muted-foreground p-4 text-center">No treatment history available.</p>;
  }
console.log(treatments);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Tooth/Teeth</TableHead>
            <TableHead>Info</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {treatments.sort((a, b) => new Date(b.date) - new Date(a.date)).map((treatment) => {
            const primaryDetail = treatment.toothSpecificDetails && treatment.toothSpecificDetails[0];
            const displayInfo = primaryDetail 
              ? `${primaryDetail.procedure || 'N/A'}`
              :  (treatment.procedure || 'N/A');

            return (
              <TableRow key={treatment.id}>
                <TableCell>{new Date(treatment.date).toLocaleDateString()}</TableCell>
                <TableCell>{treatment.toothNumbers ? treatment.toothNumbers.join(', ') : 'N/A'}</TableCell>
                <TableCell>{displayInfo}</TableCell>
                <TableCell>{treatment.totalCost}</TableCell>
                <TableCell>
                  <Badge variant={treatment.status === 'completed' ? 'default' : treatment.status === 'in-progress' ? 'secondary' : 'outline'}
                   className={treatment.status === 'completed' ? 'bg-accent text-accent-foreground' : treatment.status === 'in-progress' ? 'bg-blue-500 text-white' : ''}
                  >
                    {treatment.status}
                  </Badge>
                </TableCell>
                <TableCell className="space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => onEditTreatment(treatment)} title="Edit Treatment">
                    <FileEdit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onOpenPrescription(treatment)} title={treatment.prescriptionId ? "View/Edit Prescription" : "Add Prescription"}>
                    <FileText className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

    