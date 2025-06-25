
import ActionCard from './quick-actions/ActionCard';
import { FileEdit, Receipt, ScanLine, StickyNote } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';

export default function QuickActionsPanel({ patientData, onUpdatePatientData }) {
  const [isMedicalHistoryOpen, setIsMedicalHistoryOpen] = useState(false);
  const [medicalHistoryText, setMedicalHistoryText] = useState('');

  const [isAddBillOpen, setIsAddBillOpen] = useState(false);
  const [billDate, setBillDate] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [billDescription, setBillDescription] = useState('');

  const [isAddXRayOpen, setIsAddXRayOpen] = useState(false);
  const [xrayDate, setXrayDate] = useState('');
  const [xrayType, setXrayType] = useState('');
  
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    setMedicalHistoryText(patientData.medicalHistory || '');
  }, [patientData.medicalHistory]);

  useEffect(() => {
    // Set default date to today for new entries, client-side
    const today = new Date().toISOString().split('T')[0];
    if (isAddBillOpen && !billDate) {
      setBillDate(today);
    }
    if (isAddXRayOpen && !xrayDate) {
      setXrayDate(today);
    }
  }, [isAddBillOpen, isAddXRayOpen, billDate, xrayDate]);


  const handleSaveMedicalHistory = () => {
    onUpdatePatientData({ ...patientData, medicalHistory: medicalHistoryText });
    setIsMedicalHistoryOpen(false);
  };

  const handleSaveBill = () => {
    const newBill = {
      id: `BILL${Date.now()}`,
      date: billDate || new Date().toISOString().split('T')[0], // Ensure date is set
      items: [{ description: billDescription, amount: parseFloat(billAmount) || 0 }],
      totalAmount: parseFloat(billAmount) || 0,
      status: 'Pending'
    };
    onUpdatePatientData({ ...patientData, bills: [...patientData.bills, newBill] });
    setIsAddBillOpen(false);
    setBillAmount(''); setBillDescription(''); setBillDate('');
  };
  
  const handleSaveXRay = () => {
    const newXRay = {
      id: `XRAY${Date.now()}`,
      date: xrayDate || new Date().toISOString().split('T')[0], // Ensure date is set
      type: xrayType,
      url: 'https://placehold.co/300x200.png', 
      dataAiHint: 'dental xray'
    };
    onUpdatePatientData({ ...patientData, xrays: [...patientData.xrays, newXRay] });
    setIsAddXRayOpen(false);
    setXrayType(''); setXrayDate('');
  };

  const handleSaveNote = () => {
    const newNote = {
      id: `NOTE${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      content: noteContent
    };
    onUpdatePatientData({ ...patientData, notes: [...patientData.notes, newNote] });
    setIsAddNoteOpen(false);
    setNoteContent('');
  };


  return (
    <div className="space-y-6">
      {/* Medical History */}
      <Dialog open={isMedicalHistoryOpen} onOpenChange={setIsMedicalHistoryOpen}>
        <DialogTrigger asChild>
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium font-headline">Medical History</CardTitle>
              <FileEdit className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground truncate">{medicalHistoryText || 'No medical history recorded.'}</p>
              <Button variant="link" className="p-0 h-auto mt-2 text-primary">View/Edit</Button>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Medical History</DialogTitle>
            <DialogDescription>View or update patient's medical history.</DialogDescription>
          </DialogHeader>
          <Textarea 
            value={medicalHistoryText} 
            onChange={(e) => setMedicalHistoryText(e.target.value)}
            rows={10}
            className="my-4"
          />
          <DialogFooter>
            <Button onClick={handleSaveMedicalHistory}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Bill */}
      <Dialog open={isAddBillOpen} onOpenChange={(isOpen) => { setIsAddBillOpen(isOpen); if (!isOpen) setBillDate(''); }}>
        <DialogTrigger asChild>
            <ActionCard title="Add Bill" icon={Receipt} buttonText="Create New Bill" onAction={() => setIsAddBillOpen(true)} />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Add New Bill</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div><Label htmlFor="billDate">Date</Label><Input id="billDate" type="date" value={billDate} onChange={e => setBillDate(e.target.value)} /></div>
            <div><Label htmlFor="billDesc">Description</Label><Input id="billDesc" value={billDescription} onChange={e => setBillDescription(e.target.value)} placeholder="e.g., Consultation Fee"/></div>
            <div><Label htmlFor="billAmount">Amount</Label><Input id="billAmount" type="number" value={billAmount} onChange={e => setBillAmount(e.target.value)} placeholder="e.g., 75.00"/></div>
          </div>
          <DialogFooter><Button onClick={handleSaveBill}>Save Bill</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add X-Ray */}
      <Dialog open={isAddXRayOpen} onOpenChange={(isOpen) => { setIsAddXRayOpen(isOpen); if (!isOpen) setXrayDate(''); }}>
        <DialogTrigger asChild>
            <ActionCard title="Add X-Ray" icon={ScanLine} buttonText="Upload X-Ray" onAction={() => setIsAddXRayOpen(true)} dataAiHint="dental technology" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Add New X-Ray</DialogTitle></DialogHeader>
           <div className="grid gap-4 py-4">
            <div><Label htmlFor="xrayDate">Date</Label><Input id="xrayDate" type="date" value={xrayDate} onChange={e => setXrayDate(e.target.value)} /></div>
            <div><Label htmlFor="xrayType">Type/Description</Label><Input id="xrayType" value={xrayType} onChange={e => setXrayType(e.target.value)} placeholder="e.g., Panoramic, Bitewing Right Side"/></div>
            <p className="text-sm text-muted-foreground">X-Ray image upload feature is not implemented in this demo. A placeholder image will be used.</p>
          </div>
          <DialogFooter><Button onClick={handleSaveXRay}>Save X-Ray</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Note */}
      <Dialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen}>
        <DialogTrigger asChild>
            <ActionCard title="Add Note" icon={StickyNote} buttonText="Create New Note" onAction={() => setIsAddNoteOpen(true)} />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Add New Note</DialogTitle></DialogHeader>
           <Textarea 
            value={noteContent} 
            onChange={(e) => setNoteContent(e.target.value)}
            rows={6}
            className="my-4"
            placeholder="Enter patient note here..."
          />
          <DialogFooter><Button onClick={handleSaveNote}>Save Note</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
