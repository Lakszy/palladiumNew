import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Row from "./Row";

const PAGE_SIZE = 10;

export function TableDemo({ header, data }: { header: any[]; data: any[] }) {
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  const paginatedData = data.slice(startIndex, endIndex);

  const totalPages = Math.ceil(data.length / PAGE_SIZE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <Table>
        <TableHeader className='-z-10 relative'>
          <TableRow className='-z-10 relative'>
            {header?.map((head: any, index: number) => (
              <TableHead key={`table-head-${index}`}>{head.title}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className='-z-10 relative '>
          {paginatedData.map((row: any, index: number) => (
            <Row
              header={header}
              row={row}
              rowIndex={startIndex + index}
              key={`table-body-row-index-${startIndex + index}`}
            />
          ))}
        </TableBody>
      </Table>
      <div className='flex justify-center items-center'>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            className={`pagination-button space-around ${index + 1 === currentPage ? 'active' : ''}`}
            key={`pagination-button-${index + 1}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
