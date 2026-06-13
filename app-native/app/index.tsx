import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { getSupabaseClient } from '../lib/supabase';

export default function Index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    console.log("BOOT: index screen mounted (Minimal Login UI + Supabase)");
    const checkSession = async () => {
      const { data: { session } } = await getSupabaseClient().auth.getSession();
      if (session && session.user && session.user.id) {
        router.replace('/(dashboard)');
      }
    };
    checkSession();
  }, []);

  const handleAuth = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      // Lazy initialize the Supabase client
      const supabase = getSupabaseClient();
      
      let error, data;

      if (isSignUp) {
        const res = await supabase.auth.signUp({
          email: email,
          password: password,
        });
        error = res.error;
        data = res.data;
      } else {
        const res = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });
        error = res.error;
        data = res.data;
      }

      if (error) {
        // Clean error messages for users
        if (error.message.includes('Invalid login credentials')) {
          setErrorMessage('Invalid email or password.');
        } else if (error.message.includes('already registered')) {
          setErrorMessage('This email is already registered.');
        } else {
          setErrorMessage(`Error: ${error.message}`);
        }
      } else if (data.session) {
        setErrorMessage(isSignUp ? "Signup successful! Welcome." : "Login successful! Welcome.");
        console.log(isSignUp ? "Supabase signup successful" : "Supabase login successful");
        // Route to the isolated top-level dashboard
        router.replace('/(dashboard)');
      } else if (data.user && isSignUp) {
        setErrorMessage("Signup successful! Please check your email to verify your account.");
      }
    } catch (err: any) {
      setErrorMessage(`Network error: ${err?.message || "An unexpected error occurred"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{isSignUp ? "Create account" : "Welcome back"}</Text>
        <Text style={styles.subtitle}>{isSignUp ? "Sign up to get started." : "Log in to your Macro app."}</Text>
      </View>

      <View style={styles.formContainer}>
        {errorMessage && (
          <View style={styles.errorContainer}>
            <Text style={[
              styles.errorText, 
              errorMessage.includes("successful") && { color: '#34d399' }
            ]}>
              {errorMessage}
            </Text>
          </View>
        )}

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="email@address.com"
          placeholderTextColor="#52525b"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={[styles.label, { marginTop: 16 }]}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#52525b"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={handleAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.primaryButtonText}>{isSignUp ? "Sign up" : "Log in"}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          disabled={loading}
          onPress={() => {
            setIsSignUp(!isSignUp);
            setErrorMessage(null);
          }}
        >
          <Text style={styles.secondaryButtonText}>
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <Text style={{ color: '#fff' }}>{isSignUp ? "Log in" : "Sign up"}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#09090b',
  },
  headerContainer: {
    marginBottom: 48,
  },
  title: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#a1a1aa',
    fontSize: 16,
  },
  formContainer: {
    width: '100%',
  },
  errorContainer: {
    backgroundColor: '#18181b',
    borderColor: '#3f3f46',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  label: {
    color: '#a1a1aa',
    fontWeight: '500',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    width: '100%',
    backgroundColor: '#18181b',
    borderColor: '#27272a',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: '#fff',
    fontWeight: '500',
  },
  primaryButton: {
    width: '100%',
    paddingVertical: 16,
    marginTop: 32,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: 16,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#a1a1aa',
    fontWeight: '500',
  },
});
