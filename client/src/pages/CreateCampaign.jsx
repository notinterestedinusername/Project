import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context'; 
import { CustomButton, FormField, Loader } from '../components';
import { checkIfImage } from '../utils';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createCampaign, isConnected } = useStateContext();
  const [form, setForm] = useState({
    title: '',
    description: '',
    target: '',
    deadline: '',
    image: ''
  });

  useEffect(() => {
    if (!isConnected) {
      navigate('/');  // Redirect to homepage if wallet is disconnected
    }
  }, [isConnected, navigate]);

  const [errors, setErrors] = useState({});
  //const [globalError, setGlobalError] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
    setErrors({ ...errors, [fieldName]: '' });
    //setGlobalError('');

    if (fieldName === 'image') {
      checkIfImage(e.target.value, (exists) => {
        setImagePreview(exists ? e.target.value : '');
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    //if (!form.title) newErrors.title = 'Title is required';
    //if (!form.description) newErrors.description = 'Description is required';
    if (!form.target || isNaN(form.target)) {
      newErrors.target = 'Valid ETH target is required';
    } else if ((form.target) <= 0) {
      newErrors.target = 'Must be greater than 0';
    }
    if (!form.deadline) {
      newErrors.deadline = 'Deadline is required';
    } else if (new Date(form.deadline) < new Date()) {
      newErrors.deadline = 'Deadline must be in the future';
    }
    if (!form.image) newErrors.image = 'Image URL is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form);
    //setGlobalError('');
    if (!validateForm()) return;

    checkIfImage(form.image, async (exists) => {
      if (exists) {
        setIsLoading(true);
        try {
          await createCampaign({ ...form, target: ethers.utils.parseUnits(form.target, 18) });
          setIsLoading(false);
          navigate('/my-campaigns');
        } catch (error) {
          setIsLoading(false);
          console.error("Error creating campaign:", error);
          //setGlobalError(error.reason || error.message || 'Something went wrong');
          //alert(error.reason || "Something went wrong. Please try again."); // Show as alert
        }
      } else {
        setErrors({ ...errors, image: 'Provide a valid image URL' });
        setForm({ ...form, image: '' });
        setImagePreview('');
      }
    });
  };

  return (
    <div className="bg-light-background dark:bg-dark-background min-h-screen pt-20 px-4 sm:px-10 pb-10">
      {isLoading && <Loader />}
      <div className="bg-[#f2c6b4] p-6 rounded-lg shadow-md dark:shadow-dark:shadow-[0_4px_20px_rgba(255,255,255,0.1)] max-w-4xl mx-auto transition-shadow duration-300">
        <div className="bg-[#33691e] text-light-background px-6 py-3 rounded-lg text-center font-bold text-2xl sm:text-3xl mb-8 shadow w-fit mx-auto">
          Start a Campaign
        </div>

        {/*
        {globalError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
            {globalError}
          </div>
        )}
        */}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-6">
            <FormField
              LabelName="Campaign Title *"
              placeholder="Write a title"
              inputType="text"
              value={form.title}
              handleChange={(e) => handleFormFieldChange('title', e)}
              error={errors.title}
            />
          </div>

          <FormField
            LabelName="Story *"
            placeholder="Write your story"
            isTextArea
            value={form.description}
            handleChange={(e) => handleFormFieldChange('description', e)}
            error={errors.description}
          />

          <div className="flex flex-col md:flex-row gap-6">
            <FormField
              LabelName="Goal (in ETH) *"
              placeholder="0.5"
              inputType="number"
              value={form.target}
              handleChange={(e) => handleFormFieldChange('target', e)}
              error={errors.target}
            />
            <FormField
              LabelName="End Date *"
              inputType="date"
              value={form.deadline}
              handleChange={(e) => handleFormFieldChange('deadline', e)}
              error={errors.deadline}
            />
          </div>

          <FormField
            LabelName="Campaign Image URL *"
            placeholder="https://..."
            inputType="url"
            value={form.image}
            handleChange={(e) => handleFormFieldChange('image', e)}
            error={errors.image}
          />

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full max-w-xs h-auto mx-auto rounded-md mt-2 shadow"
            />
          )}

          <div className="flex justify-center">
            <CustomButton
              btnType="submit"
              title="Submit new Campaign"
              styles="bg-light-accentGold dark:bg-light-accentBlue hover:bg-yellow-600 dark:hover:bg-blue-500 px-6 py-2 rounded-[10px] border border-gray-500 shadow"
            />
          </div>
        </form>
      </div>
    </div>
    )
};

export default CreateCampaign;
