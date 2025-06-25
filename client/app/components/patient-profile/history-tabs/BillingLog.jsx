
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Printer } from 'lucide-react'; 
import { format } from 'date-fns';

export default function BillingLog({ bills }) {
  if (!bills || bills.length === 0) {
    return <p className="text-muted-foreground p-4 text-center">No billing history available.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Bill ID</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bills.sort((a, b) => new Date(b.date) - new Date(a.date)).map((bill) => (
            <TableRow key={bill.id}>
              <TableCell>{format(new Date(bill.date), 'MM/dd/yyyy')}</TableCell>
              <TableCell>{bill.id}</TableCell>
              <TableCell>${bill.totalAmount.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant={bill.status === 'Paid' ? 'default' : 'destructive'}
                 className={bill.status === 'Paid' ? 'bg-accent text-accent-foreground' : ''}
                >
                  {bill.status}
                </Badge>
              </TableCell>
              <TableCell className="space-x-1">
                <Button variant="ghost" size="icon" onClick={() => alert(`Viewing details for bill ${bill.id}`)} title="View Bill Details">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" title="Print Invoice">
                  <Printer className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
