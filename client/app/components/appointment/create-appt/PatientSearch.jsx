"use client";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { fetchPatients } from "./fetchPatient";

export function PatientSearch({ onSelect }) {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Search patients (mock API call)
  useEffect(() => {
    setLoading(true);
    fetchPatients(searchQuery)
      .then(setPatients)
      .finally(() => setLoading(false));
  }, [searchQuery]);
  console.log(patients);

  const handleSelect = (patient) => {
    setSelectedPatient(patient);
    onSelect(patient);
    setOpen(false);
  };
  
  return (
    <div className="grid gap-2">
      <Label htmlFor="patient">Patient</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={
              ("w-full justify-between",
              !selectedPatient && "text-muted-foreground")
            }
          >
            {selectedPatient
              ? `${selectedPatient.name} (${selectedPatient.phone})`
              : "Select patient"}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command>
            <CommandInput
              placeholder="Search name or phone..."
              onValueChange={setSearchQuery}
            />
            <CommandList>
              {loading ? (
                <CommandItem className="text-muted-foreground">
                  <div className="animate-spin">
                    <LoaderCircle className="h-4 w-4" />
                  </div>
                  Loading patients...
                </CommandItem>
              ) : patients.length > 0 ? (
                patients.map((patient) => (
                  <CommandItem
                    key={patient._id}
                    value={`${patient.name} ${patient.phone}`}
                    onSelect={() => handleSelect(patient)}
                    className="cursor-pointer"
                  >
                    {patient.name} ({patient.phone})
                  </CommandItem>
                ))
              ) : (
                <div className="p-4 text-sm text-muted-foreground">
                  No patients found
                </div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
