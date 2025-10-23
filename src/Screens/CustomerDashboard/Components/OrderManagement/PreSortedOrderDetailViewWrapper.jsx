import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderDetailsById } from "../../../../services/HistoryOrder";
import PreSortedOrderDetailView from "./PreSortedOrderDetailView";


const PreSortedOrderDetailViewWrapper = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderDetailsById(orderId); // orderId should be orderNumber from the caller
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  return (
    <PreSortedOrderDetailView
      order={order}
      isLoading={isLoading}
      onClose={() => navigate(-1)}
      breadcrumbLabel="Recipient Orders"
    />
  );
};

export default PreSortedOrderDetailViewWrapper;
