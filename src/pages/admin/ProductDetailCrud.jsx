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
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { request } from "@/utils/request/request";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { Edit, Plus, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function ProductDetailCrud() {
  const [productDetail, setProductDetail] = useState();
  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(false);
  // for CURD
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [form, setForm] = useState({
    color: "",
    size: "",
    made_in: "",
    status: true,
    product_id: "",
  });
  const tbl_head = [
    "No",
    "Color",
    "Size",
    "Made In",
    "Product Image",
    "Status",
    "Action",
  ];

  const fetchingData = async () => {
    const res = await request("productDetail", "get");
    const product = await request("product", "get");
    if (product) {
      setProduct(product?.data);
    }
    if (res) {
      console.log("ProductDetail :", res);
      setProductDetail(res?.data);
      setForm({
        color: "",
        size: "",
        made_in: "",
        status: true,
        product_id: "",
      });
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchingData();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("form data:", form);
    try {
      if (isEdit) {
        const res = await request(`productDetail/${form?.id}`, "put", form);
        if (res) {
          console.log("Update data : ", res);
          fetchingData();
        }
        setIsEdit(false);
      } else {
        const res = await request("productDetail", "post", form);
        if (res) {
          console.log("create ProductDetail: ", res);
          fetchingData();
        }
      }
    } catch (error) {
      console.log(error);
    }

    setIsOpen(false);
    setForm({
      color: "",
      size: "",
      made_in: "",
      status: true,
      product_id: "",
    });
  };
  const onEdit = (itemEdit) => {
    console.log("item edit :", itemEdit);
    setIsOpen(true);
    setForm(itemEdit);
    setIsEdit(true);
  };
  const onDelete = async (itemDelete) => {
    console.log("Item delete", itemDelete);
    setIsDelete(true);
    setDeleteData(itemDelete);
  };
  return (
    <div className="">
      <div className="">
        <div className="">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger>
              <Button className="flex mb-3 bg-blue-500 hover:bg-blue-600 ">
                <Plus /> Add Product Detail
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {isEdit ? "Update Product Detail" : "Create Product Detail"}
                </DialogTitle>
                <DialogDescription>Product Detail</DialogDescription>
              </DialogHeader>
              <form onSubmit={onSubmit}>
                <div className="flex flex-col ">
                  <div className="flex flex-rows justify-between mb-3">
                    <div className="w-55">
                      <Label className="mb-2">Color</Label>
                      <Input
                        value={form?.color}
                        onChange={(e) =>
                          setForm({ ...form, color: e.target.value })
                        }
                        placeholder="Enter the Color"
                        required
                      />
                    </div>
                    <div className="w-55">
                      <Label className="mb-2">Size</Label>
                      <Select
                        value={form?.size}
                        onValueChange={(value) =>
                          setForm({ ...form, size: value })
                        }
                      >
                        <SelectTrigger className="w-full h-12">
                          <SelectValue placeholder="Please Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="S">Small</SelectItem>
                          <SelectItem value="M">Medium</SelectItem>
                          <SelectItem value="L">Large</SelectItem>
                          <SelectItem value="XL">Extra Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="w-full ">
                    <div className="">
                      <Label className="mb-2 w-55">Product</Label>
                      <Select
                        className="flex w-full h-15"
                        value={form?.product_id}
                        onValueChange={(value) =>
                          setForm({ ...form, product_id: value })
                        }
                      >
                        <SelectTrigger className="w-full h-10">
                          <SelectValue placeholder="Please Select product" />
                        </SelectTrigger>
                        <SelectContent className={"text-lg"}>
                          {product?.map((item, index) => (
                            <SelectItem
                              key={index}
                              value={item?.id}
                              className="py-5 text-xl"
                            >
                              <div className="flex items-center gap-2 ">
                                {/* ✅ Show product image */}
                                <img
                                  src={item?.image_url}
                                  alt={item?.name}
                                  className="w-10 h-10 object-cover rounded"
                                />
                                {/* ✅ Show product name next to image */}
                                <span>{item?.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex flex-col mb-3 mt-7">
                    <Label className={"mb-2 w-55"}>Made In</Label>
                    <Input
                      value={form?.made_in}
                      onChange={(e) =>
                        setForm({ ...form, made_in: e.target.value })
                      }
                      placeholder="Enter the country "
                      required
                    />
                  </div>

                  <div className="flex justify-between ">
                    <div className="flex flex-col gap-2 w-50">
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
                    <div className="mt-5 flex gap-3.5">
                      <Button
                        onClick={() => {
                          setIsOpen(false);
                          setForm({
                            color: "",
                            size: "",
                            made_in: "",
                            status: true,
                            product_id: "",
                          });
                          setIsEdit(false);
                        }}
                        type="button"
                        variant={"destructive"}
                      >
                        Cancel
                      </Button>
                      <Button className={"bg-green-800"} type="submit">
                        {isEdit ? "Update" : "Save"}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Dialog open={isDelete} onOpenChange={setIsDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Do you want to delete {deleteData?.name}?</DialogTitle>
          </DialogHeader>
          <div className="flex justify-end">
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setDeleteData(null);
                  setIsDelete(false);
                }}
                variant={"outline"}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  try {
                    const res = await request(
                      `productDetail/${deleteData?.id}`,
                      "delete"
                    );
                    if (res) {
                      console.log("Deleted Product : ", res);
                      fetchingData();
                      setDeleteData(null);
                      setIsDelete(false);
                    }
                  } catch (error) {
                    console.log(error);
                  }
                }}
                variant={"destructive"}
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
          <TableHeader>
            <TableRow>
              {tbl_head.map((item, index) => (
                <TableCell key={index} className="border-gray-300">
                  {item}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell>
                  <div className="">
                    <Spinner className={"size-7"} />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {productDetail?.map((item, index) => (
                  <TableRow>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item?.color}</TableCell>
                    <TableCell>{item?.size}</TableCell>
                    <TableCell>{item?.made_in}</TableCell>
                    <TableCell>
                      {" "}
                      {item?.product?.image_url ? (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        "No image"
                      )}{" "}
                    </TableCell>
                    <TableCell>
                      {item?.status ? (
                        <Badge
                          className={"text-white bg-blue-700"}
                          variant={"Secondary"}
                        >
                          Active
                        </Badge>
                      ) : (
                        <Badge variant={"destructive"}>Inactive</Badge>
                      )}
                    </TableCell>
                    <div className="flex gap-2 m-1.5">
                      <Button
                        className={"bg-amber-500 hover:bg-amber-600"}
                        onClick={() => onEdit(item)}
                      >
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
