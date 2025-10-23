import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  resetPrescriptionState,
  updateOrderField,
  updateItemQuantity,
} from "../../features/prescriptionManagement/prescriptionSlice";
import { editPS_Order, reOrder } from "../../services/HistoryOrder";

export default function PrescriptionModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { selectedOrder, isEdited } = useSelector((state) => state.prescription);
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  if (!isOpen || !selectedOrder) return null;

  const { presorted, order_info, images = [], order_detail = [] } = selectedOrder;

  const handleInputChange = (e) => {
    dispatch(updateOrderField({ key: e.target.name, value: e.target.value }));
  };

  const handleQtyChange = (index, qty) => {
    const quantity = Math.max(0, Number(qty));
    dispatch(updateItemQuantity({ index, quantity }));
  };

  const handleAction = async () => {
    setLoading(true);
    try {
      if (isEdited) {
        await editPS_Order(selectedOrder);
      } else {
        await reOrder(order_info.orderNumber || order_info.id, selectedOrder); // Use orderNumber if available
      }
      setConfirmation(true);
    } catch (err) {
      alert("❌ Failed to process order.");
    } finally {
      setLoading(false);
    }
  };

  const closeAll = () => {
    setConfirmation(false);
    dispatch(resetPrescriptionState());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md w-full max-w-5xl shadow-lg relative max-h-[90vh] overflow-y-auto">
        <button className="absolute top-2 right-3 text-xl" onClick={closeAll}>
          ✖
        </button>

        {!confirmation ? (
          <>
            <h2 className="text-xl font-bold mb-4">Prescription Details</h2>

            {/* Images */}
            {images.length > 0 && (
              <div className="flex gap-3 mb-4 flex-wrap">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.filePath}
                    alt={`Prescription ${idx + 1}`}
                    className="w-24 h-24 object-cover rounded cursor-pointer"
                    onClick={() => window.open(img.filePath, "_blank")}
                  />
                ))}
              </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                "firstName",
                "lastName",
                "phone",
                "email",
                "address",
                "city",
                "state",
                "durationType",
                "durationNumber",
                "orderingFor",
                "patientName",
                "relationToPatient",
                "nonPrescriptionMedicine",
                "specialInstructions",
              ].map((key) => (
                <input
                  key={key}
                  name={key}
                  value={presorted?.[key] || ""}
                  onChange={handleInputChange}
                  placeholder={key}
                  className="border p-2 rounded"
                />
              ))}
            </div>

            {/* Items Table */}
            <div>
              <h3 className="font-semibold mb-2">Prescription Items</h3>
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">#</th>
                    <th className="p-2 text-left">Product</th>
                    <th className="p-2 text-left">Qty</th>
                    <th className="p-2 text-left">Unit Price</th>
                    <th className="p-2 text-left">Total</th>
                    <th className="p-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {order_detail.map((item, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2">{idx + 1}</td>
                      <td className="p-2">{item.product_name}</td>
                      <td className="p-2">
                        {editingRow === idx ? (
                          <input
                            type="number"
                            value={item.quantity}
                            min="1"
                            className="border px-2 py-1 w-16"
                            onChange={(e) => handleQtyChange(idx, e.target.value)}
                          />
                        ) : (
                          item.quantity
                        )}
                      </td>
                      <td className="p-2">Rs. {item.product_price}</td>
                      <td className="p-2">
                        Rs. {(item.product_price * item.quantity).toFixed(2)}
                      </td>
                      <td className="p-2">
                        {editingRow === idx ? (
                          <button
                            className="text-green-600"
                            onClick={() => setEditingRow(null)}
                          >
                            ✅
                          </button>
                        ) : (
                          <button
                            className="text-blue-600"
                            onClick={() => setEditingRow(idx)}
                          >
                            ✏️
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={handleAction}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {isEdited ? "Save & Order" : "Re-order"}
              </button>
              <button
                onClick={onClose}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h3 className="text-lg font-semibold text-green-700">
              ✅ Order Placed Successfully
            </h3>
            <button
              onClick={closeAll}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
