import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { SignupData } from "@/types/signupData";

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Omit<SignupData, "otp">;
}

const OtpModal: React.FC<OtpModalProps> = ({ isOpen, onClose, data }) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      inputRefs.current[0]?.focus();
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { value } = e.target;
    if (/\D/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);

    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index: number) => {
    if (index > 0 && !otp[index]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData("text");
    if (/^\d{6}$/.test(pastedData)) {
      setOtp(pastedData.split(""));
      inputRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  const handleClose = () => {
    setOtp(Array(6).fill(""));
    onClose();
  };

  const handleSubmit = () => {
    if (otp.join("").length !== 6) {
      toast.error("Please enter OTP");
      return;
    }
    const textOtp = otp.join("");
    const signupData = {
      ...data,
      otp: textOtp,
    };
    console.log(signupData);
    setOtp(Array(6).fill(""));
    onClose();
    router.push("/auth/signin");
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 transition-opacity dark:bg-blackho dark:bg-opacity-20 ${isOpen ? "block opacity-100" : "pointer-events-none hidden opacity-0"}`}
    >
      <div className="w-96 scale-100 transform rounded-lg bg-white p-8 shadow-lg transition-transform dark:bg-blacksection">
        <h2 className="mb-2 text-center text-xl font-bold">Enter OTP</h2>
        <p className="mb-2 text-center">
          Enter the OTP sent to your email address
        </p>
        <div className="mb-4 flex justify-between">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onFocus={() => inputRefs.current[index]?.select()}
              onKeyDown={(e) => {
                if (e.key === "Backspace") {
                  handleBackspace(index);
                }
              }}
              onPaste={(e) => handlePaste(e)}
              ref={(el) => {
                if (inputRefs.current[index] === null) {
                  inputRefs.current[index] = el;
                }
              }}
              // required
              className="h-12 w-12 rounded border border-gray-300 text-center text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-black"
            />
          ))}
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full rounded-lg bg-blue-600 py-2 text-white transition hover:bg-blue-700"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={handleClose}
          className="mt-2 w-full text-center text-blue-600 hover:underline"
        >
          Cancel
        </button>
        <p className="mt-2">
          <span className="text-primary">Click here</span> to resend the OTP
        </p>
      </div>
    </div>
  );
};

export default OtpModal;
