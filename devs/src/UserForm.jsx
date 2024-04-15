import React, { useState } from 'react';
import axios from 'axios';

export default function UserForm() {

  const [value, setValue] = useState(""); 
  const [result, setResult] = useState(""); 

  async function handleSubmit(e) {
    e.preventDefault(); 

    try {
      // Check if the voter_id exists
      const response = await axios.get(`http://localhost:5000/getDataByVoterId/${value}`);
      // <console className="log">response</console>
      console.log(response);
      if (response.data.length > 0) {
        setResult("Form has been submitted with Input: " + value);
        // You can proceed with form submission here if needed
      } else {
        setResult("Error: Voter ID does not exist.");
      }
    } catch (error) {
      console.error("Error checking voter_id:", error);
      setResult("Error checking voter_id. Please try again." + value);
    }
  } 

  function handleChange(e) { 
    setValue(e.target.value); 
    setResult(""); 
  } 
  

  return (
    <div className='relative w-full h-screen bg-zinc-900/90'>
      <div className='flex justify-center items-center h-full'>
        <form className='max-w-[400px] w-full mx-auto bg-white p-8' onSubmit={handleSubmit}>
          <h2 className='text-4xl font-bold text-center py-4'>BRAND.</h2>
          <div className='flex flex-col mb-4'>
            <label>voter_id</label>
            <input 
              className='border relative bg-gray-100 p-2' 
              type="text" 
              value={value} 
              onInput={handleChange} 
              required
            />
          </div>
          <div className='flex flex-col '>
            <label>Password</label>
            <input 
              className='border relative bg-gray-100 p-2' 
              type="password" 
              required 
            />
          </div>
          <button type="submit" className='w-full py-3 mt-8 bg-indigo-600 hover:bg-indigo-500 relative text-white'>Sign In</button>
          <p className='flex items-center mt-2'><input className='mr-2' type="checkbox"  />Remember Me</p>
          <p className='text-center mt-8'>Not a member? <button className='bg-gray-400 gradient'>Sign up now</button></p>
          <div> 
                <h4>{result}</h4> 
            </div> 
        </form>
      </div>
    </div>
  );
}
