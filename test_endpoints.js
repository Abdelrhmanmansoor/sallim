// No import needed for native fetch in Node 18+


async function testLocalEndpoints() {
    const baseUrl = 'http://localhost:3001/api/v1';

    console.log('Testing local server endpoints...');

    // Test Analytics
    try {
        const res = await fetch(`${baseUrl}/stats/increment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ field: 'uniqueVisitors' })
        });
        console.log(`POST /stats/increment: ${res.status} ${res.statusText}`);
        const data = await res.json();
        console.log('Response:', data);
    } catch (err) {
        console.error('Failed to test /stats/increment:', err.message);
    }

    // Test Game Creation
    try {
        const res = await fetch(`${baseUrl}/games`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ownerName: 'Test Owner',
                questions: [{ questionText: 'Test?', answers: ['Yes', 'No'], correctAnswerIndex: 0, rewardAmount: 10 }]
            })
        });
        console.log(`POST /games: ${res.status} ${res.statusText}`);
        const data = await res.json();
        console.log('Response:', data);
    } catch (err) {
        console.error('Failed to test /games:', err.message);
    }
}

testLocalEndpoints();
