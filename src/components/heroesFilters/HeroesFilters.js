import { useHttp } from "../../hooks/http.hook";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames";

import { fetchFilters } from "../../actions";
import {filtersChanged} from './filtersSlice'
import Spinner from "../spinner/Spinner";

const HeroesFilters = () => {
    const {filters, filtersLoadingStatus, activeFilter} = useSelector(state => state.filters);
    const dispatch = useDispatch();
    const {request} = useHttp();

    // запрос на сервер для получения фильтров и смены состояния
    useEffect(() => {
         //функция сделанная благодаря ReduxThunk, которая в экшн передает функцию для выполнения запросов и вызова других экшенов в зависимости от состояния запроса
        dispatch(fetchFilters(request));
         // eslint-disable-next-line
    }, []);

    if (filtersLoadingStatus === 'loading') {
        return <Spinner/>
    } else if (filtersLoadingStatus === 'error') {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderFilters = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Фильтры не найдены</h5>
        }
        return arr.map(({name, label, className}) => {
            // библиотека classnames и формирует классы динамически
            const btnClass = classNames('btn', className, { //className идет с сервера
                'active': name === activeFilter
            });
            return <button
                        key={name}
                        id={name}
                        className={btnClass}
                        onClick={() => dispatch(filtersChanged(name))} //диспатчим с кликом активный фильтр
                        >{label}</button>
        })
    }

    const elements = renderFilters(filters)

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {elements}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;