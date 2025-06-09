import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import Form from '../../components/Form';
import AuthLayout from '../../components/layout/AuthLayout';
import ProfilePhotoSelector from '../../components/inputs/ProfilePhotoSelector';
import Input from '../../components/Input';
import Button from '../../components/Button';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/ApiPaths';
import { UserContext } from '../../context/userContext';
import uploadImage from '../../utils/upload';

export default function SignUp() {
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [buttonText, setButtonText] = useState("sign up");
  const [adminInviteToken, setAdminInviteToken] = useState("");

  const navigate = useNavigate();

  const context = useContext(UserContext);
  if (!context) {
    throw new Error("UserContext must be used within a UserProvider");
  }
  const { updateUser } = context;
  const [error, setError] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  const triggerError = (message: string) => {
    setError(message);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);
  };

  const handleSignUp = async (e: any): Promise<void> => {
    e.preventDefault();

    let setProfilePicture = '';

    if (!fullname) {
      triggerError("Please enter fullname");
      return;
    }

    if (!password) {
      triggerError("Please enter password");
      return;
    }

    if (!email) {
      triggerError("Please enter email account");
      return;
    }

    setError("");

    try {
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        setProfilePicture = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullname,
        email,
        password,
        setProfilePicture,
        adminInviteToken
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
      }
     
    } catch (err: any) {
      if (err.response && err.response.data.message) {
        triggerError(err.response.data.message);
      } else {
        triggerError("Something went wrong. Please try again.");
      }
    } finally {
      setButtonText("sign up");
    }
  }

  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Create an Account</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Join us today by entering your details below.
        </p>

        <Form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic}/>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              value={fullname}
              onChange={({ target }) => setFullname(target.value)}
              label="Full Name"
              placeholder="John Doe"
              type="text"
            />
            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email"
              placeholder="example@email.com"
              type="email"
            />
            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="••••••••"
              type="password"
            />
            <Input
              value={adminInviteToken}
              onChange={({ target }) => setAdminInviteToken(target.value)}
              label="Admin Invite Token"
              placeholder="6 Digit Code"
              type="text"
            />
          </div>

          {error && (
            <p
              className={`text-sm text-red-500 mt-4 ${isShaking ? 'shake' : ''}`}
            >
              {error}
            </p>
          )}

          <Button type='submit'>
           { buttonText.toLowerCase() === "sign up" ? buttonText.toUpperCase() : buttonText } 
          </Button>
          <p className='text-[13px] text-slate-800 mt-3'>
            Already an account? {" "}
            <Link className="font-medium text-primary underline" to="/login">
              Login 
            </Link>
          </p>
        </Form>
      </div>
    </AuthLayout>
  )
}