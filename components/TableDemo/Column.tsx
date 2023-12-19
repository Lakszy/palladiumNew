import { cn } from "../../lib/utils"
import { TableCell, TableHead } from "../ui/table";
import { FaTruckPickup } from "react-icons/fa";
export type ColumnProps = {
  value: any;
  objectProperty: string;
  title: string;
  type: string;
  colorPlate: any;
  schedule:any;
};
export default function Column({
  value,
  objectProperty,
  type,
  colorPlate,
}: ColumnProps) {
  switch (type) {
    case "AGE":
      return <TableCell className="whitespace-nowrap">{`${value} Yr`}</TableCell>;
    case "ID":
      return <TableCell className="whitespace-nowrap flex items-center gap-x-1">
        <div className="w-6 h-6 bg-gray-100 rounded-full border-2"></div>
        {value}</TableCell>;
    case "DISEASE":
      const color = colorPlate[value.replace(" ", "_")];
      const colorClass = !!color && `bg-${color}-300 text-${color}-700 font-semibold `;
      return (
        <TableCell>
          <div className={cn(colorClass,"rounded-2xl whitespace-nowrap p-2 w-fit flex")}>{value}</div>
        </TableCell>
      );
      case "SCHEDULE":
        return (
          <TableCell>
            <div className={cn( "")}>{value}</div>
          </TableCell>
        );
    case "PAYMENT":
      return <TableCell className="flex items-center gap-x-1 bg-gray-100 rounded-3xl font-medium  w-28 h-10 justify-center"><FaTruckPickup className="text-green-400" />{value}</TableCell>;
    default:
      return <TableCell>{value}</TableCell>;
  }
}
