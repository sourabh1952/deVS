import React, { useContext, useState } from 'react';
import axios from 'axios';
import Card from './card';
import { ToastContainer, toast, Slide } from 'react-toastify';

export default function Home({vid,pin}){

    const [party, setParty_] = useState(""); 

    const changeParty=(par_)=>{
      setParty_(par_);
    }
    const parties=[
      {pname : "P1", id : 1},
      {pname : "P2", id : 2},
      {pname : "P3", id : 3},
      {pname : "P4", id : 4},
      {pname : "P5", id : 5}
    ]

    const [voteText, setVoteText] = useState('');

    const handleTextareaChange = (e) => {
        setVoteText(e.target.value);

        
      };
    
      

    function handleChangeId(e) { 
        setParty_(e.target.value); 
    }

    return (
        
        <div className="grid grid-cols-3 gap-3 p-3">
        {/* <Card val={}/> */}
        {parties.map((elements,index)=>(

          <Card vid={vid} pin={pin} party={party} val={elements["id"]} curr_par={party} changeParty={changeParty}  key={index} pname={elements["pname"]}
                    voteText={voteText} handleTextareaChange={handleTextareaChange}/>

        ))}
      
      </div>
      
    );
}