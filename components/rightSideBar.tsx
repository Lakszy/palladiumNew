// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { BiTask } from "react-icons/bi";
// import { PiNotebookBold } from "react-icons/pi";
// import { FaRegClock } from "react-icons/fa";
// import { IoCalendarOutline } from "react-icons/io5";

// const notifications = [
//   {
//     logo: <IoCalendarOutline size={20} />,
//     title: "Ongoing Project",
//     description: "10:20 AM / Figma",
//   },
//   {
//     logo: <BiTask size={20} />,
//     title: "Goa Trip",
//     description: "06:40 AM / Rajdhani Exp.",
//   },
//   {
//     logo: <PiNotebookBold size={20} />,
//     title: "New Task Added",
//     description: "12:00 AM / Notion",
//   },
//   {
//     logo: <FaRegClock size={20} />,
//     title: "Design Team meeting",
//     description: "4:00 PM / Google Meet",
//   },
// ];

// type CardProps = React.ComponentProps<typeof Card>;

// export function CardDemoR({ className, ...props }: CardProps) {
//   return (
//     <Card className="bg-purple-50">
//       <CardHeader>
//         <CardTitle>Recent Activity</CardTitle>
//       </CardHeader>
//       <CardContent className="-mt-4 grid gap-1">
//         <CardDescription>Today</CardDescription>
//         <div>
//           {notifications.map((notification, index) => (
//             <div
//               key={index}
//               className="grid grid-cols-[25px_1fr] items-start  last:mb-0 last:pb-0"
//             >
//               <span className="flex h-2 w-2 translate-y-1" />

//               <div className="flex gap-x-2 items-center mt-2 mb-1">
//                 <div className="font-medium leading-none bg-white rounded-full w-10 h-10 flex items-center justify-center">
//                   {notification.logo}
//                 </div>
//                 <div>
//                   <h1 className="font-medium">{notification.title}</h1>
//                   <h1 className="text-gray-500 text-xs">
//                     {notification.description}
//                   </h1>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//         <CardDescription>Yesterday</CardDescription>
//         <div>
//           {notifications.map((notification, index) => (
//             <div
//               key={index}
//               className="grid grid-cols-[25px_1fr] items-start  last:mb-0 last:pb-0"
//             >
//               <span className="flex h-2 w-2 translate-y-1" />

//               <div className="flex gap-x-2 items-center mt-2 mb-1">
//                 <div className="font-medium leading-none bg-white rounded-full w-10 h-10 flex items-center justify-center">
//                   {notification.logo}
//                 </div>
//                 <div>
//                   <h1 className="font-medium">{notification.title}</h1>
//                   <h1 className="text-gray-500 text-xs">
//                     {notification.description}
//                   </h1>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </CardContent>
//       <CardFooter className="p-2">
//         <Button variant="outline" className="rounded-xl  w-full">
//           View All
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// }
