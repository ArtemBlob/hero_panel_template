import { legacy_createStore as createStore, combineReducers, compose, applyMiddleware  } from 'redux';
//готовый мидлвейр, который позволяет передавать в диспетч функции
import ReduxThunk from 'redux-thunk'
import heroes from '../reducers/heroes';
import filters from '../reducers/filters';


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

//скомбинирование двух редьюсеров
const store = createStore(
                    combineReducers({heroes, filters}),
                    //в оригинальную функцию createStore уже встроен механизм, что если вторым аргументом приходит какая-то функция
                    //то она является усилителем store и она подменит механизмы
                    //если усилителей несколько, в redux есть специальная композиция compose, которая комбинирует функции, принимая их в кач-ве аргументов
                    compose(
                         //функция по загрузке middleware, может принимать в себя несколько аргументов
                         applyMiddleware(stringMiddleware, ReduxThunk),
                         //строка для работы devtools 
                         window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()) );

export default store;

window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()