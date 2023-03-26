import { ScrollView, Text,TextInput,TouchableOpacity, View } from "react-native";
import {Feather} from '@expo/vector-icons'
import colors from 'tailwindcss/colors'
import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";
import { useState } from "react";

export function New(){
  const availableWeekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sabado']
  const [weekDays, setWeekDays]= useState<number[]>([])

  function handleToogleWeekDay(weekDayIndex: number){
    if(weekDays.includes(weekDayIndex)){
      setWeekDays(prevState => prevState.filter(weekDay => weekDay != weekDayIndex))
    }else{
      setWeekDays(prevState => [...prevState,weekDayIndex])
    }
  }
  return(
    <View className="flex-1 bg-standard px-8 pt-16">
      <ScrollView showsVerticalScrollIndicator={false}>
          <BackButton />
          <Text className="mt-6 text-white font-bold text-3xl">
            Criar hábito
          </Text>
          <Text className="mt-6 text-white font-semibold text-base">
            Qual seu compromentimento?
          </Text>

          <TextInput 
            className="h-12 pl-4 rounded-lg mt-3 text-white bg-zinc-900 tex-white border-2 border-zinc-800 focus:border-green-500 "
            placeholder="Exercícios, Dormir bem, etc..."
            placeholderTextColor={colors.zinc[400]}
          />
          <Text className="mt-6 mb-3 text-white font-semibold text-base">
            Qual recorrência?
          </Text>
          {
            availableWeekDays.map((title, index) =>(
              <Checkbox 
                key={title} 
                title={title} 
                onPress={() => handleToogleWeekDay(index)} 
                checked={weekDays.includes(index)}
              />
            ))
          }

          <TouchableOpacity
            activeOpacity={0.7}
            className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
          >
            <Feather
            name="check"
            size={20}
            color={colors.white}
            />
            <Text className="font-semibold text-base text-white ml-2">
              Confirmar
            </Text>
          </TouchableOpacity>
          
      </ScrollView>
    </View>
  )
}