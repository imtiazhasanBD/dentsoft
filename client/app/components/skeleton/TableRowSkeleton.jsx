import { TableCell, TableRow } from "@/components/ui/table";

const TableRowSkeleton = () => {
  return Array.from({ length: 10 }).map((_, index) => (
    <TableRow key={index} className="animate-pulse">
      <TableCell>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </TableCell>
      <TableCell>
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      </TableCell>
      <TableCell>
        <div className="flex gap-2 justify-end">
          <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
          <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
        </div>
      </TableCell>
    </TableRow>
  ));
};

export default TableRowSkeleton;
