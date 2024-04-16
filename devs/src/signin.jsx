import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate} from 'react-router-dom';
import { ToastContainer, toast, Slide } from 'react-toastify';


export default function Signup({vid,changeid,pin,changePin}) {

  const navigate = useNavigate();
  const wrongPIN=()=>{
    toast("PIN invalid. Please try again")
  }
  
  const [vid_, setVid_] = useState(""); 
  const [pin_, setPin_] = useState(""); 
  const [result, setResult] = useState(""); 
  

  
  
  
  async function handleSubmit(e) {
      e.preventDefault(); 
      console.log(e);

  } 

  function handleChangeId(e) { 
    setVid_(e.target.value); 

  }
  function handleChangePin(e) { 
    setPin_(e.target.value); 

  }
  
  const signinclick=async(vid_,pin_)=>{
      changeid(vid_);
      changePin(pin_);

      const dataToSend={
        vid : vid_,
        pin : pin_
      }
      axios.post("http://localhost:5001/signin",dataToSend).then(res=>{
      if (res.status==200){
        navigate("/home");
      }
      
    })
    .catch(res=>{

      if (res.response.status==401){
        toast.error('Invalid PIN. Try again', {position: "top-center",autoClose: 5000,hideProgressBar: false,closeOnClick: true,pauseOnHover: false,draggable: true,progress: 0,theme: "colored",transition: Slide,});
      }
      else if (res.response.status==404){
        toast.error('ID not available. Create an account first', {position: "top-center",autoClose: 5000,hideProgressBar: false,closeOnClick: true,pauseOnHover: false,draggable: true,progress: 0,theme: "colored",transition: Slide,});
      }
      else{
        toast.error('Unexpected error happened. Try again.', {position: "top-center",autoClose: 5000,hideProgressBar: false,closeOnClick: true,pauseOnHover: false,draggable: true,progress: 0,theme: "colored",transition: Slide,});
      }
    })
}


  return (
    <div className='relative w-full h-screen bg-zinc-900/90'>
      

      <div className='flex justify-center items-center h-full'>
        <div className='max-w-[400px] w-full mx-auto bg-white p-8' >
          <h2 className='text-4xl font-bold text-center py-4'>BRAND.</h2>
          <div className='flex flex-col mb-4'>
            <label>Voter ID</label>
            <input 
              className='border relative bg-gray-100 p-2' 
              type="text" 
              vid_={vid_} 
              onInput={handleChangeId} 
              placeholder='Enter Voter ID'
              />
          </div>
          <div className='flex flex-col mb-4'>
            <label>PIN</label>
            <input 
              vid_={pin_}
              className='border relative bg-gray-100 p-2' 
              onInput={handleChangePin} 
              type="password" 
              // hidden
              placeholder='Enter PIN'

            />
          </div>
          
          <button onClick={()=>signinclick(vid_,pin_)}type="submit" className='w-full py-3 mt-8 bg-indigo-600 hover:bg-indigo-500 relative text-white'>Sign in</button>
          <p className='text-center mt-8'>Not a member? <Link to="/signup"><button className='bg-gray-400 gradient'>Sign up</button></Link></p>
          <div> 
                <h4>{result}</h4> 
            </div> 
        </div>
      </div>
      
    </div>
  );
}
