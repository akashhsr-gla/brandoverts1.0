import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function useFormSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = async (formData, source, resetForm) => {
    setIsSubmitting(true);
    
    try {
      const response = await axios.post('/api/enquiry', {
        ...formData,
        source,
      });
      
      toast.success('Thank you for your enquiry! We will get back to you soon.');
      if (resetForm) resetForm();
      return response.data;
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitForm, isSubmitting };
}