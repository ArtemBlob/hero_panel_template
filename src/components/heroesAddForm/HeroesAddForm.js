import { useHttp } from "../../hooks/http.hook";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import store from "../../store"

import { selectAll } from "../heroesFilters/filtersSlice";
import { heroCreated } from "../heroesList/heroesSlice";

const HeroesAddForm = () => {
    //состояния для контроля формы
    const [heroName, setHeroName] = useState('');
    const [heroDescr, setHeroDescr] = useState();
    const [heroElem, setHeroElem] = useState();

    const {filtersLoadingStatus} = useSelector(state => state.filters);
    const filters = selectAll(store.getState());
    const dispatch = useDispatch();
    const {request} = useHttp();

    const onSubmitHandler = (e) => {
        e.preventDefault();

        const newHero = {
            id: uuidv4(), //айди генерируется через библиотеку
            name: heroName,
            description: heroDescr,
            element: heroElem
        }

        // Отправляем данные на сервер в формате JSON
        // если запрос успешен - персонаж отправлятся в store
        request("http://localhost:3001/heroes", "POST", JSON.stringify(newHero))
            .then(res => console.log(res, "Отправка успешна"))
            .then(dispatch(heroCreated(newHero)))
            .catch(err => console.log(err))
        
        setHeroName('');
        setHeroDescr('');
        setHeroElem('');
    }
    const renderFilters = (filters, filtersLoadingStatus) => {
        if (filtersLoadingStatus === 'loading') {
            return <option>Загрузка элементов...</option>
        } else if (filtersLoadingStatus === 'error') {
            return <option>Произошла ошибка загрузки!</option>
        }
        //рендерить фильтры, если они имеются на сервере
        if (filters && filters.length > 0) {
            return filters.map(({name, label}) => {
                // один из фильтров тут не нужен, поэтому если его name === all, пропускаем
                // eslint-disable-next-line  
                if (name === 'all') return;

                return <option key={name} value={name}>{label}</option>
            })
        }
    }
    return (
        <form className="border p-4 shadow-lg rounded" onSubmit={onSubmitHandler}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"
                    value={heroName}
                    onChange={(e) => setHeroName(e.target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}
                    value={heroDescr}
                    onChange={(e) => setHeroDescr(e.target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    required
                    className="form-select" 
                    id="element" 
                    name="element"
                    value={heroElem}
                    onChange={(e) => setHeroElem(e.target.value)}>
                    <option >Я владею элементом...</option>
                    {renderFilters(filters, filtersLoadingStatus)}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;