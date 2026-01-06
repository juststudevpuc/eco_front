// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// import { Spinner } from "@/components/ui/spinner";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// import { formatDate } from "@/utils/helper/format";
// import { request } from "@/utils/request/request";

// import {
//   Edit,
//   Plus,
//   PlusSquare,
//   Search,
//   SearchSlash,
//   Trash,
// } from "lucide-react";

// import React, { useEffect, useState } from "react";

// const BrandPage = () => {
//   const [brand, setBrand] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const [isEdit, setIsEdit] = useState(false);
//   const [isDelete, setIsDelete] = useState(false);
//   const [deleteData, setDeleteData] = useState(null);
//   const [query, setQuery] = useState("");
//   const [form, setForm] = useState({
//     id: "",
//     name: "",
//     description: "",
//     status: "",
//   });

//   const fetchingData = async () => {
//     setLoading(true);
//     const res = await request("brand", "get");
//     if (res) {
//       console.log(res);
//       setBrand(res?.data);
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchingData();
//   }, []);

//   const tbl_head = [
//     "No",
//     "Name",
//     "Description",
//     "Status",
//     "Created at",
//     "Update at",
//     "Action",
//   ];

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Form Data: ", form);
//     try {
//       if (isEdit) {
//         const res = await request(`brand/${form?.id}`, "put", form);
//         if (res) {
//           console.log("Update Category : ", res);
//           fetchingData();
//         }
//         setIsEdit(false);
//       } else {
//         const res = await request("brand", "post", form);
//         if (res) {
//           console.log("Create brand : ", res);
//           fetchingData();
//         }
//       }
//     } catch (error) {
//       console.log(error);
//     }

//     setIsOpen(false);
//     setForm({
//       id: "",
//       name: "",
//       description: "",
//       status: "",
//     });
//   };
//   // Handle edit action:
//   const onEdit = (itemEdit) => {
//     console.log("Item Edit :", itemEdit);
//     // - Opens the dialog
//     setIsOpen(true);
//     // - Loads the selected item data into the form
//     setForm(itemEdit);
//     // - Enables edit mode
//     setIsEdit(true);
//   };
//   // delete
//   const onDelete = (itemDelete) => {
//     console.log("Delete brand : ", itemDelete);
//     setIsDelete(true);
//     setDeleteData(itemDelete);
//   };

//   return (
//     <div>
//       <div className="flex justify-between">
//         <div className="flex gap-3 items-center">
//           <h1>Brand</h1>
//           <Input
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Search brand..."
//           />
//           <Button
//             onClick={async () => {
//               setLoading(true);
//               const res = await request(`brand/search?q=${query}`, "get");
//               if (res) {
//                 console.log("Brand data:", res?.data);
//                 setBrand(res?.data || []);
//                 setLoading(false);
//               }
//             }}
//           >
//             <Search />
//           </Button>
//           <Button
//             onClick={() => {
//               fetchingData();
//               setQuery("");
//             }}
//           >
//             <SearchSlash />
//           </Button>
//         </div>
//         {/* add brand */}
//         <Dialog open={isOpen} onOpenChange={setIsOpen}>
//           <DialogTrigger>
//             <Button>
//               <PlusSquare />
//             </Button>
//           </DialogTrigger>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>
//                 {isEdit ? "Update Brand" : "Create Brand"}
//               </DialogTitle>
//               <DialogDescription>Brand</DialogDescription>
//             </DialogHeader>
//             <form action="" onSubmit={onSubmit}>
//               <div className="flex flex-col gap-5">
//                 <div className="flex flex-col gap-2">
//                   <Label>Name</Label>
//                   <Input
//                     value={form?.name}
//                     onChange={(e) => setForm({ ...form, name: e.target.value })}
//                     placeholder="Name"
//                     required
//                   />
//                 </div>
//                 <div className="">
//                   <Label>Description</Label>
//                   <Input
//                     value={form?.description}
//                     onChange={(e) =>
//                       setForm({ ...form, description: e.target.value })
//                     }
//                     placeholder="Description"
//                     required
//                   />
//                 </div>
//                 <div className="flex flex-col gap-2">
//                   <Label>Status</Label>
//                   <Select
//                     value={String(form?.status)}
//                     onValueChange={(value) =>
//                       setForm({ ...form, status: value == "true" })
//                     }
//                   >
//                     <SelectTrigger className="w-[180p]">
//                       <SelectValue placeholder="Status" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="true">True</SelectItem>
//                       <SelectItem value="false">False</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//               <div className="flex justify-end mt-3">
//                 <div className="flex gap-3">
//                   <Button
//                     variant={"destructive"}
//                     type="button"
//                     onClick={() => {
//                       setIsOpen(false);
//                       setIsEdit(false);
//                       setForm({
//                         id: "",
//                         name: "",
//                         description: "",
//                         status: "",
//                       });
//                     }}
//                   >
//                     cancel
//                   </Button>
//                   <Button type="submit">{isEdit ? "Update" : "Save"}</Button>
//                 </div>
//               </div>
//             </form>
//           </DialogContent>
//         </Dialog>
//         {/* Delete */}
//         <Dialog open={isDelete} onOpenChange={setIsDelete}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>
//                 Do you want to delete {deleteData?.name}
//               </DialogTitle>
//               <DialogDescription>Brand</DialogDescription>
//             </DialogHeader>
//             <div className="flex justify-end">
//               <div className="flex gap-5">
//                 <Button
//                   variant={"outline"}
//                   onClick={() => {
//                     setDeleteData(null);
//                     setIsDelete(false);
//                   }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   variant={"destructive"}
//                   onClick={async () => {
//                     try {
//                       const res = await request(
//                         `brand/${deleteData?.id}`,
//                         "delete"
//                       );
//                       if (res) {
//                         console.log("Delete brand : ", res);
//                         fetchingData();
//                         setDeleteData(null);
//                         setIsDelete(false);
//                       }
//                     } catch (error) {
//                       console.log(error);
//                     }
//                   }}
//                 >
//                   Delete
//                 </Button>
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>
//       {/* table */}
//       <div className="mt-10">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               {tbl_head?.map((item, index) => (
//                 <TableHead key={index}>{item}</TableHead>
//               ))}
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell>
//                   <div className="flex items-center">
//                     <Spinner className={"size-10"} />
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ) : (
//               <>
//                 {brand?.map((item, index) => (
//                   <TableRow key={item.id || index}>
//                     <TableCell>{index + 1}</TableCell>
//                     <TableCell>{item?.name}</TableCell>
//                     <TableCell>{item?.description}</TableCell>
//                     <TableCell>
//                       {item?.status ? (
//                         <Badge
//                           variant={"secondary"}
//                           className={"bg-green-500 text-white"}
//                         >
//                           True
//                         </Badge>
//                       ) : (
//                         <Badge variant={"destructive"}>False</Badge>
//                       )}
//                     </TableCell>
//                     <TableCell>{formatDate(item?.created_at)}</TableCell>
//                     <TableCell>{formatDate(item?.updated_at)}</TableCell>
//                     <TableCell>
//                       <div className="flex gap-2 m-2">
//                         <Button
//                           onClick={() => {
//                             onEdit(item);
//                           }}
//                         >
//                           <Edit />
//                         </Button>
//                         <Button
//                         variant={"destructive"}
//                           onClick={() => {
//                             onDelete(item);
//                           }}
//                         >
//                           <Trash />
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// };

// export default BrandPage;
