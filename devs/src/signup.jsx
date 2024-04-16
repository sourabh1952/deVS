import React, { useContext, useState } from 'react';
import axios from 'axios';
// import { useHistory } from "react-router-dom";
import cont from "./context"
import { Link, useNavigate } from 'react-router-dom';
import { version } from 'react-dom';
import { ToastContainer, toast, Slide } from 'react-toastify';

export default function Signin({vid,changeid}) {
  // let history = useHistory();

  // setVid("ello");
  

  
  const [vid_, setVid_] = useState(""); 
  const [pin2_, setPin2_] = useState(""); 
  const [pin1_, setPin1_] = useState(""); 
  const [result, setResult] = useState(""); 
  

  
  
  
  async function handleSubmit(e) {
    e.preventDefault(); 
console.log(e);
    // try {
      
    //   const response = await axios.get(`http://localhost:5001/getDataByVoterId/${vid_}`);
      
    //   console.log(response);

    //   if (response.data.length > 0) {
    //     setResult("Form has been submitted with Input: " + vid_);
    //     // You can proceed with form submission here if needed
    //   } else {
    //     setResult("Error: Voter ID does not exist.");
    //   }
    // } catch (error) {
    //   console.error("Error checking voter_id:", error);
    //   setResult("Error checking voter_id. Please try again." + vid_);
    // }
  } 

  function handleChangeId(e) { 
    setVid_(e.target.value); 

  }
  function handleChangePin2(e) { 
    setPin2_(e.target.value); 

  }
  function handleChangePin1(e) { 
    setPin1_(e.target.value); 

  }
  
  const signupclick=async(vid_,pin1_)=>{
    try{
      const dataToSend={
        vid:vid_,
        pin:pin1_
      }
      axios.post(`http://localhost:5001/signup`,dataToSend)
        .then(response=>{
      console.log('Response Code:', response.status);
      console.log('Response Data:', response.data);
      console.log("here")
      console.log(response);

      if (response.status==200){
        toast.success('Account setup successfully', {position: "top-center",autoClose: 5000,hideProgressBar: false,closeOnClick: true,pauseOnHover: false,draggable: true,progress: 0,theme: "colored",transition: Slide,});

      }
      
    }).catch(res=>{
      console.log(res);
      if (res.status==500){
        toast.error('Some internal error occured', {position: "top-center",autoClose: 5000,hideProgressBar: false,closeOnClick: true,pauseOnHover: false,draggable: true,progress: 0,theme: "colored",transition: Slide,});

      }
      else if (res.response.status==400){
        console.log("here")
        toast.error('Invalid VID', {position: "top-center",autoClose: 5000,hideProgressBar: false,closeOnClick: true,pauseOnHover: false,draggable: true,progress: 0,theme: "colored",transition: Slide,});

      }
      else if (res.response.status==401){
        toast.error('Account already made. Please sign in', {position: "top-center",autoClose: 5000,hideProgressBar: false,closeOnClick: true,pauseOnHover: false,draggable: true,progress: 0,theme: "colored",transition: Slide,});

      }
      else {
        toast.error('Some internal error occured', {position: "top-center",autoClose: 5000,hideProgressBar: false,closeOnClick: true,pauseOnHover: false,draggable: true,progress: 0,theme: "colored",transition: Slide,});

      }
    })
    }
    catch(e){
      console.log(e);
    }
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
              onChange={handleChangeId} 
              placeholder='Enter Voter ID'
              />
          </div>
          <div className='flex flex-col mb-4'>
            <label>PIN</label>
            <input 
              vid_={pin1_}
              className='border relative bg-gray-100 p-2' 
              onChange={handleChangePin1} 
              type="password" 
              // hidden
              placeholder='Enter PIN'

            />
          </div>
          <div className='flex flex-col '>
            <label>Retype PIN</label>
            <input 
              vid_={pin2_}
              className='border relative mt-[1px] bg-gray-100 p-2' 
              onInput={handleChangePin2} 
              type="password" 
              // hidden
              placeholder='Retype PIN'

            />
          </div>
          <button onClick={()=>signupclick(vid_,pin1_)} className='w-full py-3 mt-8 bg-indigo-600 hover:bg-indigo-500 relative text-white'>Sign up</button>

          <p className='text-center mt-8'>Already a member? <Link to="/signin"><button className='bg-gray-400 gradient'>Sign in</button></Link></p>
          <div> 
                <h4>{result}</h4> 
            </div> 
        </div>
      </div>
    </div>
  );
}
