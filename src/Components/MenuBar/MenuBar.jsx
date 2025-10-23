import { BsChevronDown, BsChevronRight } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";


function MenuBar() {
  // Helper function to convert full label to category name for API
  const getCategoryNameFromLabel = (label) => {
    const categoryMap = {
      "Cardiovascular Health (Heart)": "Heart",
      "Respiratory Health (Lungs)": "Respiratory", 
      "Dermatological Health (Skin)": "Skin",
      "Reproductive Health (Men's and Women's Health)": "Reproductive",
      "Gastrointestinal Health (Stomach)": "Gastro",
      "Endocrine Health (Harmonal)": 'Endo',
      "Infectious Diseases (Antibiotics and Antivirals)": 'Antibiotic',
      "Mental Health (Psychiatric Medications)": "Mental",
      "Ophthalmic Health (Optic)": "Eye",
      "Immunology (Allergy and Immune Support)": 'Antiallergy', 
      "Neurological Health (Brain)": "Neuro",
      "Musculoskeletal Health (Bones and Muscles)": 'Ortho',
      "Urological Health (Urinary System)": "Uro"
    };
    
    return categoryMap[label] || label;
  };

  const menuItems = [
    {
      title: "Medicines",
      heading: "Medicines",
      to: "/medicines", 
      items: [
        { label: "Cardiovascular Health (Heart)" },
        { label: "Respiratory Health (Lungs)" },
        { label: "Dermatological Health (Skin)"},
        { label: "Reproductive Health (Men’s and Women’s Health)" },
        { label: "Gastrointestinal Health (Stomach)" },
        { label: "Endocrine Health (Harmonal)" },
        { label: "Infectious Diseases (Antibiotics and Antivirals)" },
        { label: "Mental Health (Psychiatric Medications)" },
        { label: "Ophthalmic Health (Optic)" },
        // { label: "Endocrine Health (Bones and Muscles)" },
        { label: "Immunology (Allergy and Immune Support)" },
        { label: "Neurological Health (Brain)" },
        { label: "Musculoskeletal Health (Bones and Muscles)" },
        { label: "Urological Health (Urinary System)" },
      ],
    },
    {
      title: "Nutritions & Supplements",
      heading: "Nutritions & Supplements",
      to: "/nutrition-supplements",
      items: [
        { label: "Vitamins and Minerals", icon: true },
        { label: "Probiotics", icon: true },
        { label: "Dietary Supplements", icon: true },
        { label: "Nutraceuticals", icon: true },
      ],
    },
    {
      title: "Medical Supplies",
      heading: "Medical Supplies",
      to: "/medical-supplies",
      items: [
        // { label: "First Aid Supplies", icon: true },
        { label: "Incontinence Products", icon: true },
        { label: "Surgical Supplies", icon: true },
        // { label: "Wound Care", icon: true },
        { label: "Respiratory Supplies", icon: true },
        // { label: "Temperature Control", icon: true },
        // { label: "Diagnostic Tools", icon: true },
        // { label: "Personal Care Items", icon: true },
        { label: "Drips and Cannuals", icon: true },
        // { label: "Mobility Aids", icon: true },
        // { label: "Orthopedic Supports", icon: true },
        // { label: "Urine Bags", icon: true },
      ],
    },
    {
      title: "Self Medication",
      heading: "Self Medication",
      to: "/self-medication",
      items: [
        { label: "Fever" },
        // { label: "Sore Throat" },
        { label: "Pain Relief" },
        // { label: "Oral Infections" },
        { label: "Cold Cough" },
        // { label: "Eye Infections" },
        { label: "Heartburn/Indigestion" },
        // { label: "Rashes & Itches" },
        { label: "Muscle & Joint Pain" },
        { label: "Constipation/Diarrhea" },
        // { label: "Headache & Migraine" },
        // { label: "Nasal Congestion" },
        { label: 'Antiallergy' },
        { label: "Children’s Health" },
        // { label: "Toothache" },
      ],
    },
  ];
  const navigate = useNavigate()

  return (
    <div className="menu-bar d-none d-lg-block">
      <div className="d-flex justify-content-center gap-3 p-2">
        {menuItems.map((menu, index) => (
          <ul className="navbar-nav" key={index}>
            <li className="nav-item dropdown">
              <div
                className="p-3 fw-normal custom-dropdown-toggle d-inline-flex align-items-center gap-2"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                role="button"
                style={{ cursor: "pointer" }}
              >
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(menu.to); 
                  }}
                >
                  {menu.title}
                </span>
                <BsChevronDown />
              </div>
              <div className="dropdown-menu navbar-submenu px-5 p-3">
                <h5 className="fs-2 mb-3">{menu.heading}</h5>
                <div
                  className={`submenu ${
                    menu.items.length <= 6 ? "" : "submenu-3-item"
                  }`}
                >
                  {menu.items.map((item, i) =>
                    item.to ? (
                      <Link className="dropdown-item" to={item.to} key={i}>
                        {item.label} {item.icon && <BsChevronRight />}
                      </Link>
                    ) : menu.title === "Medicines" ? (
                      <Link 
                        className="dropdown-item" 
                        to={`/medicines?${new URLSearchParams({ category: getCategoryNameFromLabel(item.label) }).toString()}`} 
                        key={i}
                      >
                        {item.label} {item.icon && <BsChevronRight />}
                      </Link>
                    ) : menu.title === "Nutritions & Supplements" ? (
                      <Link 
                        className="dropdown-item" 
                        to={`/nutrition-supplements?${new URLSearchParams({ category: item.label }).toString()}`} 
                        key={i}
                      >
                        {item.label} {item.icon && <BsChevronRight />}
                      </Link>
                    ) : menu.title === "Self Medication" ? (
                      <Link 
                        className="dropdown-item" 
                        to={`/self-medication?${new URLSearchParams({ category: item.label }).toString()}`} 
                        key={i}
                      >
                        {item.label} {item.icon && <BsChevronRight />}
                      </Link>
                    ) : menu.title === "Medical Supplies" ? (
                      <Link 
                        className="dropdown-item" 
                        to={`/medical-supplies?${new URLSearchParams({ category: item.label }).toString()}`} 
                        key={i}
                      >
                        {item.label} {item.icon && <BsChevronRight />}
                      </Link>
                    ) : (
                      <a className="dropdown-item" href="#" key={i}>
                        {item.label} {item.icon && <BsChevronRight />}
                      </a>
                    )
                  )}
                </div>
              </div>
            </li>
          </ul>
        ))}
      </div>
    </div>
  );
}

export default MenuBar;