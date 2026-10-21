import { supabase } from './supabase';

export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection by checking if we can query the database
    const { data, error } = await supabase
      .from('exercises')
      .select('id, name')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return { success: false, error };
    }
    
    console.log('Supabase connection successful!', data);
    return { success: true, data };
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return { success: false, error };
  }
}

export async function testSupabaseAuth() {
  try {
    console.log('Testing Supabase auth...');
    
    // Test auth by getting current session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Supabase auth test failed:', error);
      return { success: false, error };
    }
    
    console.log('Supabase auth test successful!', session);
    return { success: true, session };
  } catch (error) {
    console.error('Supabase auth test error:', error);
    return { success: false, error };
  }
}