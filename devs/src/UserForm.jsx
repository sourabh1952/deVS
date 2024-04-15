import React, { useState } from 'react';
import axios from 'axios';

export default function UserForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:5000/checkUser', {
        username: username
      });
  
      if (response.data.message === 'User exists') {
        console.log('User exists');
        // Display an error message or prevent sign-in
        alert('Username already exists. Please choose a different username.');
      } else {
        console.log('User not found');
        // Continue with sign-in
        // For example, redirect to another page or perform sign-in action
      }
    } catch (error) {
      console.error('Error checking user:', error);
    }
  };
  

  return (
    <div className='relative w-full h-screen bg-zinc-900/90'>
      <div className='flex justify-center items-center h-full'>
        <form className='max-w-[400px] w-full mx-auto bg-white p-8' onSubmit={handleSubmit}>
          <h2 className='text-4xl font-bold text-center py-4'>BRAND.</h2>
          <div className='flex flex-col mb-4'>
            <label>Username</label>
            <input 
              className='border relative bg-gray-100 p-2' 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          
        </form>
      </div>
    </div>
  );
}
