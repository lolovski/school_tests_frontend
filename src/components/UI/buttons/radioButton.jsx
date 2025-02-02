import React from 'react';

const RadioButton = ({ label, value, checked, onChange }) => {
    return (
        <label className="inline-flex items-center">
            <input
                type="radio"
                value={value}
                checked={checked}
                onChange={onChange}
                className="form-radio h-5 w-5 text-indigo-600"
            />
            <span className="ml-2 text-xl font-medium leading-6 dark:text-white">{label}</span>
        </label>
    );
};

export default RadioButton;