// import React, { useEffect, useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom';
// import Header from '../Header';

// const PaymentSuccessPage = () => {

//     const [counter,setCounter] = useState(10);
//     let navigate = useNavigate();

//     const clearSessionStorage = () => {
//         sessionStorage.clear();
//         //console.log('Session storage cleared.');
//       };

//     useEffect(()=>{
//         clearSessionStorage();
//         if(counter > 0){
//             const timer = setTimeout(()=>{
//                 setCounter(counter - 1);
//             },1000)
//             return () => clearTimeout(timer);
//         }
//         else{
//             navigate('/');
//         }
//     },[counter,navigate])

//   return (
//     <div className='container-fluid'>
//         <Header/>
//         <div className='d-flex justify-content-center mt-lg-5'>
//             <svg xmlns="http://www.w3.org/2000/svg" className='mt-3' height="200" width="200" viewBox="0 0 512 512"><path fill='#31f218' d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"/></svg>
//         </div>
//         <h4 className='text-center mt-3'>Payment Successful</h4>
//         <div className='mt-lg-4'>
//             <h5 className='text-center'>To Download The Invoice ...<Link to='/'>Please Login</Link></h5>
//             <p className='text-center mt-3'>You will redirect to the home page in <b>{counter} </b> seconds</p>
//         </div>
//     </div>
//   )
// }

// export default PaymentSuccessPage;