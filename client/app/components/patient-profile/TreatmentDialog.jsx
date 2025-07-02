"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import MultiSelectInput from "./shared/MultiSelectInput";
import {
  chiefComplaintOptions,
  clinicalFindingOptions,
  diagnosisOptions,
  procedureOptions,
  procedureCosts,
} from "@/app/lib/dentalData";

const calculateIndividualToothCost = (procedures) => {
  if (!Array.isArray(procedures)) return 0;
  return procedures.reduce((sum, procName) => {
    return (
      sum +
      (procedureCosts[procName] || procedureCosts["Default Procedure"] || 0)
    );
  }, 0);
};

const getDefaultToothDetail = (toothNumber) => ({
  toothNumber: toothNumber.toString(),
  chiefComplaint: [],
  clinicalFindings: [],
  diagnosis: [],
  procedure: [],
  notes: "",
  cost: 0,
});

export default function TreatmentDialog({
  open,
  onOpenChange,
  toothNumbers,
  existingTreatment,
  onSaveTreatment,
  onOpenPrescription,
}) {
  const [overallStatus, setOverallStatus] = useState("in-progress");
  const [overallNotes, setOverallNotes] = useState("");
  const [medicalDrugHistory, setMedicalDrugHistory] = useState("");
  const [toothSpecificDetails, setToothSpecificDetails] = useState([]);
  const [generalTests, setGeneralTests] = useState([]);

  const importantChiefComplaints = chiefComplaintOptions.filter(o => o.important).map(o => o.name);
  const allChiefComplaints = chiefComplaintOptions.map(o => o.name);
  
  const importantClinicalFindings = clinicalFindingOptions.filter(o => o.important).map(o => o.name);
  const allClinicalFindings = clinicalFindingOptions.map(o => o.name);

  const importantDiagnosisOptions = diagnosisOptions.filter(o => o.important).map(o => o.name);
  const allDiagnosisOptions = diagnosisOptions.map(o => o.name);
  
  const importantProcedureOptions = procedureOptions.filter(o => o.important).map(o => o.name);
  const allProcedureOptions = procedureOptions.map(o => o.name);


  useEffect(() => {
    if (open) {
      if (existingTreatment) {
        setOverallStatus(existingTreatment.status || 'in-progress');
        setOverallNotes(existingTreatment.notes || '');
        setGeneralTests(existingTreatment.generalTests || []);
        setToothSpecificDetails(
          existingTreatment.toothSpecificDetails && existingTreatment.toothSpecificDetails.length > 0
            ? existingTreatment.toothSpecificDetails.map(detail => ({ 
                ...getDefaultToothDetail(detail.toothNumber), 
                ...detail,
                chiefComplaint: Array.isArray(detail.chiefComplaint) ? detail.chiefComplaint : (detail.chiefComplaint ? [detail.chiefComplaint] : []),
                clinicalFindings: Array.isArray(detail.clinicalFindings) ? detail.clinicalFindings : (detail.clinicalFindings ? [detail.clinicalFindings] : []),
                diagnosis: Array.isArray(detail.diagnosis) ? detail.diagnosis : (detail.diagnosis ? [detail.diagnosis] : []),
                procedure: Array.isArray(detail.procedure) ? detail.procedure : (detail.procedure ? [detail.procedure] : []),
                cost: detail.cost || calculateIndividualToothCost(Array.isArray(detail.procedure) ? detail.procedure : (detail.procedure ? [detail.procedure] : [])),
              }))
            : (existingTreatment.toothNumbers || toothNumbers || []).map(tn => getDefaultToothDetail(tn))
        );
      } else if (toothNumbers && toothNumbers.length > 0) {
        setToothSpecificDetails(toothNumbers.map(tn => getDefaultToothDetail(tn)));
        setOverallStatus('in-progress');
        setOverallNotes('');
        setGeneralTests([]);
      } else {
        setToothSpecificDetails([]);
        setOverallStatus('in-progress');
        setOverallNotes('');
        setGeneralTests([]);
      }
    }
  }, [existingTreatment, toothNumbers, open]);

  const handleToothDetailChange = (index, field, value) => {
    const updatedDetails = toothSpecificDetails.map((detail, i) => {
      if (i === index) {
        const newDetail = { ...detail, [field]: value };
        if (field === 'procedure') {
          newDetail.cost = calculateIndividualToothCost(value);
        }
        return newDetail;
      }
      return detail;
    });
    setToothSpecificDetails(updatedDetails);
  };

  const handleSubmit = () => {
    if (!toothSpecificDetails.length) {
      console.error("No teeth details to save.");
      return;
    }
    const currentToothNumbers = toothSpecificDetails.map(td => td.toothNumber);
    const totalCalculatedCost = toothSpecificDetails.reduce((sum, detail) => sum + (detail.cost || 0), 0);

    const treatmentData = {
      id: existingTreatment?.id || `T${Date.now()}`,
      toothNumbers: currentToothNumbers,
      status: overallStatus,
      notes: overallNotes, 
      date: existingTreatment?.date || new Date().toISOString().split('T')[0],
      toothSpecificDetails: toothSpecificDetails,
      totalCost: totalCalculatedCost,
      generalTests: generalTests,
      ...(existingTreatment?.prescriptionId && { prescriptionId: existingTreatment.prescriptionId }),
      medicalDrugHistory
    };
    onSaveTreatment(treatmentData);
    onOpenChange(false); 
  };
  
  const handleOpenPrescription = () => {
     if (!toothSpecificDetails.length) {
      console.error("No teeth details to base prescription on.");
      return;
    }
    const currentToothNumbers = toothSpecificDetails.map(td => td.toothNumber);
    const treatmentForPrescription = {
      id: existingTreatment?.id || `T${Date.now()}_presc_temp`, 
      toothNumbers: currentToothNumbers,
      status: overallStatus,
      notes: overallNotes,
      date: existingTreatment?.date || new Date().toISOString().split('T')[0],
      toothSpecificDetails: toothSpecificDetails,
      generalTests: generalTests,
      ...(existingTreatment?.prescriptionId && { prescriptionId: existingTreatment.prescriptionId }),
      medicalDrugHistory
    };
    onOpenPrescription(treatmentForPrescription);
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl bg-card h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-headline">
            {existingTreatment ? "Edit Treatment" : "Add Treatment"} for{" "}
            {toothSpecificDetails.length > 1 ? "Teeth" : "Tooth"}{" "}
            {toothSpecificDetails.map((td) => td.toothNumber).join(", ")}
          </DialogTitle>
          <DialogDescription>
            Log details for the selected{" "}
            {toothSpecificDetails.length > 1 ? "teeth" : "tooth"}.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-grow pr-6 -mr-6 overflow-y-auto">
          <div className="space-y-4 py-4">
            <Accordion
              type="multiple"
              defaultValue={toothSpecificDetails.map(
                (_, idx) => `tooth-${idx}`
              )}
              className="w-full"
            >
              {toothSpecificDetails.map((detail, index) => (
                <AccordionItem
                  value={`tooth-${index}`}
                  key={detail.toothNumber || index}
                >
                  <AccordionTrigger className="font-semibold">
                    Treatment for Tooth {detail.toothNumber}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 p-2 border rounded-md">
                      <MultiSelectInput
                        label="Chief Complaint"
                        placeholder="Type or select complaint..."
                        selectedItems={detail.chiefComplaint || []}
                        onChange={(items) =>
                          handleToothDetailChange(
                            index,
                            "chiefComplaint",
                            items
                          )
                        }
                        suggestions={importantChiefComplaints}
                        allAvailableSuggestions={allChiefComplaints}
                      />
                      <MultiSelectInput
                        label="Clinical Findings"
                        placeholder="Type or select findings..."
                        selectedItems={detail.clinicalFindings || []}
                        onChange={(items) =>
                          handleToothDetailChange(
                            index,
                            "clinicalFindings",
                            items
                          )
                        }
                        suggestions={importantClinicalFindings}
                        allAvailableSuggestions={allClinicalFindings}
                      />
                      <MultiSelectInput
                        label="Investigation"
                        placeholder="Type or select investigation..."
                        selectedItems={detail.diagnosis || []}
                        onChange={(items) =>
                          handleToothDetailChange(index, "diagnosis", items)
                        }
                        suggestions={importantDiagnosisOptions}
                        allAvailableSuggestions={allDiagnosisOptions}
                      />
                      <MultiSelectInput
                        label="Treatment Plan"
                        placeholder="Type or select Treatment Plan..."
                        selectedItems={detail.procedure || []}
                        onChange={(items) =>
                          handleToothDetailChange(index, "procedure", items)
                        }
                        suggestions={importantProcedureOptions}
                        allAvailableSuggestions={allProcedureOptions}
                      />
                      <div className="p-2 bg-muted rounded-md">
                        <Label className="font-semibold">
                          Cost for Tooth {detail.toothNumber}:
                        </Label>
                        <p className="text-lg text-primary">
                          ${(detail.cost || 0).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <Label htmlFor={`notes-tooth-${index}`}>
                          Notes (Tooth Specific)
                        </Label>
                        <Textarea
                          id={`notes-tooth-${index}`}
                          value={detail.notes}
                          onChange={(e) =>
                            handleToothDetailChange(
                              index,
                              "notes",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <MultiSelectInput
              label="General Tests / Investigations"
              placeholder="Type or select a test..."
              selectedItems={generalTests}
              onChange={setGeneralTests}
              suggestions={importantDiagnosisOptions}
              allAvailableSuggestions={allDiagnosisOptions}
            />
            <div>
              <Label>Medical & Drug History</Label>
              <Textarea
                value={medicalDrugHistory}
                onChange={(e) => setMedicalDrugHistory(e.target.value)}
                placeholder="Type Medical & Drug History"
              />
            </div>
            <div className="mt-6 p-4 border rounded-md space-y-4">
              <h3 className="text-lg font-semibold">
                Overall Treatment Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="overallNotes">Overall Notes</Label>
                  <Textarea
                    id="overallNotes"
                    value={overallNotes}
                    onChange={(e) => setOverallNotes(e.target.value)}
                    placeholder="General notes for this treatment session"
                  />
                </div>
                <div>
                  <Label htmlFor="overallStatus">Overall Status</Label>
                  <RadioGroup
                    value={overallStatus}
                    onValueChange={setOverallStatus}
                    className="flex space-x-4 pt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="in-progress"
                        id="r-overall-in-progress"
                      />
                      <Label htmlFor="r-overall-in-progress">In Progress</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="completed"
                        id="r-overall-completed"
                      />
                      <Label htmlFor="r-overall-completed">Completed</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <div className="p-2 bg-muted rounded-md">
                <Label className="font-semibold">
                  Total Estimated Cost for Treatment:
                </Label>
                <p className="text-xl font-bold text-primary">
                  $
                  {toothSpecificDetails
                    .reduce((sum, detail) => sum + (detail.cost || 0), 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="sm:justify-between mt-auto pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleOpenPrescription}
            disabled={!toothSpecificDetails.length}
          >
            {existingTreatment?.prescriptionId
              ? "Edit Prescription"
              : "Add Prescription"}
          </Button>
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleSubmit}
              disabled={!toothSpecificDetails.length}
            >
              Save Treatment
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
