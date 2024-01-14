import { Modal, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import moment from "moment";

import { GetAllBids } from "../../../apicalls/products";
import { SetLoader } from "../../../redux/loadersSlice";
import Divider from "../../../components/Divider";

function Bids() {
  const [bidsData, setBidsData] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users);
  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetAllBids({
        buyer: user._id,
      });
      dispatch(SetLoader(false));
      if (response.success) {
        setBidsData(response.data);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  const columns = [
    {
        title:"Product",
        dataIndex:"product",
        render:(text,record)=>{
            return record.product.name;
        }

    },
    {
      title: "seller Name",
      dataIndex: "seller",
      render: (text, record) => {
        return record.seller.name;
      },
    },
    {
      title: "Offered Price",
      dataIndex: "offeredPrice",
      render:(text,record)=>{
        return record.product.price
      }
      
    },
    {
      title: "Bid Amount",
      dataIndex: "bidAmount",
    },
    {
      title: "Bid Date",
      dataIndex: "createdAt",
      render: (text, record) => {
        return moment(text).format("MMMM Do YYYY,h:mm:ss a");
      },
    },
    {
      title: "Message",
      dataIndex: "message",
    },
    {
      title: "Contact Details",
      dataIndex: "contactDetails",
      render: (text, record) => {
        return (
          <div>
            <p>Phone: {record.mobile} </p>
            <p>Email: {record.buyer.email} </p>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    // <Modal
    //   title=""
    //   open={showBidsModal}
    //   onCancel={() => setShowBidsModal(false)}
    //   centered
    //   width={1400}
    //   footer={null}
    // >
    <div className="flex gap-3 flex-col">
      <Divider />

      <Table columns={columns} dataSource={bidsData} />
    </div>
    // </Modal>
  );
}

export default Bids;
