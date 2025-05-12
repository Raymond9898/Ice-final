// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// const Location = () => {
//   const [location, setLocation] = useState(null);  // Initially set to null to avoid rendering errors
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchLocation = async () => {
//       try {
//         const response = await axios.get(
//           `http://api.ipstack.com/check?access_key=${process.env.REACT_APP_IPSTACK_KEY}`
//         );
//         setLocation(response.data);
//       } catch (error) {
//         setError('Failed to fetch location data');
//       }
//     };
//     fetchLocation();
//   }, []);

//   return (
//     <div>
//       <h1>Location</h1>
//       {location ? (
//         <div>
//           <p>Country: {location.country_name}</p>
//           <p>Region: {location.region_name}</p>
//           <p>City: {location.city}</p>
//           <p>Zip: {location.zip}</p>
//           <p>Latitude: {location.latitude}</p>
//           <p>Longitude: {location.longitude}</p>
//         </div>
        
//       ) : (
//         <p>Loading location...</p>
//       )}
//       {error && <p>{error}</p>}
//     </div>
    
//   );
// };

// export default Location;
import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

const Location = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Mock data - replace with your actual API calls
        const mockLocation = {
          country_name: 'Kenya',
          region_name: 'Nairobi',
          city: 'Nairobi',
          zip: '00100',
          latitude: -1.286389,
          longitude: 36.817223
        };
        setLocation(mockLocation);

        const mockStores = [
          {
            id: 1,
            name: "Ice Jewelz Nairobi CBD",
            address: "Kenyatta Avenue, Nairobi",
            phone: "+254 700 123 456",
            hours: "Mon-Sat: 9AM - 7PM",
            position: [-1.286389, 36.817223]
          },
          {
            id: 2,
            name: "Ice Jewelz Westlands",
            address: "Westlands Mall, Nairobi",
            phone: "+254 700 654 321",
            hours: "Mon-Sat: 10AM - 8PM",
            position: [-1.2657, 36.8029]
          }
        ];
        setStores(mockStores);

      } catch (error) {
        console.error("Location error:", error);
        setError('Unable to load location data. Showing default stores.');
        setStores([
          {
            id: 1,
            name: "Ice Jewelz Nairobi CBD",
            address: "Kenyatta Avenue, Nairobi",
            phone: "+254 700 123 456",
            hours: "Mon-Sat: 9AM - 7PM",
            position: [-1.286389, 36.817223]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container text-center py-5">
        <FaSpinner className="fa-spin fa-3x mb-3" />
        <h3>Finding your location...</h3>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">
        <FaMapMarkerAlt className="me-2" />
        Our Stores
      </h1>

      {error && (
        <div className="alert alert-warning">
          <FaExclamationTriangle className="me-2" />
          {error}
        </div>
      )}

      <div className="row">
        {/* Store List Section */}
        <div className="col-md-8 mx-auto">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Our Locations</h5>
            </div>
            <div className="card-body">
              {location && (
                <div className="mb-4">
                  <h6>Your Location</h6>
                  <p className="mb-1">{location.city}, {location.region_name}</p>
                  {location.latitude && location.longitude && (
                    <small className="text-muted">
                      {Number(location.latitude).toFixed(4)}, {Number(location.longitude).toFixed(4)}
                    </small>
                  )}
                </div>
              )}

              <hr />

              <h6 className="mb-3">Our Stores</h6>
              <div className="list-group">
                {stores.map(store => (
                  <div
                    key={store.id}
                    className={`list-group-item list-group-item-action ${selectedStore?.id === store.id ? 'active' : ''}`}
                    onClick={() => setSelectedStore(store)}
                  >
                    <h6 className="mb-1">{store.name}</h6>
                    <small className="d-block">{store.address}</small>
                    <small className="d-block">{store.phone}</small>
                    <small className="d-block">{store.hours}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Store Details */}
      {selectedStore && (
        <div className="card shadow-sm mt-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">{selectedStore.name}</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <h6>Store Information</h6>
                <p>
                  <strong>Address:</strong> {selectedStore.address}<br />
                  <strong>Phone:</strong> {selectedStore.phone}<br />
                  <strong>Hours:</strong> {selectedStore.hours}
                </p>
              </div>
              <div className="col-md-6">
                <h6>Directions</h6>
                <p>
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedStore.position[0]},${selectedStore.position[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm"
                  >
                    Get Directions
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Location;