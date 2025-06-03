import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import Form from '../../components/Form';
import Input from '../../components/Input';
import Button from '../../components/Button';
import AuthLayout from '../../components/layout/AuthLayout'

import { validateEmail } from '../../utils/helper';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [buttonText, setButtonText] = useState("login");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: any): Promise<void> => {
    e.preventDefault(); 

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError("");
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setButtonText(value);
  }
  return(
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Welcome Back</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Please enter yout details to login
        </p>

        <Form onSubmit={handleLogin}>
          <Input 
            value={email}
            onChange={({target}) => setEmail(target.value)}   
            label="Email Address"
            placeholder='johndoe@example.com'
            type="text"
          />
          <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="Minimum 8 Characters"
              type="password"
            />

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
          <Button type='submit'>
           {buttonText.toLowerCase() === "login" ? buttonText.toUpperCase() : buttonText} 
          </Button>
          <p className='text-[13px] text-slate-800 mt-3'>
            Dont't have an account? {" "}
            <Link className="font-medium text-primary underline" to="/signup">
              Sign Up 
            </Link>
          </p>
        </Form>
      </div> 
    </AuthLayout>
  )
}