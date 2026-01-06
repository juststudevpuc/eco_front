import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/utils/helper/format";
import { request } from "@/utils/request/request";
import { Edit, Search, SearchSlash, Trash } from "lucide-react";
import { useEffect, useState } from "react";

export default function DeliveryPage() {
  const [delivery, setDelivery] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({
    id: "",
    email: "",
    phone: "",
    first_name: "",
    last_name: "",
    address: "",
    province: "",
    country: "",
    status: true,
  });

  const fetchingData = async () => {
    setLoading(true);
    const res = await request("delivery", "get");
    if (res) {
      setDelivery(res?.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchingData();
  }, []);

  const tbl_head = [
    "No",
    "Email",
    "Phone",
    "First Name",
    "Last Name",
    "Address",
    "Province",
    "Country",
    "Total Paid",
    "Status",
    "Created At",
    "Updated At",
    "Action",
  ];
  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("form data: ", form);
    try {
      if (isEdit) {
        const res = await request(`delivery/${form?.id}`, "put", form);
        if (res) {
          console.log("Update delivery: ", res);
          fetchingData();
        }
        setIsEdit(false);
      } else {
        const res = await request("delivery", "post", form);
      }
      if (res) {
        console.log("Create delivery : ", res);
        fetchingData();
      }
    } catch (error) {
      console.log(error);
    }

    setIsOpen(false);
    setForm({
      id: "",
      email: "",
      phone: "",
      first_name: "",
      last_name: "",
      address: "",
      province: "",
      country: "",
      status: true, // boolean instead of string
      // to: "", // reference to the order });
    });
  };

  const onEdit = (itemEdit) => {
    console.log("Item Edit :", itemEdit);
    setIsOpen(true);
    setForm(itemEdit);
    setIsEdit(true);
  };

  const onDelete = async (itemDelete) => {
    console.log("Item Delete : ", itemDelete);
    setIsDelete(true);
    setDeleteData(itemDelete);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between ">
        <div className="flex gap-3 items-center">
          <h1>delivery</h1>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search delivery"
          />
          <Button
            onClick={async () => {
              setLoading(true);
              const res = await request(`delivery/search?q=${query}`, "get");
              if (res) {
                console.log("delivery data: ", res?.data);
                setDelivery(res?.data);
                setLoading(false);
              }
            }}
          >
            <Search />
          </Button>
          <Button
            onClick={() => {
              fetchingData();
              setQuery("");
            }}
          >
            <SearchSlash />
          </Button>
        </div>
        {/* form Update */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEdit ? "Update Delivery" : " "}</DialogTitle>
              <DialogDescription>Delivery</DialogDescription>
            </DialogHeader>
            <form action="" onSubmit={onSubmit}>
              <div className="">
                <div className="flex gap-2 w-full">
                  <Label>Email</Label>
                  <Input
                    value={form?.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder=""
                    required
                  />
                </div>
                <div className="">
                  <div className="flex mt-3 flex-row justify-between ">
                    <div className="flex flex-col gap-2 w-55">
                      <Label>First Name</Label>
                      <Input
                        value={form?.first_name}
                        onChange={(e) =>
                          setForm({ ...form, first_name: e.target.value })
                        }
                        placeholder=""
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2 w-55">
                      <Label>Last Name</Label>
                      <Input
                        value={form?.last_name}
                        onChange={(e) =>
                          setForm({ ...form, last_name: e.target.value })
                        }
                        placeholder=""
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-row mt-3 justify-between">
                    <div className="flex flex-col gap-2 w-55">
                      <Label>Phone Number</Label>
                      <Input
                        value={form?.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        placeholder=""
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2 w-55">
                      <Label>Address</Label>
                      <Input
                        value={form?.address}
                        onChange={(e) =>
                          setForm({ ...form, address: e.target.value })
                        }
                        placeholder=""
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-row justify-between mt-3">
                    <div className="flex flex-col w-55 gap-2">
                      <Label>Country</Label>
                      <Input value={form?.country} />
                    </div>
                    <div className="flex flex-col w-55 gap-2">
                      <Label>Province</Label>
                      <Input
                        value={form?.province}
                        onChange={(e) =>
                          setForm({ ...form, province: e.target.value })
                        }
                        placeholder=""
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-row justify-between mt-3">
                    <div className="flex flex-col w-55 gap-2">
                      <Label>Status</Label>
                      <Select
                        value={String(form?.status)}
                        onValueChange={(value) =>
                          setForm({ ...form, status: value == "true" })
                        }
                      >
                        <SelectTrigger className={"w-full"}>
                          <SelectValue placeholder="Please Select The Status"></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Active</SelectItem>
                          <SelectItem value="false">Unactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => {
                          setIsOpen(false);
                          setForm({
                            id: "",
                            email: "",
                            phone: "",
                            first_name: "",
                            last_name: "",
                            address: "",
                            province: "",
                            country: "",
                            status: "",
                          });
                          setIsEdit(false);
                        }}
                        type="button"
                        variant={"outline"}
                      >
                        Cancel
                      </Button>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button type="submit">{isEdit ? "update" : ""}</Button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Dialog open={isDelete} onOpenChange={setIsDelete}>
        <DialogTrigger></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure to delete {deleteData?.name} ?{" "}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-3 flex justify-end ">
            <div className="flex gap-5 ">
              <Button
                variant={"outline"}
                onClick={() => {
                  setDeleteData(null);
                  setIsDelete(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant={"destructive"}
                onClick={async () => {
                  try {
                    const res = await request(
                      `delivery/${deleteData?.id}`,
                      "delete"
                    );
                    if (res) {
                      console.log("delete delivery: ", res);
                      fetchingData();
                      setDeleteData(null);
                      setIsDelete(false);
                    }
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* table */}
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
        <Table className="w-full border-collapse">
          {/* Table Header */}
          <TableHeader>
            <TableRow className="bg-gray-100">
              {tbl_head.map((item, index) => (
                <TableCell
                  key={index}
                  className="px-4 py-2 font-semibold text-gray-700 border border-gray-200"
                >
                  {item}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={tbl_head.length}
                  className="text-center py-6"
                >
                  <Spinner />
                </TableCell>
              </TableRow>
            ) : delivery.length > 0 ? (
              delivery.map((item, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="px-4 py-2 border border-gray-200">
                    {index + 1}
                  </TableCell>
                  <TableCell className="px-4 py-2 border border-gray-200">
                    {item?.email}
                  </TableCell>
                  <TableCell className="px-4 py-2 border border-gray-200">
                    {item?.phone}
                  </TableCell>
                  <TableCell className="px-4 py-2 border border-gray-200">
                    {item?.first_name}
                  </TableCell>
                  <TableCell className="px-4 py-2 border border-gray-200">
                    {item?.last_name}
                  </TableCell>
                  <TableCell className="px-4 py-2 border border-gray-200">
                    {item?.address}
                  </TableCell>
                  <TableCell className="px-4 py-2 border border-gray-200">
                    {item?.province}
                  </TableCell>
                  <TableCell className="px-4 py-2 border border-gray-200">
                    {item?.country}
                  </TableCell>
                  <TableCell className="  px-4 py-2 border border-gray-200">
                    {item?.order?.total_paid}
                  </TableCell>
                  <TableCell className="px-4 py-2 border border-gray-200">
                    {item?.status ? (
                      <Badge className="bg-blue-600 text-white">Active</Badge>
                    ) : (
                      <Badge variant="destructive">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-2 border border-gray-200">
                    {formatDate(item?.created_at)}
                  </TableCell>
                  <TableCell className="px-4 py-2 border border-gray-200">
                    {formatDate(item?.updated_at)}
                  </TableCell>
                  <div className="flex gap-2 m-2">
                    <Button onClick={() => onEdit(item)}>
                      <Edit />
                    </Button>
                    <Button
                      variant={"destructive"}
                      onClick={() => onDelete(item)}
                    >
                      <Trash />
                    </Button>
                  </div>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tbl_head.length}
                  className="text-center py-6 text-gray-500"
                >
                  No deliveries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
