import React, { useEffect } from "react";
import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Divider from "../../components/Divider";
import { LoginUser } from "../../apicalls/users";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice";
const rules = [
  {
    required: true,
    message: "required",
  },
];

function Login() {
    const navigate=useNavigate();
    const dispatch=useDispatch()
  const onFinish = async(values) => {
    try {
        dispatch(SetLoader(true))
        const response=await LoginUser(values);
        dispatch(SetLoader(false))
        if(response.success){
            message.success(response.message)
            localStorage.setItem("token",response.data);
            window.location.href="/"
        }else{
            throw new Error(response.message)
        }
        
    } catch (error) {
        dispatch(SetLoader(false))
        message.error(error.message)
        
    }
    
  };
  useEffect(()=>{
    if(localStorage.getItem('token')){
        navigate("/");
    }
  },[])
  return (
    <div className="flex justify-center items-center h-screen bg-primary">
      <div className="bg-white p-3 rounded w-[450px]">
        <h1 className="text-primary text-2xl ">
          OLX
          <span className="text-gray-400 ">- Login</span>
        </h1>
        <Divider />
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item rules={rules} label="Email" name="email">
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item rules={rules} label="Password" name="password">
            <Input placeholder="Password" />
          </Form.Item>

          <Button
            className="mt-2"
            rules={rules}
            type="primary"
            htmlType="submit"
            block
          >
            Submit
          </Button>
          <div className="mt-5 text-center">
            <span className="text-gray-500">
              Don't have an account ?{" "}
              <Link className="text-primary" to="/register">
                Register
              </Link>
            </span>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;
