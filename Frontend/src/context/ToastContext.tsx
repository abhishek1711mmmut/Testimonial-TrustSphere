"use client";
import { Toaster } from "react-hot-toast";

const ToasterContext = () => {
  return (
    <div>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            borderRadius: "6px",
            background: "#333",
            color: "#fff",
            height: "50px",
            padding: "10px",
            fontSize: "16px",
            marginRight: "15px",
          },
        }}
      />
    </div>
  );
};

export default ToasterContext;
