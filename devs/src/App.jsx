import React, {useContext,createContext,useState} from 'react';
import Signin from './signin'; // Import the UserForm component
import { BrowserRouter, Routes, Route } from "react-router-dom";
import cont from "./context"
import Signup from './signup';
// import Navbar from './navbar';


// const cont = createContext(null);
function App() {
  const [vid, setVid] = useState("null");
  const changeid  = (id)=>{
    setVid(id);
    console.log(vid + " changed");
  }
  return (

    <>

    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<Signin vid={vid} changeid={changeid}/>}/>
        <Route path="/signup" element={<Signup vid={vid} changeid={changeid}/>}/>
        {/* <Route path="/bye" element={<UserFodrm />}/> */}
      </Routes>
    </BrowserRouter>
    </>
  );
}




export default App;
