import { useEffect, useState } from "react";
import { Table, Button, Form, Container } from "react-bootstrap";
import './AddressBook.css'
import { address, deleteAdress, updateAdress } from "../../../../services/CustomerDashboard/address";
import Swal from "sweetalert2";
import LoadingSpinner from "../../../../Components/Spinner/LoadingSpinner";
const AddressBook = () => {
  const [loader, setLoader] = useState(false);

  const [addresses, setAddresses] = useState([

  ]);



  const handleInputChange = (e, id, field) => {
    const updatedAddresses = addresses.map((item) =>
      item.id === id ? { ...item, [field]: e.target.value } : item
    );
    setAddresses(updatedAddresses);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this Address? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteAdress(id);

          if (response && response.message === 'Address deleted successfully') {
            Swal.fire({
              icon: 'success',
              title: 'Deleted',
              text: response.message,
            });
            setAddresses(addresses.filter((item) => item.id !== id));
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete Address',
            });
          }
        } catch (error) {
          console.error('Error deleting Address:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while deleting the Address',
          });
        }
      }
    });
  };


  const toggleEdit = (id) => {
    const updatedAddresses = addresses.map((item) =>
      item.id === id ? { ...item, isEditing: !item.isEditing } : item
    );
    setAddresses(updatedAddresses);
  };
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await address();
        // Log the response
        console.log("Response Data:", response.data);
        
        // The response structure is: { customerNumber: "WA-1", addressBook: [...], count: 1 }
        const addressBookData = response.data?.addressBook || [];
        
        if (Array.isArray(addressBookData)) {
          const processedData = addressBookData.map((item) => ({
            id: item.id,
            city: item.city || "",
            state: item.state || "",
            address: item.address || "No Address",
            cityCountry: item.city || "No City/Country", // Add this if available
            phoneNumber: item.phone || "No Phone Number",
            isEditing: false,
          }));
          setLoader(false)

          // Set the processed data in the state
          setAddresses(processedData);
          console.log("Processed Address Data:", processedData);
        } else {
          console.warn("Address book data is not an array:", addressBookData);
          setAddresses([]);
        }
        // Optionally, you can set the data in the state if you need to display it
        // setAddresses(data); // Assuming data is an array of Addresss
      } catch (err) {
        // setError('Failed to load Addresss');
        console.error("Error fetching data:", err);
      } finally {
        // setLoading(false);
      }
    };

    fetchAddress();
  }, []); // Empty dependency array to run once when the component mounts

  const handleSave = async (id) => {
    const addressToUpdate = addresses.find((item) => item.id === id);

    try {
      const updatedData = {
        id: addressToUpdate.id,
        address: addressToUpdate.address,
        city: addressToUpdate.city,
        state: addressToUpdate.state,
        phone: addressToUpdate.phoneNumber,
      };

      const response = await updateAdress(updatedData);

      if (response) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Address updated successfully.",
        });
        toggleEdit(id);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update address.",
        });
      }
    } catch (error) {
      console.error("Error updating address:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while updating the address.",
      });
    }
  };



  return (

    <Container className="mt-5">
      <div className="address-book-container">
        <h3 className='fw-bold mb-3'>Address Book</h3>
        {loader ? (<>
          <LoadingSpinner />

        </>) : (<>

<div className="row">
  {addresses.map((item, index) => (
    <div className="col-xxl-4 col-xl-6 col-lg-6 col-md-12 mb-4" key={item.id}>
      <div className="address-card shadow-sm rounded p-3">
        <p><strong>Address #{index + 1}</strong></p>

        <p>
          Address:{" "}
          {item.isEditing ? (
            <Form.Control
              type="text"
              value={item.address}
              onChange={(e) => handleInputChange(e, item.id, "address")}
            />
          ) : (
            item.address
          )}
        </p>

        <p>
          City:{" "}
          {item.isEditing ? (
            <Form.Control
              type="text"
              value={item.city}
              onChange={(e) => handleInputChange(e, item.id, "city")}
            />
          ) : (
            item.city
          )}
        </p>

        <p>
          Province:{" "}
          {item.isEditing ? (
            <Form.Control
              type="text"
              value={item.state}
              onChange={(e) => handleInputChange(e, item.id, "state")}
            />
          ) : (
            item.state
          )}
        </p>
{/* 
        <p>
          Phone:{" "}
          {item.isEditing ? (
            <Form.Control
              type="text"
              value={item.phoneNumber}
              onChange={(e) => handleInputChange(e, item.id, "phoneNumber")}
            />
          ) : (
            item.phoneNumber
          )}
        </p> */}

        <div className="d-flex justify-content-between mt-3">
          {item.isEditing ? (
            <button onClick={() => handleSave(item.id)} className="edit-btn">
              Save
            </button>
          ) : (
            <button onClick={() => toggleEdit(item.id)} className="edit-btn">
              Edit
            </button>
          )}
          <button
            onClick={() => handleDelete(item.id)}
            className="delete-btn me-3"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  ))}
</div>


        </>)}

      </div>
    </Container>
  );
};

export default AddressBook;
