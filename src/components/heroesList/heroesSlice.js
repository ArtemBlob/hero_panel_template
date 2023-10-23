import { createSlice } from "@reduxjs/toolkit";
//функция объединяющая в себе принцип действия createReduce и createAction

const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle',
}

//createSlice принимает в себя объект с 4 ключами для настройки опций:
//name: имя среза(пространство имен, создаваемых действий)
//initialState: начальное состояние редьюсера
//reducers: объект с обработчиками
//extraReducers: объект который содержит редьюсеры другого среза, данный параметр может потребоваться в случае необходимости объекта, относящегося к другому срезу
const heroesSlice = createSlice({
    name: 'heroes',
    initialState,
    reducers: {
        //для того, чтобы создавать какие-то действия, необходимо написать пространство имен и тип действия, а качестве значения - функция которая меняет state.
        //функционал в целом как в createReducer, immer JS сам отслеживает иммутабельность и позволяет такой "мутабельный синтаксис"
        //однако, если написать return или вынести работу функции за фигурные скобки, immer JS передает управление иммутабельностью в руки разработчика
        heroesFetching: state => {state.heroesLoadingStatus = 'loading';},
        heroesFetched: (state, action) => {
            state.heroesLoadingStatus = 'idle';
            state.heroes = action.payload;
            },
        heroesFetchingError: state => {state.heroesLoadingStatus = 'error';},
        heroCreated: (state, action) => {
            //формирование массива героев с учетом добавления
            state.heroes.push(action.payload);
            },
        heroDeleted: (state, action) => {
            //новый список геров без того, который был удален
            state.heroes = state.heroes.filter(item => item.id !== action.payload) 
            }
    }
});
//когда функция отработает, вернет три сущности - имя среза(name), action и reducer

//деструтуризация вытаскивает полученные из функции, объект с экшенами и редьюсер
const {actions, reducer} = heroesSlice;

export default reducer;

//деструктуризация и экспорт экшнкреаторов из объекта actions, которые сгенерировались при помощи createSlice
export const {
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    heroCreated,
    heroDeleted
} = actions;