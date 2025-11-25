/* Reusable Action Button */

const VARIANTS = {
  pending: "bg-yellow-600 hover:bg-yellow-700 text-white",
  reject: "bg-red-500 hover:bg-red-600 text-white",
  default: "bg-teal-600 hover:bg-teal-700 text-white",
};

const Button = ({
  children,
  variant = "default",
  onClick,
  type = "button",
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm font-medium shadow 
                  transition-all duration-200 ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
