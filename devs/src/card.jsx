import {React, useState} from "react";
import {toast,Slide} from "react-toastify"
import axios from "axios";
export default function Card({vid,pin,party,val,curr_par,changeParty,pname,voteText,handleTextareaChange}){
    
    const handleSubmit = async(pname) => {

        if(pname == voteText){

        
            const dataToSend={
            vid:vid ,
            pin:pin,
            party:party,
            }
            const res = await axios.post("http://localhost:5001/vote",dataToSend);
            if(res.status==1000){
            toast.error('You have already voted', {position: "top-center",autoClose: 5000,hideProgressBar: false,closeOnClick: true,pauseOnHover: false,draggable: true,progress: 0,theme: "colored",transition: Slide,});
            }
            else if(res.status==200){
                toast.success('Succesfully voted', {position: "top-center",autoClose: 5000,hideProgressBar: false,closeOnClick: true,pauseOnHover: false,draggable: true,progress: 0,theme: "colored",transition: Slide,});

            }
            else{
                toast.success('Some internal error occured. Please try again', {position: "top-center",autoClose: 5000,hideProgressBar: false,closeOnClick: true,pauseOnHover: false,draggable: true,progress: 0,theme: "colored",transition: Slide,});

            }
        }
        else{
            toast.error('Please fill in correctly', {position: "top-center",autoClose: 5000,hideProgressBar: false,closeOnClick: true,pauseOnHover: false,draggable: true,progress: 0,theme: "colored",transition: Slide,});

        }

    };
    
    return (
        
        <div
        className="flex flex-col rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 md:max-w-xl md:flex-row">
        {/* <img
            className="h-96 w-full rounded-t-lg object-cover md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
            src="https://tecdn.b-cdn.net/wp-content/uploads/2020/06/vertical.jpg"
            alt="" /> */}
        <div className="flex flex-col justify-start p-6">
            <h5
            className="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-50">
            {pname}
            </h5>
            {val!=curr_par && <button
              type="button"
              value={val}
              onClick={() => changeParty(val)}
            //   onChange={handleChangeId}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Vote Here
            </button>}

            {val==curr_par && (
                <div>
            <div>
                <p>Enter {pname}</p>
                <textarea
                value={voteText}
                onChange={handleTextareaChange}
                placeholder={`Enter ${pname}`}
                className="border"
                />
                
                <button
                    onClick={()=>handleSubmit(pname)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Submit Vote
                </button>
                
            </div>
            </div>
            )}
        </div>
    </div>

        )
    };
