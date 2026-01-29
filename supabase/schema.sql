-- Supabase Schema for URL Shortener
-- Run this in your Supabase SQL Editor

-- Table untuk URLs
CREATE TABLE IF NOT EXISTS urls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  original_url TEXT NOT NULL,
  short_slug VARCHAR(10) UNIQUE NOT NULL,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table untuk analytics (opsional)
CREATE TABLE IF NOT EXISTS url_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url_id UUID REFERENCES urls(id) ON DELETE CASCADE NOT NULL,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_urls_short_slug ON urls(short_slug);
CREATE INDEX IF NOT EXISTS idx_urls_user_id ON urls(user_id);
CREATE INDEX IF NOT EXISTS idx_url_analytics_url_id ON url_analytics(url_id);

-- RLS Policies
ALTER TABLE urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE url_analytics ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own URLs
CREATE POLICY "Users can view their own URLs" ON urls
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can create their own URLs
CREATE POLICY "Users can create their own URLs" ON urls
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own URLs
CREATE POLICY "Users can update their own URLs" ON urls
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own URLs
CREATE POLICY "Users can delete their own URLs" ON urls
  FOR DELETE USING (auth.uid() = user_id);

-- Policy: Anyone can read URL for redirect (public access to short_slug lookup)
CREATE POLICY "Anyone can read URLs by slug" ON urls
  FOR SELECT USING (true);

-- Policy: Users can view their own analytics
CREATE POLICY "Users can view their own analytics" ON url_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM urls WHERE urls.id = url_analytics.url_id AND urls.user_id = auth.uid()
    )
  );

-- Policy: Allow inserting analytics for redirect tracking (service role or anon)
CREATE POLICY "Allow analytics insert" ON url_analytics
  FOR INSERT WITH CHECK (true);

-- Function to increment clicks (more reliable than direct update)
CREATE OR REPLACE FUNCTION increment_clicks(url_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE urls SET clicks = clicks + 1, updated_at = NOW() WHERE id = url_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_urls_updated_at
  BEFORE UPDATE ON urls
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
