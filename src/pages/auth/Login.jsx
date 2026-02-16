import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { userContext } from '../../context/userContext';

const Login = ({setCurrentPage}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const {updateUser} = useContext(userContext);
  
  const handleLogin = async(e) => {
    e.preventDefault();
    if(!validateEmail(email)){
      setError('Please enter a valid email');
      return;
    }
    if(!password){
      setError('Please enter the password');
      return;
    }
    setError('');
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {email, password});
      const { token } = response.data;
      if(token){
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate("/dashboard");
      }
    }catch(error){
      if(error.response && error.response.data.message) {
        setError(error.response.data.message)
      }
      else{
        setError('Something went wrong. Please try again.');
      }
    }
  }

  return (
    <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center'>
      <h3 className='text-lg font-semibold text-black'>Welcome Back</h3>
      <p className='text-xs text-slate-700 mt-1.25 mb-6'>Please enter your details to login</p>
      <form onSubmit={handleLogin} action="">
        <Input value={email} onChange={({target}) => setEmail(target.value)} label='Email Address' placeholder='john@example.com' type='text' />
        <Input value={password} onChange={({target}) => setPassword(target.value)} label='Password' placeholder='Min 8 Characters' type='password' />
        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
        <button type='submit' className='btn-primary'>LOGIN</button>
        <p className='text-[13px] text-slate-800 mt-3'>Don't have an account ? {" "} <button className='text-primary font-medium underline cursor-pointer' onClick={() => setCurrentPage('signup')}>SignUp</button></p>
      </form>
    </div>
  )
}

export default Login