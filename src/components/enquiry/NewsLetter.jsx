import React, { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import axios from "axios";
import iziToast from "izitoast";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic-light-dark.css";


export default function NewsLetter(){

    const [newsletter,setNewsletter] = useState([]);

    const [selectedRecord,setSelectedRecord] = useState([]);

    const [apiStatus,setApiStatus] = useState(false);

    const [currentPage,setCurrentPage] = useState(1);

    const [totalPages,setTotalPages] = useState(1);

    const [openFilter,setOpenFilter] = useState(false);

    const [filterEmail,setFilterEmail] = useState("");

    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/newsletter`;



    useEffect(()=>{


        axios.post(
            `${apiUrl}/view`,
            {
                page:currentPage,
                limit:10,
                email:filterEmail
            }
        )
        .then((result)=>{


            if(result.data._status){

                setNewsletter(result.data._data);
                setTotalPages(result.data._paginate?.total_pages || 1);

            }
            else{

                setNewsletter([]);
                setTotalPages(1);

            }


        })
        .catch(()=>{

            iziToast.error({
                title:"Error",
                message:"Something went wrong",
                position:"topRight"
            })

        })


    },[apiUrl,currentPage,apiStatus,filterEmail]);


    const applyFilter=(event)=>{

        event.preventDefault();
        setCurrentPage(1);
        setFilterEmail(event.target.email.value.trim());

    }


    const clearFilter=()=>{

        setCurrentPage(1);
        setFilterEmail("");

    }





    // Single Select

    const singleCheck=(id)=>{


        if(selectedRecord.includes(id)){

            setSelectedRecord(
                selectedRecord.filter(v=>v!==id)
            )

        }
        else{

            setSelectedRecord([
                ...selectedRecord,
                id
            ])

        }

    }





    // Select All

    const selectAll=()=>{


        if(selectedRecord.length === newsletter.length){

            setSelectedRecord([]);

        }
        else{

            let ids=[];


            newsletter.forEach((item)=>{

                ids.push(item._id);

            })


            setSelectedRecord(ids);

        }


    }






    // Change Status

    const changeStatus=()=>{


        if(selectedRecord.length===0){

            iziToast.error({

                title:"Error",
                message:"Please select record",
                position:"topRight"

            })

            return;

        }



        axios.put(

            `${apiUrl}/change-status`,

            {
                ids:selectedRecord
            }

        )
        .then((result)=>{

            if(!result.data._status){
                throw new Error(result.data._message);
            }

            iziToast.success({

                title:"Success",
                message:result.data._message,
                position:"topRight"

            })


            setSelectedRecord([]);

            setApiStatus(!apiStatus);


        })
        .catch((error)=>{
            iziToast.error({
                title:"Error",
                message:error.response?.data?._message || error.message || "Status change nahi hua",
                position:"topRight"
            })
        })


    }






    // Delete

    const deleteRecords=()=>{


        if(selectedRecord.length===0){

            iziToast.error({

                title:"Error",
                message:"Please select record",
                position:"topRight"

            })

            return;

        }



        axios.delete(

            `${apiUrl}/delete`,

            {
                data:{
                    id:selectedRecord
                }
            }

        )
        .then((result)=>{

            if(!result.data._status){
                throw new Error(result.data._message);
            }

            iziToast.success({

                title:"Deleted",

                message:result.data._message,

                position:"topRight"

            })


            setSelectedRecord([]);

            setApiStatus(!apiStatus);



        })
        .catch((error)=>{
            iziToast.error({
                title:"Error",
                message:error.response?.data?._message || error.message || "Delete nahi hua",
                position:"topRight"
            })
        })


    }





return(

<>


<div className="min-h-screen bg-gray-100 ml-64">

{/* Breadcrumb */}

<div className="bg-white border-b px-6 py-4">

<p className="text-2xl font-semibold text-gray-800">

Home | Enquiry |

<span className="text-violet-500">

News Letter

</span>

</p>

</div>





<section className="p-5">


{/* Filter */}

{openFilter &&

<form onSubmit={applyFilter} className="bg-white rounded shadow p-5 mb-5 relative">

<button type="button" onClick={()=>setOpenFilter(false)} className="absolute right-4 top-3 text-2xl text-gray-500">
<MdOutlineClose/>
</button>

<p className="font-bold text-xl mb-4">FILTER</p>

<div className="flex gap-3 items-end flex-wrap">

<div>
<label className="block mb-1">Email</label>
<input name="email" type="text" defaultValue={filterEmail} placeholder="Enter email" className="border rounded px-3 py-2"/>
</div>

<button type="submit" className="bg-violet-600 text-white px-4 py-2 rounded">Apply</button>

<button type="button" onClick={clearFilter} className="bg-gray-500 text-white px-4 py-2 rounded">Clear</button>

</div>

</form>

}


<div className="bg-white rounded shadow">



<div className="flex justify-between items-center gap-3 p-5 border-b">

<h2 className="text-xl font-bold">View News Letter</h2>

<div className="flex gap-3">


<button

onClick={()=>setOpenFilter(!openFilter)}

className="bg-blue-500 text-white p-3 rounded"

>

<FaFilter/>

</button>



<button

onClick={changeStatus}

className="bg-green-500 text-white px-4 rounded"

>

Change Status

</button>




<button

onClick={deleteRecords}

className="bg-red-500 text-white px-4 rounded"

>

Delete

</button>

</div>



</div>






<div className="overflow-x-auto">


<table className="w-full text-left">


<thead className="bg-sky-100">


<tr>


<th className="p-3">

<input

type="checkbox"

checked={
newsletter.length>0 &&
selectedRecord.length===newsletter.length
}

onChange={selectAll}

/>

</th>



<th className="p-3">
EMAIL
</th>



<th className="p-3">
STATUS
</th>


</tr>


</thead>




<tbody>



{

newsletter.length>0 ?


newsletter.map((item)=>(


<tr

key={item._id}

className="border-b"

>


<td className="p-3">


<input

type="checkbox"

checked={selectedRecord.includes(item._id)}

onChange={()=>singleCheck(item._id)}

/>


</td>




<td className="p-3">

{item.email}

</td>





<td className="p-3">


{

item.status==1 ?

<span className="bg-green-500 text-white px-3 py-1 rounded">

Active

</span>


:

<span className="bg-red-500 text-white px-3 py-1 rounded">

Inactive

</span>


}


</td>



</tr>


))


:


<tr>

<td

colSpan="3"

className="text-center p-5"

>

No Record Found

</td>

</tr>



}


</tbody>



</table>


</div>




<div className="p-5">


<ResponsivePagination

current={currentPage}

total={totalPages}

onPageChange={setCurrentPage}

/>


</div>




</div>


</section>



</div>


</>


)

}

























// import React from 'react'
// import { FaFilter } from "react-icons/fa";
// import { FaPen } from "react-icons/fa";

// export default function NewsLetter() {
//   return (
//     <>
//       <div>
//         <div className="min-h-screen bg-gray-100 ml-64">

//           {/* Breadcrumb */}
//           <div className="bg-white border-b px-6 py-4">
//             <p className="text-2xl font-semibold text-gray-800">
//               Home | User | <span className='text-violet-500'>News Letter</span>
//             </p>
//           </div>

//           <section class=" dark:bg-gray-900 p-3 sm:p-5">
//             <div class="mx-auto max-w-screen-xl px-4 lg:px-12">
//               {/* <!-- Start coding here --> */}
//               <div class="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
//                 <div class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
//                   <div class="w-full md:w-1/2 font-bold text-lg">
//                     <h2>News Letter Management</h2>

//                   </div>
//                   <div class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
//                     <button type="button" class="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
//                       <svg class="h-3.5 w-3.5 mr-2" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
//                         <path clip-rule="evenodd" fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
//                       </svg>
//                       Add product
//                     </button>
//                     <div className="bg-blue-500 p-2 rounded-full">
//                       <FaFilter className="text-white" />
//                     </div>
//                     <div class="flex items-center space-x-3 w-full md:w-auto">
//                       <button id="actionsDropdownButton" data-dropdown-toggle="actionsDropdown" class="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium 
//                                                   text-white !bg-red-500 rounded-lg border border-gray-200 
//                                                   hover:!bg-red-700 focus:z-10 focus:ring-4 focus:ring-red-200" type="button">
//                         Change Status
//                       </button>

//                       <button id="filterDropdownButton" data-dropdown-toggle="filterDropdown" class="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium 
//                                                   text-white !bg-green-500 rounded-lg border border-gray-200 
//                                                   hover:!bg-green-700 focus:z-10 focus:ring-4 focus:ring-green-200" type="button">

//                         Delete
//                       </button>

//                     </div>
//                   </div>
//                 </div>
//                 <div class="overflow-x-auto">
//                   <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
//                     <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
//                       <tr>
//                         <th scope="col" class="px-4 py-3">
//                           <div className='flex items-center gap-2'>
//                             <input type='checkbox' />
//                             <span>Name</span>
//                           </div>
//                         </th>
//                         <th scope="col" class="px-4 py-3">E-Mail</th>
//                         <th scope="col" class="px-4 py-3">Mobile Number</th>
//                         <th scope="col" class="px-4 py-3">Status</th>
//                         <th scope="col" class="px-4 py-3">Action</th>
//                         <th scope="col" class="px-4 py-3">
//                           <span class="sr-only">Actions</span>
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       <tr class="border-b dark:border-gray-700">
//                         <th scope="col" class="px-4 py-3">
//                           <div className='flex items-center gap-2'>
//                             <input type='checkbox' />
//                             <span className='text-black'>Mohit</span>
//                           </div>
//                         </th>
//                         <td class="px-4 py-3">xyz@gamil.com</td>
//                         <td class="px-4 py-3">987456123</td>
//                         <td class="px-4 py-3">
//                           <span class="bg-green-400 text-xs text-xl px-4 py-3 font-bold text-white rounded text-xm">
//                             Active
//                           </span>
//                         </td>
//                         <td class="px-4 py-3"><FaPen /></td>
//                         <td class="px-4 py-3 flex items-center justify-end">
//                           <button id="apple-imac-27-dropdown-button" data-dropdown-toggle="apple-imac-27-dropdown" class="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100" type="button">

//                           </button>

//                         </td>
//                       </tr>
//                       <tr class="border-b dark:border-gray-700">
//                         <th scope="col" class="px-4 py-3">
//                           <div className='flex items-center gap-2'>
//                             <input type='checkbox' />
//                             <span className='text-black'>Riya</span>
//                           </div>
//                         </th>
//                         <td class="px-4 py-3">xyz@gamil.com</td>
//                         <td class="px-4 py-3">12345678</td>
//                         <td class="px-4 py-3">
//                           <span class="bg-red-400 text-xs text-3xl px-4 py-3 font-bold text-white rounded text-xm">
//                             Deactive
//                           </span>
//                         </td>
//                         <td class="px-4 py-3"><FaPen /></td>
//                         <td class="px-4 py-3 flex items-center justify-end">
//                           <button id="apple-imac-20-dropdown-button" data-dropdown-toggle="apple-imac-20-dropdown" class="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100" type="button">

//                           </button>
//                           <div id="apple-imac-20-dropdown" class="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
//                             <ul class="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="apple-imac-20-dropdown-button">
//                               <li>
//                                 <a href="#" class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Show</a>
//                               </li>
//                               <li>
//                                 <a href="#" class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
//                               </li>
//                             </ul>
//                             <div class="py-1">
//                               <a href="#" class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</a>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </section>
//         </div>
//       </div>
//     </>
//   )
// }
