import React from "react";
import PrescriptionTreatmentSummary from "./PrescriptionTreatmentSummary";
import { format } from "date-fns";
import { getBengaliTimeOfDay } from "@/app/utils/date";

const PrintablePrescription = React.forwardRef(
  ({ patient, treatment, prescription }, ref) => {
    if (!patient || !treatment) return null;
    const timeOfDay = getBengaliTimeOfDay(prescription?.nextAppointmentTime);

    console.log(prescription);

    return (
      <div
        ref={ref}
        className="text-black font-sans bg-white text-sm  w-[210mm] h-[297mm] mx-auto flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between px-10 py-4 bg-gray-300">
          <div>
            <h1 className="text-xl font-bold">Dr. Sarwar Hussain Rumel</h1>
            <p>BDS, Dental Surgeon</p>
            <p>Oral & Maxillofacial Surgery</p>
            <p className="mt-1">Demo Dental Care</p>
            <p>BMDC Reg. No: 112589</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">Chamber:</p>
            <p>Crecent Diagnostic Center</p>
            <p>Panthapoth, Dhaka</p>
            <p>Mobile: 01617425842</p>
            <p>Visit Time: 4PM–10PM</p>
            <p>Friday Off</p>
            <p className="font-semibold mt-2">Prescription ID: *0005*</p>
          </div>
        </div>

        {/* Patient Info */}
        <div className="grid grid-cols-3 border-y px-10 py-4 border-gray-500 text-sm">
          <p>
            <span className="font-semibold">Name:</span> Imtiaz Hasan
          </p>
          <p>
            <span className="font-semibold">Age:</span> 29
          </p>
          <p>
            <span className="font-semibold">Date:</span>{" "}
            {new Date(treatment.date).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold">Address:</span> Kishoreganj
          </p>
          <p>
            <span className="font-semibold">Patient ID:</span> P033
          </p>
          <p>
            <span className="font-semibold">Mobile:</span> 01786655555
          </p>
        </div>
        {/* Treatment & Rx section - fills remaining space */}
        <div className="flex flex-1 gap-6 p-10 py-4">
          {/* Tooth-specific Data */}
          <PrescriptionTreatmentSummary
            printable={true}
            toothSpecificDetails={treatment.toothSpecificDetails}
            generalTests={treatment?.generalTests}
            medicalDrugHistory={treatment?.medicalDrugHistory}
          />

          {/* Rx Section */}
          <div className="w-full flex flex-col justify-start">
            <h2 className="text-2xl font-bold mb-2">
              R<sub>x.</sub>
            </h2>
            <div className="flex-1 pl-4">
              {prescription?.medicines?.length ? (
                prescription.medicines.map((med, idx) => (
                  <div key={idx} className="mb-4 pl-4">
                    <p className="text-lg font-medium">
                      {idx + 1}. {med.name} - {med.dosage}
                    </p>
                    <p className="ml-6">
                      {med.frequency} ------- {med.mealTiming} -------{" "}
                      {med.duration}
                    </p>
                    {med.notes && (
                      <p className="ml-6 text-xs italic">Notes: {med.notes}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No medicines prescribed.</p>
              )}
            </div>
            {prescription?.nextAppointmentDate && prescription.nextAppointmentTime && (
              <p className="font-bold mt-4">
                  **{format(new Date(prescription?.nextAppointmentDate), "dd MMM, yyyy")} {timeOfDay} {prescription?.nextAppointmentTime} আসবেন।**
              </p>
            )}
          </div>
        </div>
        {/* Footer */}
        <hr className="border-black" />
        <p className="text-xs text-center italic py-4">
          This is a computer-generated prescription and does not require a
          physical signature if digitally verified.
        </p>
      </div>
    );
  }
);

PrintablePrescription.displayName = "PrintablePrescription";
export default PrintablePrescription;
