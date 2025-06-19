import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  CircleCheck,
  Trash,
  Eye,
} from "lucide-react";

const ManageMonetizationRequests = () => {
  const [selectedAction, setSelectedAction] = useState("VERIFY");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof RequestType | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  type RequestType = {
    id: number;
    username: string;
    requested: string;
    status: string;
  };

  const [requests, setRequests] = useState<RequestType[]>([
    { id: 1, username: "john_doe", requested: "2025-01-31", status: "Pending" },
    {
      id: 2,
      username: "jane_doe",
      requested: "2025-02-01",
      status: "Approved",
    },
  ]);

  const handleSort = (key: keyof RequestType) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedRequests = [...requests].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setRequests(sortedRequests);
  };

  return (
    <Card className="p-6 w-full max-w-[90%] mx-auto">
      <h2 className="text-lg font-semibold mb-4">
        Manage Monetization Requests
      </h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <input type="checkbox" />
            </TableHead>
            <TableHead
              onClick={() => handleSort("id")}
              className="cursor-pointer flex items-center gap-1"
            >
              ID <ArrowUpDown className="w-4 h-4" />
            </TableHead>
            <TableHead>Username</TableHead>
            <TableHead
              onClick={() => handleSort("requested")}
              className="cursor-pointer flex items-center gap-1"
            >
              Requested <ArrowUpDown className="w-4 h-4" />
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <input type="checkbox" />
              </TableCell>
              <TableCell>{request.id}</TableCell>
              <TableCell>{request.username}</TableCell>
              <TableCell>{request.requested}</TableCell>
              <TableCell>{request.status}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <CircleCheck className="mr-2 h-4 w-4 text-green-500" />
                    Verify
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash className="mr-2 h-4 w-4 text-red-500" />
                    Delete
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Eye className="mr-2 h-4 w-4 text-blue-500" />
                    View
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between mt-4">
        <span>
          Showing {requests.length} out of {requests.length}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className=" px-3 py-1 rounded-md">{currentPage}</span>
          <Button variant="ghost" size="icon" disabled>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <Select onValueChange={(value) => setSelectedAction(value)}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder={selectedAction} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="VERIFY">Verify</SelectItem>
            <SelectItem value="REJECT">Reject</SelectItem>
          </SelectContent>
        </Select>
        <Button className="bg-[#B08CF6] hover:bg-[#B08CF6]">Submit</Button>
      </div>
    </Card>
  );
};

export default ManageMonetizationRequests;
