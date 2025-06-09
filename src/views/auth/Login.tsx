import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import Form from '../../components/Form';
import Input from '../../components/Input';
import Button from '../../components/Button';
import AuthLayout from '../../components/layout/AuthLayout';

import axiosInstance from '../../utils/axiosInstance';
import { validateEmail } from '../../utils/helper';
import { API_PATHS } from '../../utils/ApiPaths';
import { UserContext } from '../../context/userContext';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [buttonText, setButtonText] = useState("login");

  const [error, setError] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  const triggerError = (message: string) => {
    setError(message);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);
  };

  const context = useContext(UserContext);
  if (!context) {
    throw new Error("UserContext must be used within a UserProvider");
  }
  const { updateUser } = context;
  
  const navigate = useNavigate();

  const handleLogin = async (e: any): Promise<void> => {
    e.preventDefault(); 

    if (!validateEmail(email)) {
      triggerError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      triggerError("Please enter the password");
      return;
    }

    setError("");
    setButtonText("Logging in...");

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);

        updateUser(response.data);
        if (user.role === "admin") {
          navigate("/admin/dashboard"); 
        } else {
          navigate("/user/dashboard");
        }
        // navigate("/dashboard");
      }
    } catch (err: any) {
      if (err.response && err.response.data.message) {
        triggerError(err.response.data.message);
      } else {
        triggerError("Something went wrong. Please try again.");
      }
    } finally {
      setButtonText("login");
    }
  };

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

          {error && (
            <p
              className={`text-sm text-red-500 mt-4 ${isShaking ? 'shake' : ''}`}
            >
              {error}
            </p>
          )}

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