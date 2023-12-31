import {useHttp} from '../../hooks/http.hook';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {CSSTransition, TransitionGroup} from 'react-transition-group'

import { heroDeleted, fetchHeroes, filtertedHeroesSelector } from './heroesSlice';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

import './heroesList.scss';

const HeroesList = () => {
    //теперь в переменную filtertedHeroes помещается useSelector, для использования состояния стора, который содержит функцию созданную при помощи библиотеки reselect
    //теперь если вдруг будет одно и тоже значение внутри фильтра, функция не будет вызываться просто так
    const filtertedHeroes = useSelector(filtertedHeroesSelector)
    const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        //функция сделанная благодаря ReduxThunk, которая в экшн передает функцию для выполнения запросов и вызова других экшенов в зависимости от состояния запроса
        dispatch(fetchHeroes());
        // eslint-disable-next-line
    }, []);

    // Функция onDelete берет id и по нему удаляет персонажа из store
    // если запрос на удаление прошел успешно
    // цепочка действий actions => reducers
    // useCallback нужен для того, чтобы мемоизировать функцию и каждый раз не вызывать перерендеринг дочерних компонентов
    // потому что функция как пропс передается ниже по иерархии
    const onDelete = useCallback((id) => {  
        // Удаление персонажа по его id
        request(`http://localhost:3001/heroes/${id}`, "DELETE")
            .then(data => console.log(data, "Deleted"))
            .then(dispatch(heroDeleted(id)))
            .catch(err => console.log(err))
            // eslint-disable-next-line  
    }, [request]);

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }


    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return(
                <CSSTransition
                    timeout={0}
                    classNames="hero">
                    <h5 className="text-center mt-5">Героев пока нет</h5>
                </CSSTransition>
            )
        }

        return arr.map(({id, ...props}) => {
            return (
                <CSSTransition
                    key={id}//обязательно необходимо передать в список при использовании CSSTransition
                    timeout={500}
                    classNames="hero">
                    <HeroesListItem {...props} onDelete={() => onDelete(id)}/>
                </CSSTransition>
            )
        })
    }

    const elements = renderHeroesList(filtertedHeroes);
    return (
        // так TransitionGroup формирует html компоненты
        <TransitionGroup component="ul">
            {elements}
        </TransitionGroup>
    )
}

export default HeroesList;