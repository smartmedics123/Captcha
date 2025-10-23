import React, { useState } from 'react';
import './DropDown.css';
import { Button, Col, Dropdown, Row } from 'react-bootstrap';

export default function DropDown() {
  const Categories = [
    {
      name: 'Medicines',
      rootcategory: [
        {
          name: 'Cardiovascular Health (Heart)',
          sub: []
        },
        {
          name: 'Gastrointestinal Health (Stomach)', // No sub-items, should display only the name
          sub: []
        },
        {
          name: 'Ophthalmic Health (Optic)', // No sub-items, should display only the name
          sub: []
        }, 
        {
name: 'Neurological Health (Brain)', // No sub-items, should display only the name
          sub: []
        },
        
        {
          name: 'Respiratory Health (Lungs)', // No sub-items, should display only the name
          sub: []
        }, {
          name: 'Endocrine Health (Hormonal)', // No sub-items, should display only the name
          sub: []
        }, {
          name: 'Musculoskeletal Health (Bones and Muscles)', // No sub-items, should display only the name
          sub: []
        }, {
          name: 'Dermatological Health (Skin)', // No sub-items, should display only the name
          sub: []
        }, {
          name: 'Infectious Diseases (Antibiotics and Antivirals)', // No sub-items, should display only the name
          sub: []
        },
        {
          name: 'Immunology (Allergy and Immune Support)', // No sub-items, should display only the name
          sub: []
        },
        {
          name: 'Urological Health (Urinary System)', // No sub-items, should display only the name
          sub: []
        }, {
          name: 'Reproductive Health (Men\'s and Women\'s Health)', // No sub-items, should display only the name
          sub: []
        }, {
          name: 'Mental Health (Psychiatric Medications)', // No sub-items, should display only the name
          sub: []
        }
      ]
    },
    {
      name: 'Nutritions & Supplements',
      rootcategory: [
        {
          name: 'Vitamins and Minerals',
          sub: ['Multivitamins', 'Vitamin D', 'Vitamin C', 'B-complex vitamins', 'Calcium', 'Iron', 'Magnesium']

        },
        {
          name: 'Probiotics', // No sub array, should display only the name
          sub: ['Digestive health supplements', 'Women’s health probiotics', 'Immune support probiotics']

        },
        {
          name: 'Protein Supplements', // No sub array, should display only the name
          sub: ['Whey protein', 'Plant-based protein (pea, soy, rice)', 'Protein bars']

        },
        {
          name: 'Omega-3 Fatty Acids', // No sub array, should display only the name
          sub: ['Fish oil capsules', 'Flaxseed oil']


        }, {
          name: 'Specialty Supplements', // No sub array, should display only the name
          sub: ['Joint support (glucosamine, chondroitin)', 'Sleep aids (melatonin, valerian root)', 'Energy boosters (coenzyme Q10, B vitamins)']

        }
        , {
          name: 'Dietary Supplements', // No sub array, should display only the name
          sub: ['Gluten-free supplements', 'Vegan and vegetarian options', 'Organic supplements']


        }
      ]
    },
    {
      name: 'Medical Supplies',
      rootcategory: [
        {
          name: 'First Aid Supplies',
          sub: ['Adhesive bandages (various sizes)', 'Gauze pads and rolls', 'Adhesive tape', 'Antiseptic wipes and solutions', 'Burn cream and ointments', 'First aid kits']

        },
        {
          name: 'Wound Care',
          sub: ['Sterile dressings', 'Hydrocolloid bandages', 'Antibacterial ointments', 'Specialty wound care products']
        },
        {
          name: 'Diagnostic Tools',
          sub: ['Thermometers (digital, infrared)', 'Blood pressure monitors', 'Glucometers and test strips', 'Stethoscopes']


        },
        {
          name: 'Mobility Aids',
          sub: ['Crutches', 'Walkers', 'Canes', 'Wheelchairs']


        },
        {
          name: 'Incontinence Products',
          sub: ['Adult diapers', 'Pads and liners', 'Bed protection sheets']


        },
        {
          name: 'Respiratory Supplies',
          sub: ['Nebulizers', 'Inhalers', 'Oxygen masks and tubing', 'CPAP supplies']


        },
        {
          name: 'Personal Care Items',
          sub: ['Medical gloves', 'Face masks', 'Hand sanitizers', 'Cotton balls and swabs']
        },
        {
          name: 'Orthopedic Supports',
          sub: ['Braces (ankle, wrist, knee)', 'Supports for back, neck, and shoulders', 'Compression stockings']
        },
        {
          name: 'Surgical Supplies',
          sub: ['Scissors and tweezers', 'Surgical gloves', 'Sterile instruments']
        },
        {
          name: 'Temperature Control',
          sub: ['Heating pads', 'Ice packs', 'Cold therapy wraps']

        },
        {
          name: 'Drips and Cannulas',
          sub: ['IV Drips', 'Cannulas']

        },
        {
          name: 'Urine Bags',
          sub: ['Urinary catheters', 'Drainage bags']

        }
      ]
    },
    {
      name: 'Self Medication',
      rootcategory: [
        { name: 'Fever', sub: [] },
        { name: 'Cold & Flu', sub: [] },
        { name: 'Cough Remedies', sub: [] },
        { name: 'Muscle & Joint Pain', sub: [] },
        { name: 'Antiallergy', sub: [] },
        { name: 'Sore Throat', sub: [] },
        { name: 'Eye Infections', sub: [] },
        { name: 'Constipation/Diarrhea', sub: [] },
        { name: 'Children\'s Health', sub: [] },
        { name: 'Pain Relief', sub: [] },
        { name: 'Heartburn/Indigestion', sub: [] },
        { name: 'Headache & Migraine', sub: [] },
        { name: 'Toothache', sub: [] },
        { name: 'Oral Infections', sub: [] },
        { name: 'Rashes & Itches', sub: [] },
        { name: 'Nasal Congestion', sub: [] },
       
      ]
    }
    
  ];
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredSubcategory, setHoveredSubcategory] = useState(null);
  const [viewMoreIndex, setViewMoreIndex] = useState(null);

  let hoverTimeout;

  const handleMouseEnterCategory = (index) => {
    clearTimeout(hoverTimeout);
    setHoveredCategory(index);
  };

  const handleMouseLeaveCategory = () => {
    hoverTimeout = setTimeout(() => {
      setHoveredCategory(null);
    }, 300);
  };

  const handleMouseEnterSubcategory = (index) => {
    clearTimeout(hoverTimeout);
    setHoveredSubcategory(index);
  };

  const handleMouseLeaveSubcategory = () => {
    hoverTimeout = setTimeout(() => {
      setHoveredSubcategory(null);
    }, 300);
  };

  const toggleViewMore = (index) => {
    setViewMoreIndex(viewMoreIndex === index ? null : index);
  };


  return (
    <>
     <Row>
        {Categories.map((item, index) => (
          <Col
            key={index}
            onMouseEnter={() => handleMouseEnterCategory(index)}
            onMouseLeave={handleMouseLeaveCategory}
          >
            <Dropdown show={hoveredCategory === index}>
              <Dropdown.Toggle
                className="border-0 bg-body text-black mainname"
                id="dropdown-basic"
              >
                {item.name}
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-hover sub">
                {item.rootcategory
                  .slice(0, viewMoreIndex === index ? item.rootcategory.length : 6)
                  .map((rootItem, subindex) =>
                    rootItem.sub && rootItem.sub.length > 0 ? (
                      <Dropdown
                        key={subindex}
                        drop="end"
                        onMouseEnter={() => handleMouseEnterSubcategory(subindex)}
                        onMouseLeave={handleMouseLeaveSubcategory}
                        show={hoveredSubcategory === subindex}
                      >
                        <Dropdown.Toggle as="div" className="dropdown-item subitem">
                          {rootItem.name}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {rootItem.sub.map((subItem, subItemIndex) => (
                            <Dropdown.Item key={subItemIndex}>
                              {subItem}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    ) : (
                      <Dropdown.Item key={subindex}>{rootItem.name}</Dropdown.Item>
                    )
                  )}
                {item.rootcategory.length > 6 && (
                  <Button
  variant="link"
  onClick={() => toggleViewMore(index)}
  className={`dropdown-item viewmore ${
    viewMoreIndex === index ? "expanded" : ""
  }`}
>
  {viewMoreIndex === index ? "View Less" : "View More"}
  <span className="triangle-icon"></span>
</Button>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        ))}
      </Row>
    </>
  );
}
