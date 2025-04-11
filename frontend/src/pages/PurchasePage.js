// filepath: frontend/src/pages/PurchasePage.js

// ################################## IMPORTS ##################################
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/PurchasePage.css';
// ################################ END IMPORTS ###############################


// ########################### PURCHASE PAGE COMPONENT #########################
/**
 * @returns {JSX.Element} PurchasePage component 
 */
const PurchasePage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const selectedPackage = queryParams.get('package');

    const [selected, setSelected] = useState(selectedPackage || 'individual');
    const userId = localStorage.getItem('userId');
    const api = process.env.NODE_ENV === 'development'
        ? 'http://localhost:5000/api'
        : window.location.origin + '/api';

    const [message, setMessage] = useState('');

    const handlePurchase = async () => {
        if (!userId) {
            setMessage('❌ Please log in to purchase a package.');
            return;
        }

        try {
            const res = await fetch(`${api}/users/${userId}/buy`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ package: selected })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage(`✅ ${data.message} (Now you have ${data.current_tokens} token(s))`);
            } else {
                setMessage(`❌ ${data.message}`);
            }
        } catch (err) {
            setMessage('❌ Error purchasing package');
        }
    };

    return (
        <div className="purchase-container">
            <h2>Purchase Driving Lessons</h2>

            <div className="radio-group">
                <label>
                    <input
                        type="radio"
                        name="package"
                        value="individual"
                        checked={selected === 'individual'}
                        onChange={(e) => setSelected(e.target.value)}
                    />
                    1 Lesson (50€)
                </label>
                <label>
                    <input
                        type="radio"
                        name="package"
                        value="sixpack"
                        checked={selected === 'sixpack'}
                        onChange={(e) => setSelected(e.target.value)}
                    />
                    6 Lessons (250€)
                </label>
                <label>
                    <input
                        type="radio"
                        name="package"
                        value="twelvepack"
                        checked={selected === 'twelvepack'}
                        onChange={(e) => setSelected(e.target.value)}
                    />
                    12 Lessons (500€)
                </label>
            </div>

            <div className="bank-details">
                <h3>Bank Transfer Instructions</h3>
                <p><strong>Bank Name:</strong> AIB</p>
                <p><strong>Account Name:</strong> KV1 Driving School</p>
                <p><strong>IBAN:</strong> IE12ABCD34567890123456</p>
                <p><strong>Reference:</strong> KV1 Account</p>
                <p><em>Note: Payment processing is not yet implemented. This is a simulation.</em></p>
            </div>

            <button onClick={handlePurchase} className="purchase-button">Confirm Purchase</button>
            {message && <p className="response-message">{message}</p>}
        </div>
    );
};

export default PurchasePage;
