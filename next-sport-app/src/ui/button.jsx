const Button = ({ icon, onClick, text, className = "", variant = 1 }) => {
  const baseClasses = "border rounded-sm p-[10px] transition duration-300";

  const variantClasses =
    variant === 1
      ? "bg-color-green text-color-white hover:bg-color-white hover:text-color-green hover:border-color-green"
      : "bg-color-white border-color-green  text-color-green hover:bg-color-green hover:text-color-white hover:border-color-green";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      {icon}
      {text}
    </button>
  );
};

export default Button;
