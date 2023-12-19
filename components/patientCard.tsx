// import { Badge } from "@/components/ui/badge";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Label } from "@/components/ui/label";

// import { BiDotsVerticalRounded } from "react-icons/bi";
// import { GoPencil } from "react-icons/go";
// import { CiSearch } from "react-icons/ci";

// type CardProps = React.ComponentProps<typeof Card>;

// export function TabsDemo2() {
//   return (
//     <Card className="bg-purple-50 w-full">
//       <div className="flex flex-row justify-between ">
//         <CardHeader>
//           <div className="flex gap-x-3 items-center">
//             <Avatar>
//               <AvatarImage src="https://github.com/shadcn.png" />
//               <AvatarFallback>CN</AvatarFallback>
//             </Avatar>
//             <div className="items-center">
//               <CardTitle>Om Jha</CardTitle>
//               <CardDescription>Bussiness Owner</CardDescription>
//             </div>
//           </div>
//         </CardHeader>
//         <div className="flex gap-2 mt-10 m-4 font-bold">
//           <CiSearch size={24} className="hover:cursor-pointer" />
//           <GoPencil size={24} className="hover:cursor-pointer" />
//           <BiDotsVerticalRounded
//             size={24}
//             className="hover:cursor-pointer"
//           />
//         </div>
//       </div>
//       <div className="ml-3 gap-2 flex -mt-3 ">
//         <button className="border-green-600 border text-xs font-semibold bg-green-200 text-black rounded-md justify-center items-center p-1">
//           India, Delhi
//         </button>
//         <button className="border-green-600 border text-xs font-semibold bg-green-200 text-black rounded-md justify-center items-center p-1">
//           Cosemetics
//         </button>
//         <button className="border-green-600 border text-xs font-semibold bg-green-200 text-black rounded-md justify-center items-center p-1">
//           Sales
//         </button>
//       </div>

//       <div className="bg-green-200 justify-between flex  mt-4 m-2 rounded-xl border-green-400 border">
//         <div className="w-23 p-2">
//           <h2 className="font-semibold text-lg">
//             Add more Customers{" "}
//             <span className="flex">to get lid!</span>
//           </h2>
//         </div>
//         <div className="bg-green-200  rounded-xl">
//           <button className="bg-white rounded-lg p-2 m-4 border border-gray-300 font-medium">
//             Add Now
//           </button>
//         </div>
//       </div>
//       <div className="bg-white pt-4 pb-2 m-4  h-40 rounded-xl">
//         <CardContent>
//           <CardTitle className="-mb-3 ml-3">Basic Info</CardTitle>
//         </CardContent>
//         <div className="space-x-36 ml-10  flex">
//           <div>
//             <Label
//               className="text-gray-600 whitespace-nowrap font-semibold"
//               htmlFor="fname"
//             >
//               First Name
//             </Label>
//             <p className="font-semibold">Ansh</p>
//           </div>
//           <div>
//             <Label
//               className="text-gray-600 whitespace-nowrap font-semibold"
//               htmlFor="lname"
//             >
//               Last Name
//             </Label>
//             <p className="font-semibold">Rajput</p>
//           </div>
//           <div>
//             <Label
//               className="text-gray-600 font-semibold ml-3"
//               htmlFor="number"
//             >
//               Mobile No.
//             </Label>
//             <p className="ml-3 font-semibold">824593574</p>
//           </div>
//           <div>
//             <Label
//               className="text-gray-600 font-semibold"
//               htmlFor="email"
//             >
//               Email
//             </Label>
//             <p className="font-semibold">ansh15@gmail.com</p>
//           </div>
//         </div>

//         <div className="space-x-36  ml-10 mt-2 flex">
//           <div>
//             <Label
//               className=" whitespace-nowrap text-gray-600 font-semibold"
//               htmlFor="fname"
//             >
//               Moving Date
//             </Label>
//             <p className="font-semibold">3/3/2023</p>
//           </div>
//           <div>
//             <Label
//               className=" whitespace-nowrap text-gray-600 -ml-3.5 font-semibold"
//               htmlFor="lname"
//             >
//               Preferred Time
//             </Label>
//             <p className="-ml-3 font-semibold">9:00</p>
//           </div>
//           <div>
//             <Label
//               className=" font-semibold -ml-5 text-gray-600"
//               htmlFor="number"
//             >
//               Internal Note
//             </Label>
//             <p className="cursor-pointer font-semibold -ml-3">
//               ......
//             </p>
//           </div>
//           <div>
//             <Label
//               className=" font-semibold -ml-3.5 text-gray-600"
//               htmlFor="email"
//             >
//               Job Note
//             </Label>
//             <p className="cursor-pointer font-semibold -ml-3">
//               .....
//             </p>
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// }
