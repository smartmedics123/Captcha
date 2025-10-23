import React, { useState, useEffect, useRef } from 'react'; // useRef ko import karein
import { Form } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import './LocationIQAutocomplete.css';
import MapModal from '../MapModal';

// A custom hook for debouncing input to reduce API calls
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};

const LocationIQAutocomplete = ({ value, onChange, onSelect, isInvalid, disabled }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [showMapModal, setShowMapModal] = useState(false);
    const [isOpeningMap, setIsOpeningMap] = useState(false);
    const [initialMapPosition, setInitialMapPosition] = useState(null);

    const debouncedSearchTerm = useDebounce(value, 400);
    const API_KEY = import.meta.env.VITE_LOCATIONIQ_API_KEY;

    // >> NAYA CODE: Autocomplete container ka reference banane ke liye
    const autocompleteRef = useRef(null);

    // >> NAYA CODE: Bahir click karne par suggestions ko band karne ke liye
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
                setSuggestions([]);
            }
        };
        // Event listener add karein
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Component unmount hone par listener remove karein
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []); // Empty dependency array ka matlab yeh effect sirf ek baar chalega

    useEffect(() => {
        if (debouncedSearchTerm.length < 3) {
            setSuggestions([]);
            return;
        }

        const fetchSuggestions = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('https://api.locationiq.com/v1/autocomplete.php', {
                    params: {
                        key: API_KEY,
                        q: debouncedSearchTerm,
                        format: 'json',
                        addressdetails: 1,
                        countrycodes: 'pk'
                    }
                });
                setSuggestions(response.data || []);
            } catch (error) {
                console.error("Error fetching location suggestions:", error);
                setSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSuggestions();
    }, [debouncedSearchTerm, API_KEY]);

    const handleSelect = (suggestion) => {
        const addressDetails = {
            address: suggestion.display_name,
            city: suggestion.address.city || suggestion.address.town || suggestion.address.county || '',
            state: suggestion.address.state || '',
        };
        onSelect(addressDetails);
        setSuggestions([]);
    };

    const handleOpenMapModal = () => {
        setIsOpeningMap(true);
        if (!navigator.geolocation) {
            Swal.fire('Not Supported', 'Geolocation is not available.', 'warning');
            setInitialMapPosition(null);
            setShowMapModal(true);
            setIsOpeningMap(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setInitialMapPosition({ lat: latitude, lng: longitude });
                setShowMapModal(true);
                setIsOpeningMap(false);
            },
            () => {
                Swal.fire('Location Access Denied', 'Opening map at default location.', 'warning');
                setInitialMapPosition(null);
                setShowMapModal(true);
                setIsOpeningMap(false);
            }
        );
    };

    const handleMapLocationConfirm = async (position) => {
        setShowMapModal(false);
        try {
            const response = await axios.get('https://us1.locationiq.com/v1/reverse.php', {
                params: { key: API_KEY, lat: position.lat, lon: position.lng, format: 'json' },
            });
            if (response.data) {
                handleSelect(response.data);
            }
        } catch (error) {
            Swal.fire('Error', 'Could not fetch address from the selected location.', 'error');
        }
    };

    return (
        <>
            {/* >> NAYA CODE: Container div mein ref ko attach karein */}
            <div className="autocomplete-container" ref={autocompleteRef}>
                <Form.Control
                    as="textarea"
                    name="address"
                    value={value}
                    onChange={onChange}
                    rows={2}
                    className={isInvalid ? 'is-invalid' : ''}
                    placeholder="Start typing your delivery address..."
                    disabled={disabled}
                />
                <button
                    type="button"
                    className="current-location-btn"
                    onClick={handleOpenMapModal}
                    disabled={disabled || isOpeningMap}
                    title="Select location on map" // Title updated for clarity
                >
                    {isOpeningMap ? <span className="spinner-border spinner-border-sm"></span> : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-geo-alt-fill" viewBox="0 0 16 16"><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>}
                </button>
                
                {/* >> REMOVED: 'Select on Map' wala button yahan se hata diya gaya hai */}

                {isLoading && <div className="autocomplete-loading">Loading...</div>}
                {suggestions.length > 0 && (
                    <ul className="suggestions-list">
                        {suggestions.map((suggestion) => (
                            <li key={suggestion.place_id} onClick={() => handleSelect(suggestion)}>
                                {suggestion.display_name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <MapModal
                show={showMapModal}
                onClose={() => setShowMapModal(false)}
                onConfirm={handleMapLocationConfirm}
                initialPosition={initialMapPosition}
            />
        </>
    );
};

export default LocationIQAutocomplete;