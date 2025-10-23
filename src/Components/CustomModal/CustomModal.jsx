import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { FaLightbulb } from 'react-icons/fa';
import './CustomModal.css';
import { Link } from 'react-router-dom';

function CustomModal({ items, show, onClose }) {
    if (!show) return null;

    return (
        <div className="modal-overlay">
            
            <div className="modal-content">
            <button onClick={onClose} className="close-button ">&times;</button>

                {items.map((item, index) => (
                    <Row key={index} className="modal-item align-items-center py-2">
                        <Col xs="auto">
                            <img src={item.image} className='image'  style={{ width: item.imageWidth}} alt={item.label} loading="lazy" width={item.imageWidth || 200} height="200" />
                        </Col>
                        <Col className="text-center">
                        <Link to={item.link} className='text-decoration-none label'>
                        <p className="m-0 w-100">{item.label}</p>
                    
                        </Link>
                        </Col>
                        <Col xs="auto" className='bulb'>
                            <FaLightbulb size={24} color={item.iconColor} />
                            <div className='d-flex justify-content-end ms-5 '>
                            <p className='message-box ms-5'>{item.message}</p>
                            
                            </div>
                        </Col>
                       
                    </Row>
                ))}
            </div>
        </div>
    );
}

export default CustomModal;
