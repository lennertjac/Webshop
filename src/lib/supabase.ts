import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://lkhxvfcaiokeqkishyvu.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxraHh2ZmNhaW9rZXFraXNoeXZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0Mzg2NDEsImV4cCI6MjA5OTAxNDY0MX0.j1lh4nFJb74hKwhRyj2D0VwmJt1NjHPzieAsKa43j8Y';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Fetch public products from ATLAS inventory
 * Uses the public API endpoint to get items listed for sale
 */
export async function fetchPublicProducts() {
  try {
    // Fetch from ATLAS public API
    const response = await fetch('https://atlas-stock-manager.vercel.app/api/public-products');
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error:', response.status, errorText);
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Fetched products:', data);
    return data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Get a single product by ID from ATLAS
 */
export async function fetchProductById(productId: string) {
  try {
    const response = await fetch(`https://atlas-stock-manager.vercel.app/api/public-products?id=${productId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }

    const data = await response.json();
    const products = data.products || [];
    return products.find((p: any) => p.id === productId) || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}
