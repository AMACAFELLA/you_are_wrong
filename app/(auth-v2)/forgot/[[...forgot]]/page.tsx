import React from "react";

import Logo from "@/components/shared/Logo";
import ForgotForm from "@/components/auth/forms/ForgotForm";

const Page = () => {
  return (
    <div className="form-card-container">
      {/* Form Header */}
      <div className="w-full flex justify-between gap-2">
        <div className="flex flex-col items-start justify-start">
          <h4 className="text-[22px] font-semibold text-light-1">
            Forgot your password?
          </h4>
          <p className="text-gray-2">
            fill in your email so we can send you a verification link
          </p>
        </div>
        <Logo size={45} />
      </div>

      <ForgotForm />
    </div>
  );
};

export default Page;
