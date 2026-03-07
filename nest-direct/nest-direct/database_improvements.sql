-- Database improvements for better user association

-- 1. Add user_id to properties table for proper ownership
ALTER TABLE properties ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- 2. Update existing properties to associate with users
-- (You'll need to manually assign these based on your data)

-- 3. Create an index for better performance
CREATE INDEX idx_properties_user_id ON properties(user_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);  
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);

-- 4. Add RLS policies if not already done
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies examples:
CREATE POLICY "Users can view their own profile" ON profiles
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can view messages sent to them" ON messages
    FOR SELECT USING (auth.uid() = recipient_id);

CREATE POLICY "Users can insert messages" ON messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can view their own properties" ON properties
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites" ON user_favorites
    FOR ALL USING (auth.uid() = user_id);
