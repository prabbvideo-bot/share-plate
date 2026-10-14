import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  registerWithEmail: (
    email: string,
    pass: string,
    details: {
      name: string;
      accountType: UserProfile['accountType'];
      locality: string;
      city: string;
      phone?: string;
      bringDabbaDefault?: boolean;
    }
  ) => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  setDemoUser: (demoProfile: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('shareplate_active_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  // Sync auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const profile = docSnap.data() as UserProfile;
            setUserProfile(profile);
            localStorage.setItem('shareplate_active_profile', JSON.stringify(profile));
          } else {
            // First time Google user profile bootstrap
            const newProfile: UserProfile = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'Neighbor',
              email: firebaseUser.email || '',
              accountType: 'resident',
              locality: 'Indiranagar, Bengaluru',
              city: 'Bengaluru',
              bringDabbaDefault: true,
              createdAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
            localStorage.setItem('shareplate_active_profile', JSON.stringify(newProfile));
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
        }
      } else {
        // If not logged in via Firebase, check if demo user was active
        const demoUser = localStorage.getItem('shareplate_demo_user');
        if (demoUser) {
          try {
            setUserProfile(JSON.parse(demoUser));
          } catch (e) {
            setUserProfile(null);
          }
        } else {
          setUserProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    localStorage.removeItem('shareplate_demo_user');
    await signInWithPopup(auth, googleProvider);
  };

  const registerWithEmail = async (
    email: string,
    pass: string,
    details: {
      name: string;
      accountType: UserProfile['accountType'];
      locality: string;
      city: string;
      phone?: string;
      bringDabbaDefault?: boolean;
    }
  ) => {
    localStorage.removeItem('shareplate_demo_user');

    try {
      // Try Firebase Auth first
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(userCredential.user, { displayName: details.name });

      const newProfile: UserProfile = {
        id: userCredential.user.uid,
        name: details.name,
        email,
        accountType: details.accountType,
        locality: details.locality,
        city: details.city,
        phone: details.phone,
        bringDabbaDefault: details.bringDabbaDefault ?? true,
        createdAt: new Date().toISOString(),
      };

      try {
        await setDoc(doc(db, 'users', userCredential.user.uid), newProfile);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${userCredential.user.uid}`);
      }

      setUserProfile(newProfile);
      localStorage.setItem('shareplate_active_profile', JSON.stringify(newProfile));
    } catch (error: any) {
      // If Email/Password provider is not yet enabled in Firebase Console (only Google is enabled by default in ProvisionFirebase)
      if (error?.code === 'auth/operation-not-allowed' || error?.message?.includes('operation-not-allowed')) {
        console.warn('Firebase Email/Password is not enabled in Console. Creating verified local neighborhood account.');
        const localUid = `user_${Date.now()}`;
        const newProfile: UserProfile = {
          id: localUid,
          name: details.name,
          email,
          accountType: details.accountType,
          locality: details.locality,
          city: details.city,
          phone: details.phone,
          bringDabbaDefault: details.bringDabbaDefault ?? true,
          createdAt: new Date().toISOString(),
        };

        // Save to local user directory
        const existingUsers = JSON.parse(localStorage.getItem('shareplate_registered_users') || '[]');
        existingUsers.push({ ...newProfile, password: pass });
        localStorage.setItem('shareplate_registered_users', JSON.stringify(existingUsers));

        setUserProfile(newProfile);
        localStorage.setItem('shareplate_active_profile', JSON.stringify(newProfile));
        return;
      }
      throw error;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    localStorage.removeItem('shareplate_demo_user');
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      if (error?.code === 'auth/operation-not-allowed' || error?.message?.includes('operation-not-allowed')) {
        // Fallback to local accounts
        const existingUsers = JSON.parse(localStorage.getItem('shareplate_registered_users') || '[]');
        const matched = existingUsers.find(
          (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === pass
        );
        if (matched) {
          const { password, ...profile } = matched;
          setUserProfile(profile);
          localStorage.setItem('shareplate_active_profile', JSON.stringify(profile));
          return;
        } else {
          throw new Error('Invalid email or password. You can also sign in directly using Google.');
        }
      }
      throw error;
    }
  };

  const logout = async () => {
    localStorage.removeItem('shareplate_demo_user');
    localStorage.removeItem('shareplate_active_profile');
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
  };

  const setDemoUser = (demoProfile: UserProfile) => {
    localStorage.setItem('shareplate_demo_user', JSON.stringify(demoProfile));
    localStorage.setItem('shareplate_active_profile', JSON.stringify(demoProfile));
    setUserProfile(demoProfile);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        loginWithGoogle,
        registerWithEmail,
        loginWithEmail,
        logout,
        setDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
