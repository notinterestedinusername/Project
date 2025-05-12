import React from 'react';

const FormField = ({
  LabelName,
  placeholder,
  inputType,
  isTextArea,
  value,
  handleChange,
  //isRequired = true,
  error,
  accept,
}) => {
  const baseClasses =
    'py-[16px] sm:px-[25px] px-[15px] outline-none border-[1px] rounded-[10px] font-epilogue text-[16px] sm:min-w-[300px] bg-transparent transition-all caret-accentBlue focus:ring-2 focus:ring-accentBlue';

  const borderColor = error ? 'border-red-500' : 'border-[#3a3a43]';
  const textColor = 'text-light-text';
  const placeholderColor = error ? 'placeholder-red-500' : 'placeholder:text-[#4b5264]';

  return (
    <label className="flex-1 w-full flex flex-col">
      {LabelName && (
        <span className="font-epilogue font-medium text-[14px] leading-[22px] text-light-text mb-[10px]">
          {LabelName}
        </span>
      )}

      {isTextArea ? (
        <textarea
          //required={isRequired}
          rows={10}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`${baseClasses} ${borderColor} ${textColor} ${placeholderColor}`}
        />
      ) : (
        <input
          //required={isRequired}
          type={inputType}
          accept={accept}
          onChange={handleChange}
          placeholder={placeholder}
          step="any"
          className={`${baseClasses} ${borderColor} ${textColor} ${placeholderColor}`}
        />
      )}

      {error && (
        <span className="text-[12px] text-red-500 mt-1 ml-1">{error}</span>
      )}
    </label>
  );
};

export default FormField;
