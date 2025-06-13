import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import lockicon from '../Assets/loginicons/lockicon.png';
import PasswordChangeHeader from './PasswordChangeHeader';

const PasswordChangeForm = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  // Check if all fields are filled
  useEffect(() => {
    setIsFormValid(
      currentPassword.trim() !== '' && 
      newPassword.trim() !== '' && 
      confirmPassword.trim() !== ''
    );
  }, [currentPassword, newPassword, confirmPassword]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#242424]">
      {/* Header at the very top */}
     
        <PasswordChangeHeader />
      
      
      {/* Form content centered */}
      <div className="flex justify-center items-center flex-grow -mt-16">
        <div className="w-full max-w-[400px] px-4 py-4 space-y-8">
          <div className="mb-4">
            <label className="flex items-center gap-2 mb-2 font-medium text-white">
              <img src={lockicon} alt="lock" className="h-6 w-6" /> Login password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder="Login password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full py-3 px-4 bg-[#333332] border-none rounded-md text-white placeholder-zinc-500 focus:outline-none"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-2 mb-2 font-medium text-white">
              <img src={lockicon} alt="lock" className="h-6 w-6" /> New login password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                placeholder="New login password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full py-3 px-4 bg-[#333332] border-none rounded-md text-white placeholder-zinc-500 focus:outline-none"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2 font-medium text-white">
              <img src={lockicon} alt="lock" className="h-6 w-6" /> Confirm new password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full py-3 px-4 bg-[#333332] border-none rounded-md text-white placeholder-zinc-500 focus:outline-none"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot Password & Save Button */}
          <div className="flex flex-col items-center mt-6">
            <a href="/forgotpassword" className="text-[#a8a5a1] text-sm mb-6 self-end mr-2">
              Forgot original login password <span className="ml-1">›</span>
            </a>

            <button
              className={`w-4/5 py-2 px-4 font-medium text-xl mt-8 rounded-full transition-colors ${
                isFormValid 
                  ? "bg-[linear-gradient(90deg,_#FAE59F_0%,_#C4933F_100%)] text-[#8f5206] hover:opacity-90" 
                  : "bg-[#333332] text-zinc-500 cursor-not-allowed"
              }`}
              disabled={!isFormValid}
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordChangeForm;