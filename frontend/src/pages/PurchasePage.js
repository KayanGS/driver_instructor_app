import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/PurchasePage.css';

const PurchasePage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const selectedPackage = queryParams.get('package');

    const [selected, setSelected] = useState(selectedPackage || '');
    const userId = localStorage.getItem('userId');
    const api =
        window.location.hostname === 'localhost'
            ? 'http://localhost:5000/api'
            : 'https://driver-instructor-app-backend.onrender.com/api';

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

    const lessonTypes = [
        { id: 'individual', label: 'Single Lesson', price: '50€', description: '60 minutes class.' },
        { id: 'sixpack', label: '6-Lesson Package', price: '250€', description: '6×60 Minutes Classes.' },
        { id: 'twelvepack', label: '12-Lesson Package', price: '500€', description: '12 Mandatory 60 minutes EDT Lessons.' }
    ];

    return (
        <div className="purchase-container">
            <h2>Purchase Driving Lessons</h2>

            <div className="selector-box">
                <h3>Select Lesson Package</h3>
                {lessonTypes.map(type => (
                    <div
                        key={type.id}
                        className={`lesson-type-option ${selected === type.id ? 'selected' : ''}`}
                        onClick={() => setSelected(type.id)}
                    >
                        <div>
                            <strong>{type.label}</strong>
                            <p>{type.description}</p>
                        </div>
                        <div>{type.price}</div>
                    </div>
                ))}
                {selected && (
                    <p className="selected-note">Selected Package: <strong>{selected}</strong></p>
                )}
            </div>

            <div className="bank-details">
                <h3>Bank Transfer Instructions</h3>
                <p><strong>Bank Name:</strong> AIB</p>
                <p><strong>Account Name:</strong> KV1 Driving School</p>
                <p><strong>IBAN:</strong> IE12ABCD34567890123456</p>
                <p><strong>Reference:</strong> KV1 Account</p>
                <p><em>Note: Payment processing is not implemented. Click Confirm to simulate the purchase.</em></p>
            </div>

            <button onClick={handlePurchase} className="purchase-button">Confirm Purchase</button>
            {message && <p className="response-message">{message}</p>}
        </div>
    );
};

export default PurchasePage;
