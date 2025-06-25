"use client";
import { useState, useEffect, useRef } from "react";

import {
  mockPatient,
  PERMANENT_TEETH,
  DECIDUOUS_TEETH,
  initializeTeethState,
} from "@/app/lib/dentalData";
import PatientDetailsCard from "@/app/components/patient-profile/PatientDetailsCard";
import TeethChartSection from "@/app/components/patient-profile/TeethChartSection";
import HistoryTabsSection from "@/app/components/patient-profile/HistoryTabsSection";
import QuickActionsPanel from "@/app/components/patient-profile/QuickActionsPanel";

export default function DentalProfilePage() {
   const [patientData, setPatientData] = useState(mockPatient);
  const [selectedTeeth, setSelectedTeeth] = useState([]);

  useEffect(() => {
    if (patientData && !patientData.teeth) {
        const initialPermanentTeeth = initializeTeethState(PERMANENT_TEETH);
        setPatientData(prev => ({ ...prev, teeth: initialPermanentTeeth }));
    }
  }, [patientData.treatments]);

  const handleToothSelect = (toothNumber) => {
    setSelectedTeeth((prevSelectedTeeth) => {
      if (prevSelectedTeeth.includes(toothNumber)) {
        return prevSelectedTeeth.filter((t) => t !== toothNumber);
      } else {
        return [...prevSelectedTeeth, toothNumber];
      }
    });
  };

  const handleOpenNewTreatmentDialog = () => {
    setCurrentTreatment(null);
    setIsTreatmentDialogOpen(true);
  };

  const handleEditTreatmentFromLog = (treatmentToEdit) => {
    setSelectedTeeth(treatmentToEdit.toothNumbers || []);
    setCurrentTreatment(treatmentToEdit);
    setIsTreatmentDialogOpen(true);
  };


  const handleUpdatePatientData = (updatedData) => {
    setPatientData(updatedData);
  };



  if (!patientData || !patientData.teeth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p>Loading patient data...</p>
      </div>
    );
  }
  console.log(patientData);

  return (
    <>
      <main className="flex gap-6">
        <div className="space-y-6 w-full">
          <PatientDetailsCard patient={patientData} />
          <TeethChartSection
            teethStatus={patientData.teeth}
            onToothSelect={handleToothSelect}
            selectedTeeth={selectedTeeth}
            onOpenNewTreatmentDialog={handleOpenNewTreatmentDialog}
          />
          <HistoryTabsSection
            patientData={patientData}
            onEditTreatment={handleEditTreatmentFromLog}
          />
        </div>

        <div className="lg:col-span-1 space-y-6 max-w-60">
          <QuickActionsPanel
            patientData={patientData}
            onUpdatePatientData={handleUpdatePatientData}
          />
        </div>
      </main>
    </>
  );
}
