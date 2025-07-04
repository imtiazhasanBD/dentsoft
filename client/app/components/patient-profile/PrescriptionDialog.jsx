"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, Printer, CalendarIcon } from "lucide-react";
import PrintablePrescription from "./PrintablePrescription";
import { useReactToPrint } from "react-to-print";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  drugTemplates,
  timingOptions,
  mealTimingOptions,
  durationOptions,
} from "@/app/lib/dentalData";
import { cn } from "@/lib/utils";
import PrescriptionTreatmentSummary from "./PrescriptionTreatmentSummary";
import DateTimePickerDialog from "../appointment/create-appt/DateTimePicker";
import { getBengaliTimeOfDay } from "@/app/utils/date";

const initialMedicineInput = {
  name: "",
  frequency: "",
  duration: "",
  mealTiming: "",
};

export default function PrescriptionDialog({
  open,
  onOpenChange,
  treatment,
  patient,
  existingPrescription,
  onSavePrescription,
}) {
  const [medicines, setMedicines] = useState([]);
  const [currentMedicineInput, setCurrentMedicineInput] =
    useState(initialMedicineInput);
  const [problem, setProblem] = useState("");
  const [nextAppointmentDate, setNextAppointmentDate] = useState(null);
  const [nextAppointmentTime, setNextAppointmentTime] = useState(null);
  const printableComponentRef = useRef();
  const timeOfDay = getBengaliTimeOfDay(nextAppointmentTime);


  useEffect(() => {
    if (open) {
      if (existingPrescription) {
        setMedicines(existingPrescription.medicines || []);
        setProblem(existingPrescription.problem || "");
        setNextAppointmentDate(
          existingPrescription.nextAppointmentDate
            ? new Date(existingPrescription.nextAppointmentDate)
            : null
        );
      } else if (treatment) {
        const firstDetail =
          treatment.toothSpecificDetails && treatment.toothSpecificDetails[0];
        setProblem(
          treatment.notes ||
            (firstDetail
              ? `Regarding treatment for tooth ${firstDetail.toothNumber}: ${firstDetail.diagnosis}`
              : "N/A")
        );
        setMedicines([]);
        setNextAppointmentDate(null);
      } else {
        setProblem("");
        setMedicines([]);
        setNextAppointmentDate(null);
      }
      setCurrentMedicineInput(initialMedicineInput);
    }
  }, [existingPrescription, treatment, open]);

  const handleCurrentMedicineInputChange = (field, value) => {
    setCurrentMedicineInput((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddMedicine = () => {
    if (!currentMedicineInput.name) {
      alert("Please enter medicine name and dosage.");
      return;
    }
    setMedicines([
      ...medicines,
      { ...currentMedicineInput, id: `med-${Date.now()}` },
    ]);
    setCurrentMedicineInput(initialMedicineInput); // Reset for next entry
  };

  const removeMedicineRow = (idToRemove) => {
    setMedicines(medicines.filter((med) => med.id !== idToRemove));
  };

  const handlePrint = useReactToPrint({
    documentTitle: "Title",
    contentRef: printableComponentRef,
  });

  const handleSubmit = () => {
    const prescriptionData = {
      id: existingPrescription?.id || `PRES${Date.now()}`,
      treatmentId: treatment?._id,
      patientId: patient._id,
      toothNumbers: treatment?.toothNumbers || [],
      date:
        existingPrescription?.date || new Date().toISOString().split("T")[0],
      problem,
      medicines: medicines.filter((m) => m.name.trim() !== ""),
      nextAppointmentDate: nextAppointmentDate
        ? format(nextAppointmentDate, "yyyy-MM-dd")
        : null,
      nextAppointmentTime  
    };
    onSavePrescription(prescriptionData);
    onOpenChange(false); // Close the sheet
  };
console.log(treatment)
  if (!treatment || !patient) return null;

  const displayToothNumbersString = treatment.toothNumbers
    ? treatment.toothNumbers.join(", ")
    : "N/A";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="sm:max-w-full w-full flex flex-col p-0"
        side="right"
      >
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="font-headline text-2xl">
            Prescription for{" "}
            {treatment.toothNumbers && treatment.toothNumbers.length > 1
              ? "Teeth"
              : "Tooth"}{" "}
            {displayToothNumbersString}
          </SheetTitle>
          <SheetDescription>
            Patient: {patient.name}. Add medicines, set next appointment, and
            print.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-grow overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Add Medicine Section */}
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-semibold">Add Medicine</h3>
              <div className="flex gap-2 justify-between items-center">
                <div>
                  <Label htmlFor="medName">Medicine</Label>
                  <Select
                    onValueChange={(value) =>
                      handleCurrentMedicineInputChange("name", value)
                    }
                    value={currentMedicineInput.name}
                  >
                    <SelectTrigger id="medName">
                      <SelectValue placeholder="Choose a medicine" />
                    </SelectTrigger>
                    <SelectContent>
                      {drugTemplates.map((drug) => (
                        <SelectItem key={drug.id} value={drug.name}>
                          {drug.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="medTiming">Timing</Label>
                  <Select
                    onValueChange={(value) =>
                      handleCurrentMedicineInputChange("frequency", value)
                    }
                    value={currentMedicineInput.frequency}
                  >
                    <SelectTrigger id="medTiming">
                      <SelectValue placeholder="Select timing" />
                    </SelectTrigger>
                    <SelectContent>
                      {timingOptions.map((opt) => (
                        <SelectItem key={opt.id} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="medMealTiming">Meal Timing</Label>
                  <Select
                    onValueChange={(value) =>
                      handleCurrentMedicineInputChange("mealTiming", value)
                    }
                    value={currentMedicineInput.mealTiming}
                  >
                    <SelectTrigger id="medMealTiming">
                      <SelectValue placeholder="Select meal timing" />
                    </SelectTrigger>
                    <SelectContent>
                      {mealTimingOptions.map((opt) => (
                        <SelectItem key={opt.id} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="medDuration">Duration</Label>
                  <Select
                    onValueChange={(value) =>
                      handleCurrentMedicineInputChange("duration", value)
                    }
                    value={currentMedicineInput.duration}
                  >
                    <SelectTrigger id="medDuration">
                      <SelectValue placeholder="Choose a duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {durationOptions.map((opt) => (
                        <SelectItem key={opt.id} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleAddMedicine}
                  className="w-full md:w-auto"
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add to Prescription
                </Button>
              </div>
            </div>
            <div className="flex  bg-blue-50 pl-10 overflow-y-auto">
              {/* Treatment Plan Summary */}

              <PrescriptionTreatmentSummary
                toothSpecificDetails={treatment?.toothSpecificDetails}
                generalTests={treatment?.generalTests}
                medicalDrugHistory={treatment?.medicalDrugHistory}
              />

              {/* Prescription Preview (Medicines Rx) */}
              <div className="w-1/2 pl-6">
                <h3 className="text-3xl font-semibold mb-4">Rx.</h3>

                <div className="space-y-4 text-sm">
                  <ScrollArea className="h-96">
                    <div className="space-y-3 pr-2">
                      {medicines.map((med) => (
                        <div
                          key={med.id}
                          className="flex justify-between items-start p-3 border rounded-md bg-muted/20"
                        >
                          <div>
                            <p className="font-medium">
                              {med.name} - {med.dosage}
                            </p>
                            <p className="text-base text-muted-foreground">
                              {med.frequency} ------- {med.mealTiming} -------{" "}
                              {med.duration}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeMedicineRow(med.id)}
                            className="h-7 w-7 flex-shrink-0"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {nextAppointmentDate && (
                    <p className="font-bold mt-4">
                     **{format(new Date(nextAppointmentDate), "dd MMM, yyyy")} {timeOfDay} {nextAppointmentTime} আসবেন।**
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Next Appointment Date */}
            <div className="border rounded-lg p-4">
              <Label htmlFor="nextAppointmentDate">Next Appointment Date</Label>
              <DateTimePickerDialog
                date={nextAppointmentDate}
                setDate={setNextAppointmentDate}
                time={nextAppointmentTime}
                setTime={setNextAppointmentTime}
              />
            </div>
          </div>
        </ScrollArea>

        <SheetFooter className="p-6 border-t mt-auto">
          <div className="flex w-full justify-between items-center">
            <div>
              {/* Preview might be implicit now, or could open a static view */}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePrint}>
                Print
              </Button>
              <SheetClose asChild>
                <Button variant="ghost">Cancel</Button>
              </SheetClose>
              <Button onClick={handleSubmit}>Save Prescription</Button>
            </div>
          </div>
        </SheetFooter>

        <div className="hidden">
          <PrintablePrescription
            ref={printableComponentRef}
            patient={patient}
            treatment={treatment}
            prescription={{
              id: existingPrescription?.id || `PRES_PRINT_${Date.now()}`,
              date:
                existingPrescription?.date ||
                new Date().toISOString().split("T")[0],
              problem,
              medicines,
              toothNumbers: treatment?.toothNumbers,
              nextAppointmentDate: nextAppointmentDate,
              nextAppointmentTime: nextAppointmentTime,
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
