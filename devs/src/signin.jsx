import React, { useContext, useState } from 'react';
import axios from 'axios';
// import { useHistory } from "react-router-dom";
import cont from "./context"
import { Link, useNavigate } from 'react-router-dom';
export default function Signup({vid,changeid}) {
  // let history = useHistory();

  // setVid("ello");
  

  
  const [vid_, setVid_] = useState(""); 
  const [pin_, setPin_] = useState(""); 
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
    setVid_(e.target.vid_); 

  }
  function handleChangePin(e) { 
    setPin_(e.target.vid_); 

  }
  
  const signinclick=async(vid_,pin_)=>{
    
  }
  

  return (
    <div className='relative w-full h-screen bg-zinc-900/90'>
      

      <div className='flex justify-center items-center h-full'>
        <form className='max-w-[400px] w-full mx-auto bg-white p-8' >
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
              onInput={handleChangeId} 
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
        </form>
      </div>
    </div>
  );
}
