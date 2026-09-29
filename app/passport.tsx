import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';

export default function PassportTab() {
  const [userData, setUserData] = useState<any>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
    units: 'metric',
    notifications: true,
    darkMode: false
  });

  const saveUserData = () => {
    const dataToSave = {
      id: userData?.id || 'default-user',
      name: editData.name,
      email: editData.email,
      profile: {
        age: parseInt(editData.age) || 0,
        weight: parseFloat(editData.weight) || 0,
        height: parseFloat(editData.height) || 0,
        gender: editData.gender
      },
      preferences: {
        units: editData.units,
        notifications: editData.notifications,
        darkMode: editData.darkMode
      },
      createdAt: userData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setUserData(dataToSave);
    setShowEditForm(false);
  };

  return (
    <View className="flex-1 bg-white">
      <View className="pt-12 pb-4 px-4 bg-purple-50">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-gray-900">Profile</Text>
            <Text className="text-gray-600 mt-1">Your personal information</Text>
          </View>
          <TouchableOpacity 
            onPress={() => setShowEditForm(!showEditForm)}
            className="px-4 py-2 bg-purple-500 rounded-lg"
          >
            <Text className="text-white font-medium text-sm">{showEditForm ? 'Cancel' : 'Edit'}</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView className="flex-1">
        <View className="p-4">
          {showEditForm ? (
            <View className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Text className="font-medium text-gray-900 mb-3">Edit Profile</Text>
              
              <View className="mb-3">
                <Text className="text-sm text-gray-600 mb-1">Name</Text>
                <TextInput
                  className="bg-white border border-gray-300 rounded-lg p-2 text-gray-900"
                  value={editData.name}
                  onChangeText={(text) => setEditData({...editData, name: text})}
                  placeholder="Your name"
                />
              </View>

              <View className="mb-3">
                <Text className="text-sm text-gray-600 mb-1">Email</Text>
                <TextInput
                  className="bg-white border border-gray-300 rounded-lg p-2 text-gray-900"
                  value={editData.email}
                  onChangeText={(text) => setEditData({...editData, email: text})}
                  placeholder="your@email.com"
                  keyboardType="email-address"
                />
              </View>

              <View className="flex-row gap-2 mb-3">
                <View className="flex-1">
                  <Text className="text-sm text-gray-600 mb-1">Age</Text>
                  <TextInput
                    className="bg-white border border-gray-300 rounded-lg p-2 text-gray-900"
                    value={editData.age}
                    onChangeText={(text) => setEditData({...editData, age: text})}
                    placeholder="30"
                    keyboardType="numeric"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-sm text-gray-600 mb-1">Gender</Text>
                  <TextInput
                    className="bg-white border border-gray-300 rounded-lg p-2 text-gray-900"
                    value={editData.gender}
                    onChangeText={(text) => setEditData({...editData, gender: text})}
                    placeholder="male/female/other"
                  />
                </View>
              </View>

              <View className="flex-row gap-2 mb-3">
                <View className="flex-1">
                  <Text className="text-sm text-gray-600 mb-1">Weight ({editData.units === 'metric' ? 'kg' : 'lbs'})</Text>
                  <TextInput
                    className="bg-white border border-gray-300 rounded-lg p-2 text-gray-900"
                    value={editData.weight}
                    onChangeText={(text) => setEditData({...editData, weight: text})}
                    placeholder="75"
                    keyboardType="numeric"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-sm text-gray-600 mb-1">Height ({editData.units === 'metric' ? 'cm' : 'in'})</Text>
                  <TextInput
                    className="bg-white border border-gray-300 rounded-lg p-2 text-gray-900"
                    value={editData.height}
                    onChangeText={(text) => setEditData({...editData, height: text})}
                    placeholder="180"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View className="mb-3">
                <Text className="text-sm text-gray-600 mb-1">Units</Text>
                <View className="flex-row gap-2">
                  <TouchableOpacity 
                    onPress={() => setEditData({...editData, units: 'metric'})}
                    className={`flex-1 px-4 py-2 rounded-lg ${editData.units === 'metric' ? 'bg-purple-500' : 'bg-gray-200'}`}
                  >
                    <Text className={`text-center font-medium text-sm ${editData.units === 'metric' ? 'text-white' : 'text-gray-700'}`}>Metric</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => setEditData({...editData, units: 'imperial'})}
                    className={`flex-1 px-4 py-2 rounded-lg ${editData.units === 'imperial' ? 'bg-purple-500' : 'bg-gray-200'}`}
                  >
                    <Text className={`text-center font-medium text-sm ${editData.units === 'imperial' ? 'text-white' : 'text-gray-700'}`}>Imperial</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity 
                onPress={saveUserData}
                className="px-4 py-2 bg-purple-500 rounded-lg"
              >
                <Text className="text-white font-medium text-sm text-center">Save Changes</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Profile Information */}
              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-900 mb-3">Profile Information</Text>
                <View className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <Text className="font-medium text-gray-900 text-lg">{userData?.name || 'No name set'}</Text>
                  <Text className="text-gray-600 text-sm">{userData?.email || 'No email set'}</Text>
                  
                  {userData?.profile && (
                    <View className="mt-3 pt-3 border-t border-gray-200">
                      <Text className="text-sm text-gray-600">
                        Age: {userData.profile.age || 'Not set'} • Gender: {userData.profile.gender || 'Not set'}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        Weight: {userData.profile.weight || 'Not set'} {userData.preferences?.units === 'metric' ? 'kg' : 'lbs'} • 
                        Height: {userData.profile.height || 'Not set'} {userData.preferences?.units === 'metric' ? 'cm' : 'in'}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Preferences */}
              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-900 mb-3">Preferences</Text>
                <View className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <Text className="text-sm text-gray-600">
                    Units: {userData?.preferences?.units === 'metric' ? 'Metric' : 'Imperial'}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Notifications: {userData?.preferences?.notifications ? 'Enabled' : 'Disabled'}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Dark Mode: {userData?.preferences?.darkMode ? 'Enabled' : 'Disabled'}
                  </Text>
                </View>
              </View>

              {/* Account Info */}
              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-900 mb-3">Account</Text>
                <View className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <Text className="text-sm text-gray-600">
                    Created: {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Not available'}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Last Updated: {userData?.updatedAt ? new Date(userData.updatedAt).toLocaleDateString() : 'Not available'}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
