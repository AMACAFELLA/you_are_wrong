import GoogleButton from "@/components/auth/shared/GoogleButton";
import LinkedInButton from "@/components/auth/shared/LinkedInButton";
import SignUpForm from "@/components/auth/forms/SignUpForm";
import Logo from "@/components/shared/Logo";
import ResetPassForm from "@/components/auth/forms/ResetPassForm";

const Page = () => {
  return (
    <div className="form-card-container">
      {/* Form Header */}
      <div className="w-full flex justify-between gap-2">
        <div className="flex flex-col items-start justify-start">
          <h4 className="text-[22px] font-semibold text-light-1">
            Reset your password
          </h4>
          <p className="text-gray-2">and continue to You're Wrong</p>
        </div>
        <Logo size={45} />
      </div>

      <ResetPassForm />
    </div>
  );
};

export default Page;
