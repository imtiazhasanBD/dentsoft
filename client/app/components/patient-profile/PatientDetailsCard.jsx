
'use client';
import { useState, useEffect } from 'react';
import { UserCircle2, Cake, Phone, Mail, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function PatientDetailsCard({ patient }) {
  const [age, setAge] = useState(null);
  const [formattedDob, setFormattedDob] = useState(null);

  useEffect(() => {
    if (patient && patient.dob) {
      const birthDate = new Date(patient.dob);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge.toString());
      setFormattedDob(birthDate.toLocaleDateString());
    } else {
      setAge(null);
      setFormattedDob(null);
    }
  }, [patient]);

  if (!patient) return null;

  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={`https://placehold.co/100x100.png?text=${getInitials(patient.name)}`} alt={patient.name} data-ai-hint="profile avatar" />
            <AvatarFallback>{getInitials(patient.name)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl font-headline">{patient.name}</CardTitle>
            <p className="text-sm text-muted-foreground">Patient ID: {patient.id}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center">
          <Cake className="mr-3 h-5 w-5 text-primary" />
          {formattedDob && age !== null ? (
            <span>DOB: {formattedDob} (Age: {age})</span>
          ) : patient.dob ? (
            <span>DOB: {patient.dob} (Age: calculating...)</span>
          ) : (
            <span>Date of birth not available</span>
          )}
        </div>
        <div className="flex items-center">
          <Phone className="mr-3 h-5 w-5 text-primary" />
          <span>{patient.phone}</span>
        </div>
        <div className="flex items-center">
          <Mail className="mr-3 h-5 w-5 text-primary" />
          <span>{patient.email}</span>
        </div>
        <div className="flex items-start">
          <MapPin className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-1" />
          <span>{patient.address}</span>
        </div>
      </CardContent>
    </Card>
  );
}
