//createSlice функция объединяющая в себе принцип действия createReduce и createAction
//createAsyncThunk встроенный в тулкит мидлвейр ReduxThunk 
//createEntityAdapter предоставляет стандартизированный способ хранения данных путем преобразования коллекции в форму { ids: [], entities: {} }.
//createSelector встроенная в redux toolKit библиотека reselect, которая кэширует результаты селекторов, чтобы избежать повторного рендеринга, если результаты не изменились
import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

//коме предопределения формы состояния, эта функция генерирует набор редукторов и селекторов, которые знают, как работать с такими данными.
const heroesAdapter = createEntityAdapter();

const initialState = heroesAdapter.getInitialState({
    heroesLoadingStatus: 'idle'
});


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
            //добавление нового героя в стейт, команда полученная благодаря createEntityAdapter
            heroesAdapter.addOne(state, action.payload);
        },
        heroDeleted: (state, action) => {
            //удаление героя из стейта, команда полученная благодаря createEntityAdapter. Вторым аргументом, в removeOne является уникальный id
            heroesAdapter.removeOne(state, action.payload);
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
                //setAll, метод созданный адаптером, принимает в себя массив новых сущностей или объект с определенным форматом и заменяет все, теми значениями, которые передаются.
                //Первый аргумент state, то куда будут помещаться данные, в данном случае глобальный state. Второй аргумент, это то, что будет приходить в стейт
                heroesAdapter.setAll(state, action.payload);
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

//Этот код экспортирует селектор selectAll, который использует getSelectors из библиотеки toolkit
//Селектор selectAll используется для получения всех сущностей героев в форме массива из состояния Redux. 
//Он принимает текущее состояние Redux в качестве аргумента и возвращает все сущности героев, хранящиеся в состоянии.
//Таким образом, этот код предоставляет селектор для получения всех героев из состояния, в форме массива, а не объекта entities, каким он является внутри createEntityAdapter
const {selectAll} = heroesAdapter.getSelectors(state => state.heroes);

export const filtertedHeroesSelector = createSelector(
    //библиотека reselect кэширует результат селектора
    //cначала задаются состояния стора, которые необходимо передать как аргументы в последующую функцию
    (state) => state.filters.activeFilter,
    //передача функции, созданной при помощи createEntityAdapter
    selectAll,
    //потом в ход идет функция, которая использует эти состояния
    //внутри аргумента filters находится state.filters.activeFilter
    //внутри аргумента heroes находится selectAll, все герои, получаемые из стейта
    (filters, heroes) => {
        //если активный фильтер равен all, то просто рендерится список без фильтрации
        if(filters === 'all') {
            return heroes
        } else {
            // формирование списка героев с учетом активного фильтра
            return heroes.filter(item => item.element === filters)
        }
    }
);

//деструктуризация и экспорт экшнкреаторов из объекта actions, которые сгенерировались при помощи createSlice
export const {
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    heroCreated,
    heroDeleted
} = actions;