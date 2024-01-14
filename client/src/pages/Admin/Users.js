import { Button, Table, message } from "antd";
import React, { useEffect, useState } from "react";
// importForm from "./ProductsForm";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice";
import {
  EditProduct,
  GetProducts,
  UpdateProductStatus,
} from "../../apicalls/products";
import moment from "moment/moment";
import { axiosInstance } from "../../apicalls/axiosInstance";
import { GetAllUsers, UpdateUserStatus } from "../../apicalls/users";

function Users() {
  const [users, setUsers] = useState([]);

  const dispatch = useDispatch();
  //   const {user}=useSelector((state)=>state.users)

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetAllUsers(null);
      dispatch(SetLoader(false));
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  const onStatusUpdate = async (id, status) => {
    try {
      dispatch(SetLoader(true));
      const response = await UpdateUserStatus(id, status);
      dispatch(SetLoader(false));
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
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
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      role: "Admin",
      dataIndex: "role",
      render: (text, record) => {
        return record.role.toUpperCase();
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (text, record) =>
        moment(record.createdAt).format("DD-MM-YYYY hh:mm A"),
    },

    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => {
        return record.status.toUpperCase();
      },
    },

    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        const { status, _id } = record;
        return (
          <div>
           
            {status === "active" && (
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
                onClick={() => onStatusUpdate(_id, "active")}
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
      <Table columns={columns} dataSource={users} />

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

export default Users;
