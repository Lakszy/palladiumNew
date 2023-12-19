import { TableRow } from "../ui/table";
import Column from "./Column";

export type TableRowProps = {
  header: any[];
  row: any;
  rowIndex: number;
};

export default function Row({ header, row, rowIndex }: TableRowProps) {
  return (
    <TableRow>
      {header?.map((head: any, index: number) => (
        <Column
          className='-z-10 relative'
          {...head}
          value={row[head.objectProperty]}
          key={`table-body-row-cell-${index}`}
        />
      ))}
    </TableRow>
  );
}
