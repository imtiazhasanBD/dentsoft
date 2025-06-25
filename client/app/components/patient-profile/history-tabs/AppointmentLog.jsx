
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function AppointmentLog({ appointments }) {
  if (!appointments || appointments.length === 0) {
    return <p className="text-muted-foreground p-4 text-center">No appointment history available.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.sort((a, b) => new Date(b.date) - new Date(a.date)).map((appt) => (
            <TableRow key={appt.id}>
              <TableCell>{new Date(appt.date).toLocaleDateString()}</TableCell>
              <TableCell>{appt.time}</TableCell>
              <TableCell>{appt.reason}</TableCell>
              <TableCell>
                <Badge variant={appt.status === 'Completed' ? 'default' : appt.status === 'Scheduled' ? 'secondary' : 'outline'}
                  className={appt.status === 'Completed' ? 'bg-accent text-accent-foreground' : appt.status === 'Scheduled' ? 'bg-yellow-500 text-white' : ''}
                >
                  {appt.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
