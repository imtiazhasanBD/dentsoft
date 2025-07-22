import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileEdit, FileText } from 'lucide-react';

export default function PrescriptionLog({ prescriptions, onEditPrescription }) {
  if (!prescriptions || prescriptions.length === 0) {
    return <p className="text-muted-foreground p-4 text-center">No prescription history available.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Tooth/Teeth</TableHead>
            <TableHead>Medicines</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prescriptions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((prescription) => (
            <TableRow key={prescription._id}>
              <TableCell>
                {new Date(prescription.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {prescription.toothNumbers?.join(', ') || 'N/A'}
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  {prescription.medicines.map((medicine, index) => (
                    <div key={medicine._id || index} className="text-sm">
                      <span className="font-medium">{medicine.name}</span>
                      <span className="text-muted-foreground ml-2">
                        ({medicine.frequency}, {medicine.mealTiming})
                      </span>
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                {prescription.medicines.length > 0 ? (
                  <div className="space-y-1">
                    {prescription.medicines.map((medicine, index) => (
                      <div key={medicine._id || index} className="text-sm">
                        {medicine.duration}
                      </div>
                    ))}
                  </div>
                ) : 'N/A'}
              </TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onEditPrescription(prescription)} 
                  title="Edit Prescription"
                >
                  <FileEdit className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}