import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/utils/helper/format";
import { request } from "@/utils/request/request";
import axios from "axios";
import { Edit, Plus, Search, SearchSlash, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function CategoryPage() {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [query, setQuery] = useState("");

  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    status: true,
  });

  const fetchingData = async () => {
    setLoading(true);
    const res = await request("category", "get");

    if (res) {
      console.log("category data: ", res);
      setCategory(res?.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchingData();
  }, []);

  const tbl_head = [
    "No",
    "Name",
    "Desciption",
    "Status",
    "Created at",
    "Updated at",
    "Action",
  ];
  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("form data: ", form);
    try {
      if (isEdit) {
        const res = await request(`category/${form?.id}`, "put", form);
        if (res) {
          console.log("Update Category: ", res);
          fetchingData();
        }
        setIsEdit(false);
      } else {
        const res = await request("category", "post", form);
      }
      if (res) {
        console.log("Create category : ", res);
        fetchingData();
      }
    } catch (error) {
      console.log(error);
    }

    setIsOpen(false);
    setForm({
      id: "",
      name: "",
      description: "",
      status: "",
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
    <div>
      <div className="flex justify-between ">
        <div className="flex gap-3 items-center">
          <h1>Category</h1>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Category"
          />
          <Button
            onClick={async () => {
              setLoading(true);
              const res = await request(`category/search?q=${query}`, "get");
              if (res) {
                console.log("category data: ", res?.data);
                setCategory(res?.data);
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

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger>
            <Button>
              <Plus />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEdit ? "Update Category" : "Create Category"}
              </DialogTitle>
              <DialogDescription>Category</DialogDescription>
            </DialogHeader>
            <form onSubmit={onSubmit} action="">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Label>Name</Label>
                  <Input
                    value={form?.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Name"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Description</Label>
                  <Input
                    value={form?.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Description"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Status</Label>
                  <Select
                    value={String(form?.status)}
                    onValueChange={(value) =>
                      setForm({ ...form, status: value == "true" })
                    }
                  >
                    <SelectTrigger className="w-[180p]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">True</SelectItem>
                      <SelectItem value="false">False</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/*  */}
              <div className="flex justify-end mt-3 ">
                <div className="flex gap-3">
                  <Button
                    variant={"outline"}
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setIsEdit(false);
                      setForm({
                        id: "",
                        name: "",
                        description: "",
                        status: "",
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">{isEdit ? "Update" : "Save"}</Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {/* for delete  */}
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
                      `category/${deleteData?.id}`,
                      "delete"
                    );
                    if (res) {
                      console.log("delete Category: ", res);
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
      <div className="mt-10">
        <Table>
          <TableHeader>
            <TableRow>
              {tbl_head?.map((item, index) => (
                <TableHead key={index}>{item}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colspan={7}>
                  <div className="flex justify-center mt-25">
                    <Spinner className={"size-15"} />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {category?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item?.name}</TableCell>
                    <TableCell>{item?.description}</TableCell>
                    <TableCell>
                      {item?.status ? (
                        <Badge
                          variant={"secondary"}
                          className={"bg-green-500 text-white"}
                        >
                          True
                        </Badge>
                      ) : (
                        <Badge variant={"destructive"}>Fail</Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(item?.created_at)}</TableCell>
                    <TableCell>{formatDate(item?.updated_at)}</TableCell>
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
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
