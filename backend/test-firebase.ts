import * as admin from 'firebase-admin';
import serviceAccount from './credentials/serviceAccountKey.json';

admin.initializeApp({ credential: admin.credential.cert(serviceAccount as admin.ServiceAccount) });

console.log('sendMulticast:', typeof (admin.messaging() as any).sendMulticast); 