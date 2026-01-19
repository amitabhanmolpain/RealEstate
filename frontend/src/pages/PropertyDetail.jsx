import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardNavbar from '../../components/DashboardNavbar.jsx';
import PropertyMap from '../../components/PropertyMap.jsx';
import EMICalculator from '../../components/EMICalculator.jsx';
import { propertyService } from '../services/propertyService.js';
import { userPropertyService } from '../services/sellerService.js';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Interest and Visit states
  const [showInterestThankYou, setShowInterestThankYou] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isSubmittingInterest, setIsSubmittingInterest] = useState(false);
  const [isSubmittingVisit, setIsSubmittingVisit] = useState(false);
  const [visitFormData, setVisitFormData] = useState({
    address: '',
    visit_date: '',
    visit_time: '',
    visitor_phone: '',
  });

  // Sample additional images for the property (fallback if no images from backend)
  const fallbackImages = [
    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800'
  ];

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await propertyService.getPropertyById(id);
        if (response && response.property) {
          setProperty(response.property);
        } else {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error fetching property:', error);
        navigate('/dashboard');
      }
    };
    
    fetchProperty();
  }, [id, navigate]);

  // Handle Request Info - Express Interest
  const handleRequestInfo = async () => {
    setIsSubmittingInterest(true);
    try {
      await userPropertyService.expressInterest(id, {
        message: 'I am interested in this property and would like more information.',
        interest_type: 'General'
      });
      setShowInterestThankYou(true);
    } catch (error) {
      console.error('Error expressing interest:', error);
      // Still show thank you even if API fails (for demo purposes)
      setShowInterestThankYou(true);
    } finally {
      setIsSubmittingInterest(false);
    }
  };

  // Handle Schedule Visit
  const handleScheduleVisit = async (e) => {
    e.preventDefault();
    if (!visitFormData.address || !visitFormData.visit_date || !visitFormData.visit_time) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsSubmittingVisit(true);
    try {
      await userPropertyService.scheduleVisit(id, {
        visit_date: visitFormData.visit_date,
        visit_time: visitFormData.visit_time,
        visitor_phone: visitFormData.visitor_phone,
        notes: `Pickup Address: ${visitFormData.address}`
      });
      alert('Visit scheduled successfully! We will contact you soon.');
      setShowScheduleModal(false);
      setVisitFormData({ address: '', visit_date: '', visit_time: '', visitor_phone: '' });
    } catch (error) {
      console.error('Error scheduling visit:', error);
      alert(error.message || 'Failed to schedule visit. Please try again.');
    } finally {
      setIsSubmittingVisit(false);
    }
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
  };

  // Use property images from backend, or fallback to sample images
  const additionalImages = property.images && property.images.length > 0 
    ? property.images 
    : fallbackImages.slice(0, 4);
  const allImages = [property.image, ...additionalImages];

  // Sample nearby facilities based on city
  const nearbyFacilities = {
    hospitals: [
      { name: "City General Hospital", distance: "1.2 km" },
      { name: "Apollo Medical Center", distance: "2.5 km" },
      { name: "Max Healthcare", distance: "3.1 km" }
    ],
    schools: [
      { name: "Delhi Public School", distance: "800 m" },
      { name: "Ryan International", distance: "1.5 km" },
      { name: "Kendriya Vidyalaya", distance: "2.2 km" }
    ],
    transportation: [
      { name: "Metro Station", distance: "500 m" },
      { name: "Bus Stop", distance: "200 m" },
      { name: "Railway Station", distance: "5.5 km" }
    ],
    shopping: [
      { name: "Phoenix Mall", distance: "1.8 km" },
      { name: "Local Market", distance: "300 m" },
      { name: "Supermarket", distance: "600 m" }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />

      <div className="container mx-auto px-6 md:px-20 lg:px-32 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Properties
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Main Image */}
              <div className="relative h-96">
                <img
                  src={allImages[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Image Navigation */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(currentImageIndex === 0 ? allImages.length - 1 : currentImageIndex - 1)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(currentImageIndex === allImages.length - 1 ? 0 : currentImageIndex + 1)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {property.featured && (
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Featured
                    </span>
                  )}
                  {property.verified && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  )}
                </div>

                {/* Favorite Button */}
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition"
                >
                  <svg
                    className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'fill-none text-gray-700'}`}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              {/* Image Thumbnails */}
              {allImages.length > 1 && (
                <div className="p-4">
                  <div className="flex gap-2 overflow-x-auto">
                    {allImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                          currentImageIndex === index ? 'border-red-400' : 'border-gray-200'
                        }`}
                      >
                        <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{property.title}</h1>
              
              <div className="flex items-center text-gray-600 mb-6">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-lg">{property.location}</span>
              </div>

              <div className="text-4xl font-bold text-red-400 mb-6">
                {formatPrice(property.price)}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-center mb-2">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{property.bedrooms}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-center mb-2">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2m8-16h2a2 2 0 012 2v2m-4 12h2a2 2 0 002-2v-2M9 12h6m-3-3v6" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{property.bathrooms || 2}</div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-center mb-2">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{property.area}</div>
                  <div className="text-sm text-gray-600">Sq. Ft.</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-center mb-2">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m11 0v-3.5a2 2 0 00-2-2h-1M7 21h4m-4 0v-3.5a2 2 0 012-2h1m0 0V9m0 0h1m-1 0V5.5M9 21v-7" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{property.type}</div>
                  <div className="text-sm text-gray-600">Type</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Nearby Facilities */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Nearby Facilities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Healthcare
                  </h4>
                  <div className="space-y-2">
                    {nearbyFacilities.hospitals.map((hospital, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">{hospital.name}</span>
                        <span className="text-gray-500">{hospital.distance}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Education
                  </h4>
                  <div className="space-y-2">
                    {nearbyFacilities.schools.map((school, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">{school.name}</span>
                        <span className="text-gray-500">{school.distance}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    Transportation
                  </h4>
                  <div className="space-y-2">
                    {nearbyFacilities.transportation.map((transport, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">{transport.name}</span>
                        <span className="text-gray-500">{transport.distance}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Shopping
                  </h4>
                  <div className="space-y-2">
                    {nearbyFacilities.shopping.map((shop, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">{shop.name}</span>
                        <span className="text-gray-500">{shop.distance}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Map */}
            <PropertyMap property={property} nearbyFacilities={nearbyFacilities} />
          </div>

          {/* Right Column - Contact and Actions */}
          <div className="space-y-6">
            {/* EMI Calculator */}
            <EMICalculator propertyPrice={property.price} />
            
            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Interested in this property?</h3>
              
              {showInterestThankYou ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-green-800">Thank you!</p>
                      <p className="text-sm text-green-600">We've noted your interest. Our team will contact you soon.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={handleRequestInfo}
                  disabled={isSubmittingInterest}
                  className="w-full bg-red-400 hover:bg-red-500 disabled:bg-red-300 text-white font-medium py-3 rounded-lg transition mb-3"
                >
                  {isSubmittingInterest ? 'Submitting...' : 'Request Info'}
                </button>
              )}
              
              <button 
                onClick={() => setShowScheduleModal(true)}
                className="w-full border-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-white font-medium py-3 rounded-lg transition"
              >
                Schedule Visit
              </button>

              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-2">Property ID</h4>
                <p className="text-gray-600 text-sm">#{property.id.toString().padStart(6, '0')}</p>
                
                <h4 className="font-medium mb-2 mt-4">Listed Date</h4>
                <p className="text-gray-600 text-sm">{new Date(property.postedDate).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Property Features</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Age</span>
                  <span className="font-medium">2-3 Years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Parking</span>
                  <span className="font-medium">2 Cars</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Furnishing</span>
                  <span className="font-medium">Semi-Furnished</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Floor</span>
                  <span className="font-medium">5th Floor</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Floors</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Balconies</span>
                  <span className="font-medium">2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Visit Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Schedule a Visit</h3>
              <button 
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleScheduleVisit} className="space-y-4">
              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Address (for pickup) <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={visitFormData.address}
                  onChange={(e) => setVisitFormData({...visitFormData, address: e.target.value})}
                  placeholder="Enter your full address"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none resize-none"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={visitFormData.visit_date}
                  onChange={(e) => setVisitFormData({...visitFormData, visit_date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none"
                  required
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Time <span className="text-red-500">*</span>
                </label>
                <select
                  value={visitFormData.visit_time}
                  onChange={(e) => setVisitFormData({...visitFormData, visit_time: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none"
                  required
                >
                  <option value="">Select a time slot</option>
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="4:00 PM">4:00 PM</option>
                  <option value="5:00 PM">5:00 PM</option>
                  <option value="6:00 PM">6:00 PM</option>
                </select>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={visitFormData.visitor_phone}
                  onChange={(e) => setVisitFormData({...visitFormData, visitor_phone: e.target.value})}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingVisit}
                  className="flex-1 px-4 py-2 bg-red-400 hover:bg-red-500 disabled:bg-red-300 text-white rounded-lg transition"
                >
                  {isSubmittingVisit ? 'Scheduling...' : 'Schedule Visit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;