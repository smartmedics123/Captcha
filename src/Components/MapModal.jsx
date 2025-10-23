import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { Modal, Button, Form, Spinner, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './MapModal.css'; // <-- CSS file ko yahan import karein

// Fix for default marker icon issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x, // Retina displays ke liye behtar icon
    shadowUrl: markerShadow,
});

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    map.setView(center, zoom);
    return null;
};

const LocationPicker = ({ setPosition }) => {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });
    return null;
};

const MapModal = ({ show, onClose, onConfirm, initialPosition }) => {
    const API_KEY = import.meta.env.VITE_LOCATIONIQ_API_KEY;
    const defaultPosition = { lat: 24.8607, lng: 67.0011 }; // Karachi's coordinates

    const [position, setPosition] = useState(initialPosition || defaultPosition);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRecenterLoading, setIsRecenterLoading] = useState(false);

    const debouncedSearchTerm = useDebounce(searchQuery, 400);

    useEffect(() => {
        if (show) {
            setPosition(initialPosition || defaultPosition);
            setSearchQuery('');
            setSuggestions([]);
        }
    }, [show, initialPosition]);

    useEffect(() => {
        if (debouncedSearchTerm.length < 3) {
            setSuggestions([]);
            return;
        }
        const fetchSuggestions = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('https://api.locationiq.com/v1/autocomplete.php', {
                    params: { key: API_KEY, q: debouncedSearchTerm, format: 'json', countrycodes: 'pk' },
                });
                setSuggestions(response.data || []);
            } catch (error) {
                console.error("Error fetching map suggestions:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSuggestions();
    }, [debouncedSearchTerm, API_KEY]);

    const handleSuggestionClick = (suggestion) => {
        const newPos = { lat: parseFloat(suggestion.lat), lng: parseFloat(suggestion.lon) };
        setPosition(newPos);
        setSearchQuery(suggestion.display_name);
        setSuggestions([]);
    };

    const handleRecenter = () => {
        setIsRecenterLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setPosition({ lat: latitude, lng: longitude });
                setIsRecenterLoading(false);
            },
            () => {
                alert("Could not get your location. Please check browser permissions.");
                setIsRecenterLoading(false);
            }
        );
    };

    return (
        <Modal show={show} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Select Location</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="autocomplete-container mb-3">
                    <InputGroup>
                        <Form.Control
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for an address or place..."
                            className="search-input"
                        />
                        {isLoading && <Spinner animation="border" size="sm" className="search-spinner" />}
                    </InputGroup>
                    {suggestions.length > 0 && (
                        <ul className="suggestions-list">
                            {suggestions.map((s) => (
                                <li key={s.place_id} onMouseDown={() => handleSuggestionClick(s)}>
                                    {s.display_name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="map-wrapper">
                    <MapContainer center={position} zoom={15} className="map-container">
                        <ChangeView center={position} zoom={15} />
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={position}></Marker>
                        <LocationPicker setPosition={setPosition} />
                    </MapContainer>
                    <Button
                        variant="light"
                        onClick={handleRecenter}
                        disabled={isRecenterLoading}
                        className="recenter-btn"
                        title="Go to my current location"
                    >
                        {isRecenterLoading ? <Spinner animation="border" size="sm" /> : (
                            // SVG Icon for better look than emoji
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <circle cx="12" cy="12" r="6"></circle>
                                <line x1="21" y1="12" x2="23" y2="12"></line>
                                <line x1="1" y1="12" x2="3" y2="12"></line>
                                <line x1="12" y1="1" x2="12" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="23"></line>
                            </svg>
                        )}
                    </Button>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={() => onConfirm(position)}>Confirm This Location</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MapModal;