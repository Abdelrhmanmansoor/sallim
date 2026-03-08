import fetch from 'node-fetch';

async function test() {
    try {
        const email = 'testuser' + Date.now() + '@example.com';
        // 1. Register
        const resAuth = await fetch('http://localhost:3001/api/v1/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Test', email, password: 'password123' })
        });
        const authData = await resAuth.json();
        console.log('Auth Data:', authData);
        const token = authData.data?.token;

        // 2. Create Diwaniya
        const username = 'testuser' + Date.now();
        const resDiwan = await fetch('http://localhost:3001/api/v1/diwaniya', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, ownerName: 'Test Owner' })
        });
        const diwanData = await resDiwan.json();
        console.log('Diwan Data:', diwanData);
        const diwanId = diwanData.data?._id;

        // 3. Claim
        const resClaim = await fetch('http://localhost:3001/api/v1/auth/claim-diwaniya', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ diwaniyaId: diwanId })
        });
        const claimData = await resClaim.json();
        console.log('Claim Result:', claimData);

    } catch (err) {
        console.error('Test Error:', err);
    }
}
test();
