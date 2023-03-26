import {View, ActivityIndicator,Text} from 'react-native'

export function Loading(){
  return (
    <View className='flex-1 items-center justify-center'>
      <ActivityIndicator color="#5B21B6" size={50} />
    </View>
  )
}