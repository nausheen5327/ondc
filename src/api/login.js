// /pages/api/login.js
import firebaseClient from '@/lib/firebaseClient';
import { adminAuth } from '@/lib/firebaseAdmin';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end(); // Method Not Allowed
    }

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Sign in using Firebase Client SDK to get the user ID
        const userCredential = await firebaseClient.auth().signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Generate a custom token using Firebase Admin SDK for server-side authentication
        const customToken = await adminAuth.createCustomToken(user.uid);

        // Return the custom token and user information
        return res.status(200).json({ token: customToken, uid: user.uid, email: user.email });
    } catch (error) {
        console.error('Login failed:', error);
        return res.status(401).json({ error: 'Invalid email or password' });
    }
}
