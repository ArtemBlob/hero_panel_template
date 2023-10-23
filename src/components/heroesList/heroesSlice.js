//createSlice функция объединяющая в себе принцип действия createReduce и createAction
//createAsyncThunk встроенный в тулкит мидлвейр ReduxThunk 
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle',
}
//команда возвращает 3 экшн креэйтора, которые можно использовать для работы с асинхронными операциями pending, fulfilled, rejected
export const fetchHeroes = createAsyncThunk(
    //тип действия функции в формате 'имя среза/тип действия'
    'heroes/fetchHeroes',
    //функция, которая должна вернуть промис (асинхронный код), можно так же написать синхронный код, но в таком случае нужно писать условие if(что-то) {throw error}
    //функция принимает в себя два аргумента: 1. это то, что приходит при диспатче действия(в данном случае он не нужен). 2. thunkApi, который можно использовать, есть множество параметров
    () => {
        const {request} = useHttp();
        //функция должна возвращать промис, но так как все асинхронные действия уже заложены в хук useHttp, то в данном случае, функция просто возвращает результат request
        return request("http://localhost:3001/heroes");
    }
);

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
        heroCreated: (state, action) => {
            //формирование массива героев с учетом добавления
            state.heroes.push(action.payload);
        },
        heroDeleted: (state, action) => {
            //новый список геров без того, который был удален
            state.heroes = state.heroes.filter(item => item.id !== action.payload) 
        }
    },
    //экшн креэйторы созданыые при помощи createAsyncThunk помещяются в extraReducers, extraReducers принимает аргумент builder
    extraReducers: (builder) => {
        builder
        //первым аргументом в addСase приходит экшн криэйтор, в данный момент тот, который получен в fetchHeroes, именно pending, означающий загрузку, до получения результата
        //вторым аргументом является функция, принимающая два аргумента - state и action
            .addCase(fetchHeroes.pending, state => {state.heroesLoadingStatus = 'loading';})
            .addCase(fetchHeroes.fulfilled, (state, action) => {
                state.heroesLoadingStatus = 'idle';
                state.heroes = action.payload;
            })
            .addCase(fetchHeroes.rejected, state => {state.heroesLoadingStatus = 'error';})
            //метод, возвращающий дефолтный стейт, если ничего не изменилось и не был найден экшн
            .addDefaultCase(()=>{})
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