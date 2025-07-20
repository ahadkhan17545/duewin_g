import { toast } from "react-toastify";

export const showSuccess = (msg) => {
  toast.dismiss(); // Close any existing toasts
  toast.success(msg);
};

export const showError = (msg) => {
  toast.dismiss();
  toast.error(msg);
};

export const showInfo = (msg) => {
  toast.dismiss();
  toast.info(msg);
};

export const showWarning = (msg) => {
  toast.dismiss();
  toast.warn(msg); // ✅ correct method
};
