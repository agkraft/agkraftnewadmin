// @ts-ignore
import React from 'react';
import { DataTable } from '@/components/datatable/data-table';
import { columns, VenueType } from './venuetablecolumn';

interface VenueTableProps {
  data: VenueType[];
  openEditModal: (venue: VenueType) => void;
}

const VenueTable = ({ data, openEditModal }: VenueTableProps) => {
  return (
    <div className="p-3 text-[#313131] bg-[#F0EFF3] flex flex-col gap-3 font-semibold">
      <DataTable
        title="Venues"
        columns={columns(openEditModal)}
        data={data}
        loading={false}
      />
    </div>
  );
};

export default VenueTable;