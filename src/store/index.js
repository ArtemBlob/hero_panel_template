import { legacy_createStore as createStore, combineReducers, compose  } from 'redux';
import heroes from '../reducers/heroes';
import filters from '../reducers/filters';
//синтаксис усилителя стора enhancera, принимает в себя функцию createStore и возвращает новую функцию, принимая аргументы из стора.
const enhancer = (createStore) => (...args) => {
     const store = createStore(...args);
     //сохраняется старый dispatch, который содержится в внутри функции createStore
     const oldDispatch = store.dispatch;
     //изменение значения оригинального dispatch, то есть переопределяем действие (action)
     store.dispatch = (action) => {
          //если в качестве action приходит строка
          if(typeof action === 'string') {
               //то возвращается оригинальный объект dispatch с принимаемым action в кач-ве значения ключа type, который содержится в dispatch
               return oldDispatch({
                    type: action
               })
          }
          //если в action приходит не строка, а следовательно объект, то как обычно возвращается оригинальный dispatch с action в кач-ве аргумента
          return oldDispatch(action)
     }
     //возврат стора с изменененным dispatch. Теперь в качестве аргумента dispatch может выступать строка, которая подменяет type
     return store;
}

//механизм изменения стора позволяет изменить почти все, что угодно, однако зачастую используется именно в работе с dispatch
//механизм, который работает так же, но изменяет только функцию dispatch называется middleware, их множество есть в интернете.

//скомбинирование двух редьюсеров
const store = createStore(
                    combineReducers({heroes, filters}),
                    //в оригинальную функцию createStore уже встроен механизм, что если вторым аргументом приходит какая-то функция
                    //то она является усилителем store и она подменит механизмы
                    //если усилителей несколько, в redux есть специальная композиция compose, которая комбинирует функции, принимая их в кач-ве аргументов
                    compose(
                         enhancer,
                         //строка для работы devtools 
                         window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()) );

export default store;

window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()