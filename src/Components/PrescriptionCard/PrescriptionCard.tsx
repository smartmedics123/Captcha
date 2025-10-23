import { useDispatch } from "react-redux";
import { setSelectedOrder } from "../../features/prescriptionManagement/prescriptionSlice"; 
import { getOrderDetailsById } from "../../services/HistoryOrder";
import { useState } from "react";
import PrescriptionModal from "../PrescriptionModal/PrescriptionModal";

interface Order {
  orderNumber?: string;
  order_id?: string;
  firstName: string;
  lastName: string;
  order_created_at: string;
  status: string;
  // Add any other fields used in this component or required by getOrderDetailsById
}

export default function PrescriptionCard({ order }: { order: Order }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const openModal = async () => {
    const fullOrder = await getOrderDetailsById(order.orderNumber || order.order_id); // Use orderNumber if available, fallback to order_id
    dispatch(setSelectedOrder(fullOrder));
    setOpen(true);
  };

  return (
    <>
      <div
        onClick={openModal}
        className="border p-4 rounded shadow cursor-pointer hover:shadow-lg transition"
      >
        <h3 className="font-bold">{order.firstName} {order.lastName}</h3>
        <p>{order.order_created_at}</p>
        <p>Status: {order.status}</p>
      </div>

      <PrescriptionModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
