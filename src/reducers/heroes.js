import { createReducer } from "@reduxjs/toolkit";

import { 
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    heroCreated,
    heroDeleted,
} from "../actions";

const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle',
}

//createReducer при использовании, toolkit автоматически активирует встроенную бибилиотеку immer, которая облегчает процесс взаимодействия с иммутабельностью
//immer позволяет писать функционал по прямому изменению state, а бибилиотека сделает все сама
//команда createReducer требует, чтобы action были сделаны при помощи команды createAction
// const heroes = createReducer(initialState, builder => {
//     builder
//     //вторым аргументом является функция, принимающая два аргумента - state и action
//         .addCase(heroesFetching, state => {
//             //использование reduxtoolkit позволяет писать код такого формата, как бы подразумевающий в себе прямое измненение стейт
//             //встроенная библиотека immer JS сама отвечает за иммутабельность, не следует писать return или писать стрелочкую функцию без фигурных скобок
//             //поскольку в таком случае библиотека immer JS передаст управление иммутабельностью в руки разработчика, предполагая, что он хочет вернуть готовую сущность
//             state.heroesLoadingStatus = 'loading';
//         })
//         .addCase(heroesFetched, (state, action) => {
//             state.heroesLoadingStatus = 'idle';
//             state.heroes = action.payload;
//         })
//         .addCase(heroesFetchingError, state => {
//             state.heroesLoadingStatus = 'error';
//         })
//         .addCase(heroCreated, (state, action) => {
//             //формирование массива героев с учетом добавления
//             state.heroes.push(action.payload);
//         })
//         .addCase(heroDeleted, (state, action) => {
//             //новый список геров без того, который был удален
//             state.heroes = state.heroes.filter(item => item.id !== action.payload);
//         })
//         //метод, возвращающий дефолтный стейт, если ничего не изменилось и не был найден экшн
//         .addDefaultCase(() => {});
// }) 

// Второй вариант использования createReducer, который короче, но не работает в typeScript, вторым аргументом приходит объект
const heroes = createReducer(initialState, {
    //используется ES6 стандарт по формированию динамических ключей объекта
    [heroesFetching]: state => {state.heroesLoadingStatus = 'loading';},
    [heroesFetched]: (state, action) => {
                    state.heroesLoadingStatus = 'idle';
                    state.heroes = action.payload;
                },
    [heroesFetchingError]: state => {state.heroesLoadingStatus = 'error';},
    [heroCreated]: (state, action) => {
                    //формирование массива героев с учетом добавления
                    state.heroes.push(action.payload);
                },
    [heroDeleted]: (state, action) => {
                //новый список геров без того, который был удален
                state.heroes = state.heroes.filter(item => item.id !== action.payload) 
                }
    },
    //второй аргумент createReducer, при таком способе использования - массив функции сравнения
    [],
    //третий аргумент дефолтный state
    state => state
)

// const heroes = (state = initialState, action) => {
//     switch (action.type) {
//         case 'HEROES_FETCHING':
//             return {
//                 ...state,
//                 heroesLoadingStatus: 'loading'
//             }
//         case 'HEROES_FETCHED':
//             return {
//                 ...state,
//                 heroes: action.payload,
//                 heroesLoadingStatus: 'idle',
//             }
//         case 'HEROES_FETCHING_ERROR':
//             return {
//                 ...state,
//                 heroesLoadingStatus: 'error'
//             }
//         case 'HERO_CREATED':
//             return {
//                 ...state,
//                 // формирование массива героев с учетом добавления
//                 heroes: [...state.heroes, action.payload]
//             }
//         case 'HERO_DELETED':
//             return {
//                 ...state,
//                 //новый список геров без того, который был удален
//                 heroes: state.heroes.filter(item => item.id !== action.payload) 
//             }
//         default: return state
//     }
// }

export default heroes;