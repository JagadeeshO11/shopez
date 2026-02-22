import React, { useEffect, useState } from 'react'
import '../../styles/AllShares.css'
import axios from 'axios'

const AllShares = () => {
  const [shares, setShares] = useState([]);

  useEffect(() => {
    fetchShares();
  }, [])

  const fetchShares = async () => {
    await axios.get('http://localhost:6001/fetch-shares').then(
      (response) => {
        setShares(response.data);
      }
    )
  }

  return (
    <div className="all-shares-page">
      <h3>Product Shares</h3>
      <div className="shares-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Shared By</th>
              <th>Shared To</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {shares.map((share) => (
              <tr key={share._id}>
                <td>{share.productTitle}</td>
                <td>{share.sharedBy}</td>
                <td>{share.sharedTo}</td>
                <td>{new Date(share.sharedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AllShares
