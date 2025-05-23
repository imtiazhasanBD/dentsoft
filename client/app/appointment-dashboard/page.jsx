import StatCard from "../components/appointment/StatCard";
import { AppointmentsTable } from "../components/appointment/AppointmentsTable";
import TodayAndLatestAppointment from "../components/appointment/TodayAndLatestAppointment";
import { Card } from "@/components/ui/card";
import UpcomingAppointment from "../components/appointment/UpcomingAppointment";


const page = () => {

  return (
    <div className="space-y-10">
      <div className=" flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Appointment Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your appointments efficiently
          </p>
        </div>
        <button className="bg-blue-500 text-white p-2 rounded-sm font-medium cursor-pointer">
          + New Appointment
        </button>
      </div>
      {/* Stats Cards Row */}
      <section className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
        <StatCard />
      </section>

      {/* Middle Section - Today's Appointments and Latest Bookings */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
         <TodayAndLatestAppointment/>
      </section>

      {/* Bottom Section - Calendar and Upcoming Appointments */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UpcomingAppointment/>
      </section>

      {/* top Section -  Appointments list */}
      <Card className="p-4 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Appointments List</h2>
        <AppointmentsTable/>
      </Card>
    </div>
  );
};

export default page;
