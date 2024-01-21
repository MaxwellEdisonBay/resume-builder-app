import toast from "react-hot-toast";

export type ToastTypes = "error" | "success" | "info" | "loading";

export interface ToastProps {
  message: string;
  type: ToastTypes;
}

export const showToast = ({ message, type }: ToastProps) => {
  const config = {
    duration: 1500,
  };
  switch (type) {
    case "success":
      toast.success(message, config);
      break;
    case "error":
      toast.error(message, config);
      break;
    case "loading":
      toast.loading(message, config);
      break;
  }
};
