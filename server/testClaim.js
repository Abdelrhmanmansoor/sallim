import fetch from 'node-fetch';

async function test() {
    const ts = Date.now();
    // 1. Register a user
    const regRes = await fetch('http://localhost:3001/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'TestUser', email: `test${ts}@example.com`, password: 'password123' })
    });
    const regData = await regRes.json();
    console.log('Register success:', regData.success);
    if (!regData.success) {
        console.log(regData);
        return;
    }
    const token = regData.data.token;

    // 2. Create Diwaniya
    const createRes = await fetch('http://localhost:3001/api/v1/diwaniya', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: `testdiwan${ts}`, ownerName: 'Test Owner' })
    });
    const createData = await createRes.json();
    console.log('Create Diwaniya success:', createData.success);
    if (!createData.success) {
        console.log(createData);
        return;
    }
    const diwaniyaId = createData.data._id;

    // 3. Claim Diwaniya
    const claimRes = await fetch('http://localhost:3001/api/v1/auth/claim-diwaniya', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ diwaniyaId })
    });
    const claimText = await claimRes.text();
    console.log('Claim raw text:', claimText.substring(0, 200));
    let claimData;
    try {
        claimData = JSON.parse(claimText);
    } catch (e) {
        console.log('Claim failed to parse. Status:', claimRes.status);
        return;
    }
    console.log('Claim Diwaniya success:', claimData.success);
    if (!claimData.success) {
        console.log(claimData);
        return;
    }

    // 4. Get Profile
    const profRes = await fetch('http://localhost:3001/api/v1/auth/profile', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const profData = await profRes.json();
    console.log('Profile success:', profData.success);
    console.log('Profile Diwaniyas length:', profData.data.diwaniyas.length);
}
test().catch(console.error);
