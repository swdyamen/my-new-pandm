// src/components/common/PageHeader.jsx
import React from "react";
import IconUserPlus from "../../icons/IconUserPlus";
import IconPlus from "../../icons/IconPlus";

const icons = {
  UserPlus: IconUserPlus,
  Plus: IconPlus,
  // Add more icons as needed
};

const PageHeader = ({
  title,
  buttonText,
  buttonIcon = "Plus",
  onButtonClick,
}) => {
  const Icon = icons[buttonIcon];

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        {title}
      </h1>
      {buttonText && (
        <button
          type="button"
          onClick={onButtonClick}
          className="btn btn-primary flex items-center gap-2"
        >
          {Icon && <Icon className="w-5 h-5" />}
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default PageHeader;
