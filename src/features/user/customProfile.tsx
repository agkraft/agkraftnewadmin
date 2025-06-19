import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

export default function ManageProfileFields() {
  return (
    <div className="flex  items-center justify-center  bg-gray-100 p-6">
      <Card className="w-full  shadow-md border border-gray-300 bg-white">
        <CardHeader>
          <CardTitle className="text-xl  font-semibold text-gray-900">
            Manage Custom Profile Fields
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <Button className="bg-[#B08CF6] text-white hover:bg-[#B08CF6]">
              Create New Custom Field
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox />
                </TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Field Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Length</TableHead>
                <TableHead>Placement</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>1</TableCell>
                <TableCell>Example Field</TableCell>
                <TableCell>Text</TableCell>
                <TableCell>255</TableCell>
                <TableCell>Profile</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="flex justify-start mt-4">
            <Button
              variant="outline"
              className="text-[#B08CF6] border-[#B08CF6] hover:bg-[#B08CF6] hover:text-white"
            >
              Delete Selected
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
