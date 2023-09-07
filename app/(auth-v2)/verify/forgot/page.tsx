import VerifyForm from "@/components/auth/forms/VerifyForm";
import EmailChip from "@/components/auth/shared/EmailChip";
import Logo from "@/components/shared/Logo";

const Page = () => {
  return (
    <div className="form-card-container">
      {/* Form Header */}
      <div className="w-full flex justify-between gap-2">
        <div className="flex flex-col items-start justify-start">
          <h4 className="text-[22px] font-semibold text-light-1">
            Verify your email
          </h4>
          <p className="text-gray-2">
            To reset your password and continue to You're Wrong
          </p>
        </div>
        <Logo size={45} />
      </div>

      <EmailChip source="verify-forgot" />

      <div className="w-full flex flex-col justify-start gap-1 items-start">
        <h4 className="text-small-medium font-semibold text-light-1">
          Verification code
        </h4>
        <p className="text-small-regular text-gray-2">
          Enter the verification code sent to your email address
        </p>
      </div>

      <VerifyForm source="verify-forgot" />
    </div>
  );
};

export default Page;
