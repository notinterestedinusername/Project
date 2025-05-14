import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { CustomButton, FormField, Loader } from '../components';
import { uploadFileToPinata } from '../utils';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { createCampaign, address } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    goal: '',
    deadline: '',
    img: null,
    video: null,
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');
  const [videoPreview, setVideoPreview] = useState('');

  useEffect(() => {
    if (!address) navigate('/');
  }, [address, navigate]);

  const handleFormFieldChange = (fieldName, e) => {
    const file = e.target.files?.[0];
    if(fieldName === 'video' && file) {
      if (!file.type.startsWith('video/')) {
        setErrors(prev => ({ ...prev, video: 'Only video files are allowed.' }));
        setForm(prev => ({ ...prev, video: null }));
        setVideoPreview('');
        return;
      }
      setErrors(prev => ({ ...prev, video: '' }));
      setForm(prev => ({ ...prev, video: file }));
      setVideoPreview(URL.createObjectURL(file));
    }

    if (fieldName === 'img' && file) {
      if(!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, img: 'Only image files are allowed.' }));
        setForm(prev => ({ ...prev, img: null }));
        setImagePreview('');
        return;
      }
      setErrors(prev => ({ ...prev, img: '' }));
      setForm(prev => ({ ...prev, img: file }));
      setImagePreview(URL.createObjectURL(file));

    }

    if(!file) {
      const value = e.target.value;
      setForm(prev => ({ ...prev, [fieldName]: value}));
      setErrors(prev => ({ ...prev, [fieldName]: ''}));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.goal || isNaN(form.goal) || parseFloat(form.goal) <= 0) newErrors.goal = 'Valid ETH target is required';
    if (!form.deadline || new Date(form.deadline) < new Date()) newErrors.deadline = 'Future deadline required';
    if (!form.img) newErrors.img = 'Image file is required in .jpg /.jpeg /.png';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
      try {
        let imageUrl = '';
        let videoUrl = '';

        if (form.img) {
          imageUrl = await uploadFileToPinata(form.img);
        }
        if (form.video) {
          videoUrl = await uploadFileToPinata(form.video);
        }

        const data = {
          ...form,
          goal: ethers.utils.parseUnits(form.goal, 18),
          img: imageUrl,
          video: videoUrl
        };

        await createCampaign(data);
        navigate('/my-campaigns');
      } catch (err) {
        console.error("Campaign creation failed:", err);
        alert(`Campaign creation failed: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <div className="bg-light-background dark:bg-dark-background font-epilogue min-h-screen pt-20 px-4 sm:px-10 pb-10">
      {isLoading && <Loader />}
      <div className="bg-blue-200 dark:bg-white p-6 rounded-lg shadow-md dark:shadow-dark:shadow-[0_4px_20px_rgba(255,255,255,0.1)] max-w-4xl mx-auto transition-shadow duration-300">
        <div className="bg-[#93C572] text-light-text px-6 py-3 rounded-lg text-center font-bold text-2xl sm:text-3xl mb-8 shadow w-fit mx-auto">
          Start a Campaign
        </div>

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
              placeholder="eg: 0.5"
              inputType="number"
              value={form.goal}
              handleChange={(e) => handleFormFieldChange('goal', e)}
              error={errors.goal}
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
            LabelName="Upload Campaign Image *"
            inputType="file"
            handleChange={(e) => handleFormFieldChange('img', e)}
            error={errors.img}
            accept="image/*"
            isRequired={true}
          />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="w-full max-w-xs h-auto mx-auto rounded-md mt-2 shadow" />
          )}

          <FormField
            LabelName="Upload a Video (optional)"
            inputType="file"
            handleChange={(e) => handleFormFieldChange('video', e)}
            error={errors.video}
            accept="video/mp4,video/webm"
            isRequired={false}
          />
          {videoPreview && (
            <video src={videoPreview} controls className="w-full max-w-md mx-auto rounded-md" />
          )}

        <div className="flex justify-center">
          <CustomButton
            btnType="submit"
            title="Submit Campaign"
            styles="bg-light-accentGold text-light-text dark:text-light-text hover:bg-yellow-600 px-6 py-2 rounded-[10px] border border-gray-500 shadow"
            isDisabled={isLoading}
          />
        </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;
