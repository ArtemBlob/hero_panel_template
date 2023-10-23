import { configureStore } from '@reduxjs/toolkit';
import heroes from '../components/heroesList/heroesSlice';
import filters from '../components/heroesFilters/filtersSlice';


//механизм, который работает как усилитель стора(enhancer), но изменяет только функцию dispatch называется middleware
//принцип его работы
const stringMiddleware = () => (next) => (action) =>{
     //если в качестве action приходит строка
     if(typeof action === 'string') {
          //то возвращается оригинальный объект dispatch с принимаемым action в кач-ве значения ключа type, который содержится в dispatch
          return next({
               type: action
          })
     }
     //если в action приходит не строка, а следовательно объект, то как обычно возвращается оригинальный dispatch с action в кач-ве аргумента
     return next(action) 
}
//механизм изменения стора позволяет изменить почти все, что угодно, однако зачастую используется именно в работе с dispatch
//специальная функция redux toolkit позволяющая удобное создание store. 
const store = configureStore({
     //автоматическое комбинирование редьюсеров
     reducer: {heroes, filters},
     //в redux toolkit включены самые часто используемые middleware, то есть устанавливать отдельно, например, ReduxThunk не надо
     //и чтобы их включить, нужно использовать команду getDefaultMiddleware, которая возвращает массив встроенных middleware, а затем при помощи concat добавить мой кастомный мидлвейр
     middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stringMiddleware),
     //включение devtools, принимает булевое значение и чтобы devtools не работал при продакшен билд 
     //принимает специальную конструкцию, которая автоматически вычисляет, нужно ли включать devtools или нет, условие, что если режим "не продакшн", то devtools будет работать
     devTools: process.env.NODE_ENV !== 'production',
     
})

export default store;