import axios from 'axios';
import iziToast from 'izitoast';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';

export default function AddMaterial() {

  const[materialId , setMaterialId] = useState('');

  // api response
  const[materialDetails , setMaterialDetails] = useState('');

  const pageNavigate = useNavigate();

  const params = useParams();

  useEffect(()=>{
      setMaterialId(params.id);

      if(params.id ){
        axios.post(`http://localhost:5000/api/admin/material/details/${params.id}`)
        .then((result)=>{
          if(result.data._status){
              setMaterialDetails(result.data._data)
          }
          else{
              iziToast.error({
              title: 'Error',
              message: result.data._message,
              position: 'topRight'
          });
        }
      })
        .catch(()=>{
              iziToast.error({
              title: 'Error',
              message: 'Something went wrong',
              position: 'topRight'
            });
        });
      }
  },[params])


  let [errors, setErrors] = useState([]);

  let formhandler = (event) => {
    event.preventDefault();

    let form = event.target;
    let fields = form.querySelectorAll('input')

    let newErrors = [];

    fields.forEach((field) => {
      if (!field.value.trim()) {
        newErrors.push(field.name);
      }
    });

    newErrors = [...new Set(newErrors)];
    setErrors(newErrors);

    if (newErrors.length === 0) {

      if(materialId){
        axios.put(`http://localhost:5000/api/admin/material/update/${materialId}`,
        {
          name : event.target.name.value,
          order : event.target.order.value
        })
         .then((result)=>{
          console.log(result.data)
            if(result.data._status == true){
                event.target.reset()
                pageNavigate('/material/view-material')
                iziToast.success({
                title: 'Success',
                message: result.data._message,
                position: 'topRight'
              });
              }
              else{
                  iziToast.error({
                  title: 'Error',
                  message: result.data._message,
                  position: 'topRight'
                 });
              }
        })
        .catch(()=>{
              iziToast.error({
              title: 'Error',
              message: 'Something went wrong',
              position: 'topRight'
            });
        })
        }else{
          axios.post('http://localhost:5000/api/admin/material/create',{
            name : event.target.name.value,
            order : event.target.order.value
          })
          .then((result)=>{
            if(result.data._status == true){
                event.target.reset()
                pageNavigate('/material/view-material')
                iziToast.success({
                title: 'Success',
                message: result.data._message,
                position: 'topRight'
        });
            }else{
                  iziToast.error({
                  title: 'Error',
                  message: result.data._message,
                  position: 'topRight'
                 });
            }
          })
          .catch(()=>{
              iziToast.error({
              title: 'Error',
              message: 'Something went wrong',
              position: 'topRight'
            });
          })
        }
    }
  };


  let ErrorHandler = (event) => {
    let fieldName = event.target.name;

    if (event.target.value === "") {

      if (!errors.includes(fieldName)) {
        setErrors([...errors, fieldName]);
      }

    } else {

      let updated = errors.filter((v) => v !== fieldName);
      setErrors(updated);
    }
  };


  return (
  <>
    <section className="ml-[240px] bg-slate-50 min-h-screen px-10 py-6">

      {/* Breadcrumb */}
      <nav className="border-b border-black bg-white px-6 py-5 mb-6">
        <ol className="inline-flex items-center space-x-2 text-gray-900">
          <li className="text-[24px] font-semibold">Home</li>
          <li>|</li>
          <li className="text-[24px] font-semibold">Material</li>
          <li>|</li>
          <li>
            <span className="text-[24px] font-semibold text-violet-500">
              {materialId ? 'Update Material' : 'Add Material'}
            </span>
          </li>
        </ol>
      </nav>

      {/* BODY */}
      <div className="w-full bg-white">

        <h3 className="text-[24px] font-semibold bg-red-700 py-5 px-6 text-white">
          {materialId ? 'Update Material' : 'Add Material'}
        </h3>

        <form
          onSubmit={formhandler}
          className="bg-white p-6"
        >
          {/* Material Name */}
          <div className="mb-6">
            <label className="block mb-2 text-md font-medium text-gray-700">
              Material Name
            </label>

            <input
              type="text"
              name="name"
              defaultValue={materialDetails.name}
              autoComplete="off"
              onKeyUp={ErrorHandler}
              className="text-[17px] border border-slate-300 text-gray-900 rounded-lg block w-full py-2.5 px-3"
              placeholder="Enter Material name"
            />
          </div>

          {/* Order */}
          <div className="mb-6">
            <label className="block mb-2 text-md font-medium text-gray-700">
              Order
            </label>

            <input
              type="number"
              name="order"
              defaultValue={materialDetails.order}
              min={1}
              autoComplete="off"
              className="text-[17px] border border-slate-300 text-gray-900 rounded-lg block w-full py-2.5 px-3"
              placeholder="Enter order number"
            />
          </div>

          <button
            type="submit"
            className="mt-3 cursor-pointer text-white bg-red-700 font-medium text-md px-6 py-2.5 shadow-sm"
          >
            {
            materialId ? "Update" : "Submit"
            }
          </button>
        </form>
      </div>
    </section>
  </>
)
}