import React, { useEffect, useState } from 'react';
import '../../styles/AllShares.css';
import axios from 'axios';
import { API_BASE } from '../../config';

const AllShares = () => {
  const [shares, setShares] = useState([]);
  useEffect(() => {
    axios.get(`${API_BASE}/api/v1/shares`)
      .then(response => setShares(response.data.shares || []))
      .catch(error => alert(error.response?.data?.message || 'Unable to load shares'));
  }, []);

  return <div className="all-shares-page"><h3>Product Shares</h3><div className="shares-table"><table><thead><tr><th>Product</th><th>Shared By</th><th>Shared To</th><th>Date</th></tr></thead><tbody>
    {shares.map(share => <tr key={share._id}><td>{share.product?.name || 'Product'}</td><td>{share.sharedBy?.name || share.sharedBy?.email || 'User'}</td><td>{share.sharedTo || 'Device share'}</td><td>{new Date(share.createdAt).toLocaleString()}</td></tr>)}
  </tbody></table></div></div>;
};
export default AllShares;
