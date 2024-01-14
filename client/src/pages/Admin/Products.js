import { Button, Table, message } from "antd";
import React, { useEffect, useState } from "react";
// import ProductsForm from "./ProductsForm";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice";
import { EditProduct, GetProducts, UpdateProductStatus } from "../../apicalls/products";
import moment from "moment/moment";
import { axiosInstance } from "../../apicalls/axiosInstance";

function Products() {
  const [products, setProducts] = useState([]);

  const dispatch = useDispatch();
  //   const {user}=useSelector((state)=>state.users)

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProducts(null);
      dispatch(SetLoader(false));
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  const onStatusUpdate = async (id, status) => {

    try{
        dispatch(SetLoader(true));
        const response=await UpdateProductStatus(id,status);
        dispatch(SetLoader(false));
        if(response.success){
            message.success(response.message)
            getData()

        }else{
            throw new Error(response.message)
        }
    }catch(error){
        dispatch(SetLoader(false));
        message.error(error.message);
    }
  };
  //   const deleteProduct=async(id)=>{
  //     try{
  //         dispatch(SetLoader(true));
  //         const response=await DeleteProduct(id);
  //         dispatch(SetLoader(false));
  //         if(response.success){
  //             message.success(response.message);
  //             getData();
  //         }else{
  //             message.error(response.message)
  //         }
  //     }catch(error){
  //         dispatch(SetLoader(false));
  //         message.error(error.message)
  //     }
  //   }
  const columns = [
    {
      title: "Product",
      dataIndex: "image",
      render:(text,record)=>{
        return <img className="w-20 h-20 object-cover rounded-md" src={record?.images?.length >0 ? record.images[0]:""} />
      }
    },
    {
      title: "Product",
      dataIndex: "name",
    },
    {
      title: "Seller",
      dataIndex: "name",
      render: (text, record) => {
        return record.seller.name;
      },
    },
    // {
    //   title: "Description",
    //   dataIndex: "description",
    // },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Age",
      dataIndex: "age",
    },
    {
      title: "Status",
      dataIndex: "status",
      render:(text,record)=>{
        return record.status.toUpperCase();
      }
    },
    {
      title: "Added On",
      dataIndex: "createdAt",
      render: (text, record) =>
        moment(record.createdAt).format("DD-MM-YYYY hh:mm A"),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        const { status, _id } = record;
        return (
          <div>
            {status === "pending" && (
              <span
                className="underline cursor-pointer"
                onClick={() => onStatusUpdate(_id, "approved")}
              >
                Approve
              </span>
            )}
            {status === "pending" && (
              <span
                className="underline cursor-pointer ml-6"
                onClick={() => onStatusUpdate(_id, "rejected")}
              >
                Reject
              </span>
            )}
            {status === "approved" && (
              <span
                className="underline cursor-pointer"
                onClick={() => onStatusUpdate(_id, "blocked")}
              >
                Block
              </span>
            )}
            {status === "blocked" && (
              <span
                className="underline cursor-pointer"
                onClick={() => onStatusUpdate(_id, "approved")}
              >
                UnBlock
              </span>
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      {/* <div className="flex justify-end mb-2">
        <Button type="default" onClick={() =>{
            setSelectedProduct(null)
            setShowProductForm(true)}}>
          Add Product
        </Button>
      </div> */}
      <Table columns={columns} dataSource={products} />

      {/* {showProductForm && (
        <ProductsForm
          showProductForm={showProductForm}
          setShowProductForm={setShowProductForm}
          selectedProduct={selectedProduct}
          getData={getData}
        />
      )} */}
    </div>
  );
}

// update product status 


export default Products;
