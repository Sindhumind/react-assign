import type { InputFieldProps } from "../../types";

export default function InputField({
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  maxLength,
  id,
}: InputFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={id ?? name}>{placeholder}</label>

      <input
        id={id ?? name}
        className="input"
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
      />
    </div>
  );
}
