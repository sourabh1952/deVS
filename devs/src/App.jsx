import React, {useContext,createContext,useState} from 'react';
import Signin from './signin'; // Import the UserForm component
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from './signup';
import { ToastContainer, toast, Slide } from 'react-toastify';
import Home from './home';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  const [vid, setVid] = useState("null");
  const changeid  = (id)=>{
    setVid(id);
  }
  const [pin, setPin] = useState("")
  const changePin=(pin_)=>{
    setPin(pin_);
  }

  return (

    <>

    <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" transition: Slide
            />
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<Signin vid={vid} changeid={changeid} pin={pin} changePin={changePin}/>}/>
        <Route path="/signup" element={<Signup vid={vid} changeid={changeid} pin={pin} changePin={changePin}/>}/>
        <Route path="/home" element={<Home vid={vid} pin={pin}/>}/>

        <Route path="/*" element={<Signup vid={vid} changeid={changeid} pin={pin} changePin={changePin}/>}/>
      </Routes>
    </BrowserRouter>
    </>
  );
}




export default App;
