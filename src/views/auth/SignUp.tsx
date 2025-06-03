import React, { useState } from 'react'

import Form from '../../components/Form';
import AuthLayout from '../../components/layout/AuthLayout'
import ProfilePhotoSelector from '../../components/inputs/ProfilePhotoSelector';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function SignUp() {
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [buttonText, setButtonText] = useState("sign up");
  const [adminInviteToken, setAdminInviteToken] = useState("");

  const [error, setError] = useState("");

  const handleSignUp = async (e: any): Promise<void> => {
    e.preventDefault();

    if (!fullname) {
      setError("Please ");
      return;
    }

    if (!password) {
      setError("Please");
      return;
    }

    setError("");
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
              placeholder="Optional"
              type="text"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 mt-4">{error}</p>
          )}
          <Button type='submit'>
           {buttonText.toLowerCase() === "sign up" ? buttonText.toUpperCase() : buttonText} 
          </Button>
        </Form>
      </div>
    </AuthLayout>
  )
}