import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TreatmentLog from "./history-tabs/TreatmentLog";
import AppointmentLog from "./history-tabs/AppointmentLog";
import BillingLog from "./history-tabs/BillingLog";
import { CalendarDays, ClipboardList, Receipt } from "lucide-react";
import { mockPatient } from "@/app/lib/dentalData";
import PrescriptionLog from "./history-tabs/PrescriptionLog";

export default function HistoryTabsSection({
  patientData,
  onEditTreatment,
  onOpenPrescription
}) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Patient History</CardTitle>
        <CardDescription className="font-body">
          Overview of treatments, appointments, and billing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="treatments" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="treatments">
              <ClipboardList className="h-4 w-4 mr-2" /> Treatments
            </TabsTrigger>
            <TabsTrigger value="prescriptions">
              <ClipboardList className="h-4 w-4 mr-2" /> Prescriptions
            </TabsTrigger>
            <TabsTrigger value="appointments">
              <CalendarDays className="h-4 w-4 mr-2" /> Appointments
            </TabsTrigger>
            <TabsTrigger value="bills">
              <Receipt className="h-4 w-4 mr-2" /> Bills
            </TabsTrigger>
          </TabsList>
          <TabsContent value="treatments">
            <TreatmentLog
              treatments={patientData.treatments}
              onEditTreatment={onEditTreatment}
              onOpenPrescription={onOpenPrescription}
            />
          </TabsContent>
          <TabsContent value="prescriptions">
            <PrescriptionLog
              prescriptions={patientData.prescriptions}
              onEditPrescription={onOpenPrescription}
            />
          </TabsContent>
          <TabsContent value="appointments">
            <AppointmentLog appointments={patientData.appointments} />
          </TabsContent>
          <TabsContent value="bills">
            <BillingLog bills={mockPatient.bills} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
