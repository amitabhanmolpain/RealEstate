import React, { useState } from 'react';
import DashboardNavbar from '../../components/DashboardNavbar.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { sellerService } from '../services/sellerService.js';

const AddProperty = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    city: '',
    propertyType: 'Rent',
    price: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    image: '',
    images: [], // Additional images
    amenities: [],
    featured: false,
    available: true,
  });

  const [amenitiesInput, setAmenitiesInput] = useState('');
  const amenitiesOptions = [
    'Swimming Pool',
    'Gym',
    'Parking',
    'Security',
    'Garden',
    'Balcony',
    'Air Conditioning',
    'Furnished',
    'WiFi',
    'Elevator',
    'Community Center',
    'Play Area',
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Please Sign In</h2>
          <p className="text-gray-600">You need to sign in to list a property.</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAmenityToggle = (amenity) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.includes(amenity)
        ? formData.amenities.filter((a) => a !== amenity)
        : [...formData.amenities, amenity],
    });
  };

  const handleAddAmenity = () => {
    if (amenitiesInput.trim() && !formData.amenities.includes(amenitiesInput)) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenitiesInput],
      });
      setAmenitiesInput('');
    }
  };

  const handleRemoveAmenity = (amenity) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((a) => a !== amenity),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (
      !formData.title ||
      !formData.description ||
      !formData.location ||
      !formData.city ||
      !formData.price ||
      !formData.area ||
      !formData.bedrooms ||
      !formData.bathrooms ||
      !formData.image
    ) {
      alert('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare data for API
      const propertyData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        city: formData.city,
        property_type: formData.propertyType,
        price: parseInt(formData.price),
        area: parseInt(formData.area),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        image: formData.image,
        images: formData.images.filter(img => img.trim() !== ''), // Additional images
        amenities: formData.amenities,
      };

      await sellerService.createProperty(propertyData);
      alert('Property listed successfully!');
      navigate('/seller-dashboard');
    } catch (error) {
      alert('Failed to list property: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />

      <div className="container mx-auto px-6 md:px-20 lg:px-32 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">List Your Property</h1>
          <p className="text-gray-600">Fill in all the details below to list your property</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="border-b pb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Basic Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Luxury 3BHK Apartment in Bangalore"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                    required
                  />
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type *
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    <option value="Rent">Rent</option>
                    <option value="Sale">Sale</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g., Bangalore, Mumbai"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                    required
                  />
                </div>

                {/* Location/Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location/Address *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Koramangala, Bangalore"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your property in detail..."
                  rows="5"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                  required
                />
              </div>
            </div>

            {/* Property Details Section */}
            <div className="border-b pb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Property Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g., 5000000"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                    required
                  />
                </div>

                {/* Area */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area (sq.ft) *
                  </label>
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="e.g., 1500"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                    required
                  />
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms *
                  </label>
                  <select
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                    required
                  >
                    <option value="">Select</option>
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4 BHK</option>
                    <option value="5">5+ BHK</option>
                  </select>
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms *
                  </label>
                  <select
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                    required
                  >
                    <option value="">Select</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4+</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Image Section */}
            <div className="border-b pb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Property Images</h2>

              {/* Main Image */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Image URL *
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/property-image.jpg"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                  required
                />
                {formData.image && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Main Image Preview:</p>
                    <img
                      src={formData.image}
                      alt="Main property preview"
                      className="w-full md:w-64 h-48 object-cover rounded-lg border-2 border-red-300"
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1570129477492-45ef003a1b47?w=500&h=500&fit=crop';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Additional Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Images (Optional)
                </label>
                <p className="text-xs text-gray-500 mb-3">Add more images to showcase your property</p>
                
                {/* Existing additional images */}
                {formData.images.map((imgUrl, index) => (
                  <div key={index} className="flex items-center gap-2 mb-3">
                    <input
                      type="url"
                      value={imgUrl}
                      onChange={(e) => {
                        const newImages = [...formData.images];
                        newImages[index] = e.target.value;
                        setFormData({ ...formData, images: newImages });
                      }}
                      placeholder="https://example.com/additional-image.jpg"
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newImages = formData.images.filter((_, i) => i !== index);
                        setFormData({ ...formData, images: newImages });
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Remove image"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}

                {/* Add new image button */}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, images: [...formData.images, ''] });
                  }}
                  className="flex items-center gap-2 text-red-400 hover:text-red-500 font-medium mt-2 px-4 py-2 border border-dashed border-red-300 rounded-lg hover:bg-red-50 transition w-full justify-center"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Another Image
                </button>

                {/* Preview additional images */}
                {formData.images.filter(img => img.trim() !== '').length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Additional Images Preview:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {formData.images.filter(img => img.trim() !== '').map((imgUrl, index) => (
                        <div key={index} className="relative">
                          <img
                            src={imgUrl}
                            alt={`Additional ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src =
                                'https://images.unsplash.com/photo-1570129477492-45ef003a1b47?w=500&h=500&fit=crop';
                            }}
                          />
                          <span className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            #{index + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Amenities Section */}
            <div className="border-b pb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Amenities</h2>

              {/* Quick Select Amenities */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Select from common amenities:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {amenitiesOptions.map((amenity) => (
                    <label key={amenity} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="w-4 h-4 text-red-300 rounded focus:ring-2 focus:ring-red-300"
                      />
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Add Custom Amenity */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Add custom amenity:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={amenitiesInput}
                    onChange={(e) => setAmenitiesInput(e.target.value)}
                    placeholder="e.g., Solar Panels"
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddAmenity();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddAmenity}
                    className="bg-red-300 hover:bg-red-400 text-white px-4 py-2 rounded-lg transition"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Selected Amenities */}
              {formData.amenities.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Selected amenities:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {amenity}
                        <button
                          type="button"
                          onClick={() => handleRemoveAmenity(amenity)}
                          className="text-red-400 hover:text-red-700 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Additional Settings Section */}
            <div className="pb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Additional Settings</h2>

              <div className="space-y-4">
                {/* Available Status */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-red-300 rounded focus:ring-2 focus:ring-red-300"
                  />
                  <span className="text-gray-700">Property is available</span>
                </label>

                {/* Featured Listing */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-red-300 rounded focus:ring-2 focus:ring-red-300"
                  />
                  <span className="text-gray-700">Mark as featured listing</span>
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-red-300 hover:bg-red-400 text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'List Property'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
