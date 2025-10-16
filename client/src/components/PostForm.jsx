import { useState } from 'react';
import PropTypes from 'prop-types';
import { getApiBaseUrl } from '../utils/api.js';

const initialFormState = {
  status: 'lost',
  itemName: '',
  location: '',
  description: '',
  contactInfo: '',
  contactPhone: ''
};

const apiBaseUrl = getApiBaseUrl();

export default function PostForm({ onSuccess, onClose }) {
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [imageData, setImageData] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageError, setImageError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setImageData('');
      setImagePreview('');
      setImageError('');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file.');
      return;
    }

    const maxBytes = 2 * 1024 * 1024; // 2MB cap
    if (file.size > maxBytes) {
      setImageError('Images must be 2MB or smaller.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setImageData(result);
      setImagePreview(result);
      setImageError('');
    };
    reader.onerror = () => {
      setImageError('Unable to read the selected file. Please try another image.');
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setImageData('');
    setImagePreview('');
    setImageError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (imageError) {
      setError(imageError);
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        contactInfo: formData.contactInfo.trim(),
        contactPhone: formData.contactPhone.trim()
      };

      if (!payload.contactPhone) {
        delete payload.contactPhone;
      }

      if (imageData) {
        payload.image = imageData;
      }

      const response = await fetch(`${apiBaseUrl}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Unable to submit the post. Please try again.');
      }

      const createdPost = await response.json();
  setFormData(() => ({ ...initialFormState }));
      setImageData('');
      setImagePreview('');
      setImageError('');
      onSuccess?.(createdPost);
      onClose?.();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="status">
          Status
        </label>
        <select
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:border-campus-teal focus:outline-none focus:ring-2 focus:ring-campus-teal/20"
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="itemName">
          Item Name
        </label>
        <input
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-campus-teal focus:outline-none focus:ring-2 focus:ring-campus-teal/20"
          id="itemName"
          name="itemName"
          value={formData.itemName}
          onChange={handleChange}
          placeholder="e.g., Blue Backpack"
          required
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="location">
          Location
        </label>
        <input
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-campus-teal focus:outline-none focus:ring-2 focus:ring-campus-teal/20"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g., Library, 2nd Floor"
          required
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="description">
          Description (optional)
        </label>
        <textarea
          className="min-h-[120px] rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-campus-teal focus:outline-none focus:ring-2 focus:ring-campus-teal/20"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Add distinguishing details, time, etc."
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="contactInfo">
          Contact Email
        </label>
        <input
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-campus-teal focus:outline-none focus:ring-2 focus:ring-campus-teal/20"
          id="contactInfo"
          name="contactInfo"
          type="email"
          value={formData.contactInfo}
          onChange={handleChange}
          placeholder="e.g., student.email@dypiu.ac.in"
          required
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="contactPhone">
          Phone Number (optional)
        </label>
        <input
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-campus-teal focus:outline-none focus:ring-2 focus:ring-campus-teal/20"
          id="contactPhone"
          name="contactPhone"
          type="tel"
          value={formData.contactPhone}
          onChange={handleChange}
          placeholder="e.g., +91 98765 43210"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="itemImage">
          Item Photo (optional)
        </label>
        <input
          className="text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-campus-teal file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white file:transition hover:file:bg-sky-600"
          id="itemImage"
          name="itemImage"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {imagePreview && (
          <div className="relative mt-2 overflow-hidden rounded-xl border border-slate-200">
            <img className="h-48 w-full object-cover" src={imagePreview} alt="Selected item preview" />
            <button
              type="button"
              className="absolute right-3 top-3 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 shadow hover:bg-white"
              onClick={handleImageRemove}
            >
              Remove
            </button>
          </div>
        )}
        {imageError && <p className="rounded-md bg-rose-100 px-3 py-2 text-xs text-rose-700">{imageError}</p>}
      </div>

      {error && <p className="rounded-md bg-rose-100 px-3 py-2 text-sm text-rose-700">{error}</p>}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-campus-teal px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting…' : 'Submit'}
        </button>
      </div>
    </form>
  );
}

PostForm.propTypes = {
  onSuccess: PropTypes.func,
  onClose: PropTypes.func
};
