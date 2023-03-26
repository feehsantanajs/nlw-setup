import { View, ScrollView, Text } from "react-native"
import { useRoute } from "@react-navigation/native"
import dayjs from "dayjs";
import { BackButton } from "../components/BackButton";
import { ProgressBar } from "../components/ProgressBar";
import { Checkbox } from "../components/Checkbox";
interface Params{
  date:string
}

export function Habit(){
  const route = useRoute()

  const {date} = route.params as Params;

  const parsedDate = dayjs(date)
  const dayOfWeek = parsedDate.format('dddd')
  const dayAndMonth = parsedDate.format('DD/MM')
  console.log(date)
  return(
    <View className="flex-1 bg-standard px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom:100}}
      >
        <BackButton />
        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>
        <Text className="text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>

        <ProgressBar  progress={50}/>

        <View className="mt-6 ">
          <Checkbox 
            title="Beber L de água"
            checked={false}
          />
          <Checkbox 
            title="Caminhar"
            checked={true}
          />
          <Checkbox 
            title="Orar"
            checked={true}
          />
          <Checkbox 
            title="Treinar"
            checked={false}
          />
        </View>
      </ScrollView>
    </View>
  )
}