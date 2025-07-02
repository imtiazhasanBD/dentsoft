import React from "react";

const groupByText = (toothSpecificDetails, key) => {
  const grouped = {};

  for (const detail of toothSpecificDetails) {
    const items = detail[key] || [];
    if (items.length === 0) continue;

    // Create a unique key by joining all items (order matters)
    const combinationKey = items.join("|");

    if (!grouped[combinationKey]) {
      grouped[combinationKey] = {
        text: items.join(", "), // Display text
        quadrant: true,
        val1: [],
        val2: [],
        val3: [],
        val4: [],
      };
    }

    // Add tooth to appropriate quadrant
    const tooth = parseInt(detail.toothNumber);
    const quadrantArray =
      (tooth >= 11 && tooth <= 18) || (tooth >= 51 && tooth <= 55)
        ? grouped[combinationKey].val1
        : (tooth >= 21 && tooth <= 28) || (tooth >= 61 && tooth <= 65)
        ? grouped[combinationKey].val2
        : (tooth >= 41 && tooth <= 48) || (tooth >= 81 && tooth <= 85)
        ? grouped[combinationKey].val3
        : grouped[combinationKey].val4;

    quadrantArray.push(detail.toothNumber);
  }

  return Object.values(grouped);
};

const renderSection = (title, data) => (
  <>
    <div className="block float-left font-serif h-[6mm]  mt-5 font-bold underline">
      <span className="inline-block text-sm">{title}</span>
    </div>
    <div className="block float-left w-full pr-4 mb-[5px]">
      <table className="border-separate table-auto w-full pl-2 text-sm">
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td className="align-top pr-2 pb-4">
                <div className="block float-left font-serif whitespace-pre-line text-left">
                  {item.text}
                </div>
              </td>
              {item.quadrant && (
                <td className="align-middle pl-2">
                  <div className="block float-left w-[42px]">
                    <div className="flex flex-col">
                      <div className="flex w-full min-h-[20px] border-b border-black">
                        <div className="w-[22px] border-r border-black flex items-center justify-center text-sm">
                          {item.val1.join(" ")}
                        </div>
                        <div className="w-[22px] flex items-center justify-center text-sm">
                          {item.val2.join(" ")}
                        </div>
                      </div>
                      <div className="flex w-full min-h-[20px]">
                        <div className="w-[22px] border-r border-black flex items-center justify-center text-sm">
                          {item.val3.join(" ")}
                        </div>
                        <div className="w-[22px] flex items-center justify-center text-sm">
                          {item.val4.join(" ")}
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

const renderSimpleSection = (title, text) => (
  <>
    <div className="block float-left font-serif h-[6mm] mt-5 font-bold">
      <span className="inline-block text-sm">{title}</span>
    </div>
    <div className="block float-left w-full mb-[5px] pl-4">
      <div className="font-serif whitespace-pre-line text-left text-sm">
        {text}
      </div>
    </div>
  </>
);

const PrescriptionTreatmentSummary = ({ printable, toothSpecificDetails, generalTests, medicalDrugHistory }) => {

  const chiefComplaints = groupByText(toothSpecificDetails, "chiefComplaint");
  const clinicalFindings = groupByText(toothSpecificDetails, "clinicalFindings");
  const procedures = groupByText(toothSpecificDetails, "procedure");
  const toothDiagnoses = groupByText(toothSpecificDetails, "diagnosis");
  const generalDiagnoses =
    generalTests?.length > 0
      ? [
          {
            text: generalTests.join(", "),
            quadrant: false
          },
        ]
      : [];

  const allDiagnoses = [...toothDiagnoses, ...generalDiagnoses];

  console.log(toothSpecificDetails);

  console.log(chiefComplaints);
  console.log(clinicalFindings);
  console.log(procedures);

  return (
    <div className="block relative float-left w-[90mm] border-r border-black font-sans text-gray-800 text-base">
      {chiefComplaints.length > 0 && renderSection("C/C", chiefComplaints)}
      {clinicalFindings.length > 0 && renderSection("O/E", clinicalFindings)}
      {procedures.length > 0 && renderSection("Treatment Plan", procedures)}
       {medicalDrugHistory && renderSimpleSection("Medical Drug History", medicalDrugHistory)}
        {/* Diagnosis Section - Always rendered at bottom */}
        {allDiagnoses.length > 0 && (
        <div className={`${printable? "absolute" : ""} bottom-0 left-0 w-full`}>
          {renderSection("I/X", allDiagnoses)}
        </div>
        )}
    </div>
  );
};

export default PrescriptionTreatmentSummary;
