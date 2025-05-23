"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Search, MoreHorizontal } from "lucide-react";
import { AppointmentRow } from "./AppointmentRow";
import { format } from "date-fns";
import Cookies from "js-cookie";
import axios from "axios";
import CustomPagination from "../CustomPagination";
import TableRowSkeleton from "../skeleton/TableRowSkeleton";

export function AppointmentsTable() {
  const [appointments, setAppointments] = useState(null);
  // State for filters and pagination
  const [filters, setFilters] = useState({
    name: "",
    phone: "",
    date: "",
    status: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    resultsPerPage: 10,
  });

  // Fetch appointments with filters
  const fetchAppointments = async () => {
    try {
      const params = new URLSearchParams();
      // Add filters dynamically
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      // Add pagination
      params.append("limit", pagination.resultsPerPage);
      params.append("page", pagination.currentPage);
      console.log(params.toString());

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_APPOINTMENT}?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      console.log(res.data);

      // Update appointments and pagination
      setAppointments(res.data.data);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) =>
      /^\d+$/.test(value)
        ? { ...prev, name: "", phone: value }
        : { ...prev, [name]: value, phone: "" }
    );
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page
  };

  // Handle date change
  const handleDateChange = (date) => {
    if (date) {
      setFilters((prev) => ({ ...prev, date: format(date, "yyyy-MM-dd") }));
    }
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  // Call fetchAppointments whenever filters or pagination changes
  useEffect(() => {
    fetchAppointments();
  }, [filters, pagination?.currentPage]);

  if (appointments?.data === 0) {
    return <div>Loading........</div>;
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 md:pr-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10"
              name="name"
              placeholder="Search by name or phone number"
              value={filters.name || filters.phone}
              onChange={handleFilterChange}
            />
          </div>
        <div className="flex flex-wrap justify-end gap-2">
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="px-4 text-base text-gray-900 bg-white
              border border-gray-300 rounded-md appearance-none cursor-pointer focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="scheduled">Scheduled</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left font-normal cursor-pointer"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.date ? format(filters.date, "PPP") : "Filter by date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.date ? new Date(filters.date) : null}
                onSelect={handleDateChange}
              />
            </PopoverContent>
          </Popover>

          {filters.date && (
            <Button
              variant="ghost"
              onClick={() =>
                setFilters({
                  name: "",
                  phone: "",
                  date: "",
                  status: "",
                })
              }
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border pl-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments === null ? (
              <TableRowSkeleton />
            ) : appointments && appointments.length > 0 ? (
              appointments.map((appt) => (
                <AppointmentRow key={appt._id} appt={appt} />
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-4 text-gray-500"
                >
                  No appointments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <CustomPagination
        pagination={pagination}
        handlePageChange={handlePageChange}
      />
    </div>
  );
}
