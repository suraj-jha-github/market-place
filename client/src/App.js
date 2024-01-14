import { BrowserRouter as Main , Routes ,Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import ProtectedPage from "./components/ProtectedPage";
import Spinner from "./components/Spinner";
import { useSelector } from "react-redux";
import ProductInfo from "./pages/ProductInfo";



function App() {
  const {loading}=useSelector(state=>state.loaders);
  return (
    <div >
      {loading && <Spinner/>}
      <Main>
        <Routes>
          <Route path="/" element={<ProtectedPage> <Home/></ProtectedPage>} />
          <Route path="/product/:id" element={<ProtectedPage> <ProductInfo/></ProtectedPage>} />
          <Route path="/profile" element={<ProtectedPage><Profile/></ProtectedPage> }/>
          <Route path="/admin" element={<ProtectedPage><Admin/></ProtectedPage> }/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
        </Routes>
      </Main>
     
    </div>
  );
}

export default App;
