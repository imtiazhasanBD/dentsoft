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
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import TreatmentDialog from "@/app/components/patient-profile/TreatmentDialog";
import toast from "react-hot-toast";
import PrescriptionDialog from "@/app/components/patient-profile/PrescriptionDialog";

export default function DentalProfilePage() {
  const [patientData, setPatientData] = useState(null);
  const [selectedTeeth, setSelectedTeeth] = useState([]);
  const [isTreatmentDialogOpen, setIsTreatmentDialogOpen] = useState(false);
  const [currentTreatment, setCurrentTreatment] = useState(null);
  const { id } = useParams();
  const [isPrescriptionSheetOpen, setIsPrescriptionSheetOpen] = useState(false);
  const [prescriptionContext, setPrescriptionContext] = useState(null);

  useEffect(() => {
    const fetchPatientAndInitializeTeeth = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_PATIENT}/${id}`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        console.log("Fetched patient data:", res.data);
        if (res.data && !res.data.teeth) {
          const initialPermanentTeeth = initializeTeethState(PERMANENT_TEETH);
          setPatientData({ ...res.data, teeth: initialPermanentTeeth });
        } else {
          setPatientData(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch patient data:", error);
      }
    };

    fetchPatientAndInitializeTeeth();
  }, [id]);

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

  const handleSaveTreatment = async (treatmentData) => {
    console.log(currentTreatment?._id);

    try {
      const promise = currentTreatment
        ? axios.put(
            `${process.env.NEXT_PUBLIC_PATIENT}/treatment/${currentTreatment._id}`,
            treatmentData,
            {
              headers: {
                Authorization: `Bearer ${Cookies.get("token")}`,
                "Content-Type": "application/json",
              },
            }
          )
        : axios.post(
            `${process.env.NEXT_PUBLIC_PATIENT}/${patientData._id}/treatments`,
            treatmentData,
            {
              headers: {
                Authorization: `Bearer ${Cookies.get("token")}`,
                "Content-Type": "application/json",
              },
            }
          );
      const response = await toast.promise(promise, {
        loading: currentTreatment
          ? "Updating treatment..."
          : "Creating treatment...",
        success: currentTreatment
          ? "Treatment updated successfully!"
          : "Treatment created successfully!",
        error: (err) => {
          return (
            <b>
              {err.response?.data?.error || currentTreatment
                ? "Could not update treatment."
                : "Could not create treatment."}
            </b>
          );
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating treatment:", error);
      throw error;
    }
  };

  const handleEditTreatmentFromLog = (treatmentToEdit) => {
    setSelectedTeeth(treatmentToEdit.toothNumbers || []);
    setCurrentTreatment(treatmentToEdit);
    setIsTreatmentDialogOpen(true);
  };

  const handleUpdatePatientData = (updatedData) => {
    setPatientData(updatedData);
  };

  const handleOpenPrescriptionSheet = (treatmentForPrescription) => {
    const existingPrescription =
      treatmentForPrescription.prescriptions.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt))
    setPrescriptionContext({
      treatment: treatmentForPrescription,
      existingPrescription: existingPrescription[0],
    });
    setIsPrescriptionSheetOpen(true);
    setIsTreatmentDialogOpen(false);
  };

const handleSavePrescription = async (prescriptionData) => {
  console.log(prescriptionData);
  
  const { patientId, nextAppointmentTime, nextAppointmentDate } = prescriptionData;
  const time = nextAppointmentTime;
  const date = nextAppointmentDate;
  
  try {
    // Create prescription
    const prescriptionPromise = axios.post(
      `${process.env.NEXT_PUBLIC_PATIENT}/prescription`,
      prescriptionData,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Create appointment if needed
    let appointmentPromise = Promise.resolve(null);
    if (nextAppointmentDate && nextAppointmentTime) {
      appointmentPromise = axios.post(
        process.env.NEXT_PUBLIC_APPOINTMENT,
        { patientId, date, time },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
    }

    // Wait for both operations to complete
    const [prescriptionResponse] = await toast.promise(
      Promise.all([prescriptionPromise, appointmentPromise]),
      {
        loading: "Creating prescription and appointment...",
        success: "Prescription created successfully!",
        error: (err) => {
          const error = err[0] || err; // Get the first error if array
          return (
            <b>
              {error.response?.data?.error || "Could not create prescription."}
            </b>
          );
        },
      }
    );

    // Close the modal and reset context
    setIsPrescriptionSheetOpen(false);
    setPrescriptionContext(null);
    
    return prescriptionResponse.data;
  } catch (error) {
    console.error("Error in prescription handling:", error);
    throw error;
  }
};

  if (!patientData || !patientData.teeth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p>Loading patient data...</p>
      </div>
    );
  }
  console.log(currentTreatment?._id);

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
            onOpenPrescription={handleOpenPrescriptionSheet}
          />
        </div>

        <div className="lg:col-span-1 space-y-6 max-w-60">
          <QuickActionsPanel
            patientData={mockPatient}
            onUpdatePatientData={handleUpdatePatientData}
            onOpenPrescription={handleOpenPrescriptionSheet}
          />
        </div>
      </main>

      {isTreatmentDialogOpen && (
        <TreatmentDialog
          open={isTreatmentDialogOpen}
          onOpenChange={(isOpen) => {
            setIsTreatmentDialogOpen(isOpen);
            if (!isOpen) {
              setSelectedTeeth([]);
              setCurrentTreatment(null);
            }
          }}
          toothNumbers={selectedTeeth}
          existingTreatment={currentTreatment}
          onSaveTreatment={handleSaveTreatment}
          onOpenPrescription={handleOpenPrescriptionSheet}
        />
      )}

      {prescriptionContext && (
        <PrescriptionDialog
          open={isPrescriptionSheetOpen}
          onOpenChange={(isOpen) => {
            setIsPrescriptionSheetOpen(isOpen);
            if (!isOpen) setPrescriptionContext(null);
          }}
          treatment={prescriptionContext.treatment}
          patient={patientData}
          existingPrescription={prescriptionContext.existingPrescription}
          onSavePrescription={handleSavePrescription}
        />
      )}
    </>
  );
}
