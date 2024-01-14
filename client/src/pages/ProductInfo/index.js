import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice";
import { GetAllBids, GetProductById, GetProducts } from "../../apicalls/products";
import { Button, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import Divider from "../../components/Divider";
import moment from "moment";
import BidModal from "./BidModal";

function ProductInfo() {
    const {user}=useSelector((state)=>state.users)
  const [showAddNewBid,setShowAddNewBid]=useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProductById(id);
      dispatch(SetLoader(false));
      if (response.success) {
        const bidsResponse=await GetAllBids({product:id})
        setProduct({...response.data,bids:bidsResponse.data});
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    product && (
      <div>
        <div className="grid grid-cols-2 gap-5 mt-5">
          <div className="flex flex-col gap-5">
            <img
              src={product.images[selectedImageIndex]}
              alt=""
              className="w-full h-96 object-cover rounded-md"
            />
            <div className="flex gap-5">
              {product.images.map((image, index) => {
                return (
                  <img
                    className={
                      "w-20 h-20 object-cover rounded-md cursor-pointer" +
                      (selectedImageIndex === index
                        ? "border-1 border-green-600 border-dashed p-1"
                        : "")
                    }
                    onClick={() => setSelectedImageIndex(index)}
                    src={image}
                    alt=""
                  />
                );
              })}
            </div>

            <Divider />
            <div>
                <h1
                className="text-gray-600"
                >Added On</h1>
                <span>
                    {
                        moment(product.createdAt).format("MMM D, YYYY hh:mm A")
                    }
                </span>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div>
              <h1 className="text-2xl font-semibold text-green-900">
                {product.name}
              </h1>
              <span>{product.description}</span>
            </div>
            <Divider />
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold text-orange-900">
                Product Details
              </h1>
              <div className="flex justify-between mt-2">
                <span>Price</span>
                <span>$ {product.price}</span>
              </div>
              <div className="flex justify-between mt-2 ">
                <span>Category</span>
                <span className="uppercase" >{product.category}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Bill Available</span>
                <span> {product.billAvailable ?"Yes":"No"}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Box Available</span>
                <span> {product.boxAvailable ?"Yes":"No"}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Accessories Available</span>
                <span> {product.accessoriesAvailable ?"Yes":"No"}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Warranty Available</span>
                <span> {product.warrantyAvailable ?"Yes":"No"}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Purchased Year</span>
                <span> {moment().subtract(product.age,'years').format("YYYY")  }
               ( {product.age} years ago)
                </span>
              </div>
            </div>
            <Divider />
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold text-orange-900">
                Owner Details
              </h1>
              <div className="flex justify-between mt-2">
                <span>Name</span>
                <span> {product.seller.name}</span>
              </div>
              <div className="flex justify-between mt-2 ">
                <span>Email</span>
                <span >{product.seller.email}</span>
              </div>
              
            </div>
            <Divider />
            <div className="flex flex-col">
                <div className="flex justify-between mb-5">
                <h1 className="text-2xl font-semibold text-oragne-900">
                    Bids
                </h1>
                <Button
                onClick={()=>setShowAddNewBid(!showAddNewBid)}
                disabled={user._id===product.seller._id}
                
                >
                    New Bids
                </Button>

                </div>
                {
                    product.showBidsOnProductPage &&
                    product?.bids?.map((bid)=>{
                        return(
                            <div className="border border-gray-400 border-solid p-3 rounded mt-5">
                                <div className="flex justify-between mt-2">
                                    <span>Name</span>
                                    <span>
                                        {bid.buyer.name}
                                    </span>
                                </div>
                                <div className="flex justify-between mt-2">
                                    <span>Bid Amount</span>
                                    <span>
                                        {bid.bidAmount}
                                    </span>
                                </div>
                                <div className="flex justify-between mt-2">
                                    <span>Bid Placed On</span>
                                    <span>
                                        {
                                            moment(bid.createdAt).format("MMMM D, YYYY hh:mm A")
                                        }
                                    </span>
                                </div>
                            </div>
                        )
                    })
                }
                
            </div>


          </div>
        </div>
        {
            showAddNewBid && <BidModal 
            product={product}
            reloadData={getData}
            showBidModal={showAddNewBid}
            setShowBidModal={setShowAddNewBid}
            />
        }
      </div>
    )
  );
}

export default ProductInfo;
