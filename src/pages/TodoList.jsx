import { useState, useMemo } from 'react';

import { Routes, Route, Link, useParams, useMatch } from 'react-router-dom';

import styles from '../styles.module.css';

import { useRequestGetTodo, useRequestAddTodo, requestGetTask } from '../API';

export const TodoList = () => {
	const [refreshTodoListFlag, setRefreshTodoListFlag] = useState(false); //на удаления

	const refreshTodoList = () => setRefreshTodoListFlag(!refreshTodoListFlag); //на удаления

	const [searchPhrase, setSearchPhrase] = useState('');
	const [sortByTitle, setSortByTitle] = useState('');

	const { isLoading, todoList } = useRequestGetTodo(refreshTodoListFlag);

	const { isCreating, requestAddTodo, handleIsCreating } = useRequestAddTodo(
		searchPhrase,
		refreshTodoList,
	);

	const processTodoList = useMemo(() => {
		let result = [...todoList];

		if (result.length !== 0) {
			result = result.filter((todo) =>
				todo.title.toLowerCase().includes(searchPhrase.toLowerCase()),
			);
		}

		const sortedResult = [...result];

		if (sortByTitle === 'asc') {
			return sortedResult.sort((a, b) => a.title.localeCompare(b.title));
		} else {
			return sortedResult;
		}
	}, [searchPhrase, todoList, sortByTitle]);

	const onSearchChange = ({ target }) => {
		if (target.value.length < 1) {
			handleIsCreating(true);
		} else {
			handleIsCreating(false);
		}

		setSearchPhrase(target.value);
	};

	const onSearchBlur = ({ target }) => {
		setSearchPhrase(target.value);
	};

	const handleTitle = (order) => {
		setSortByTitle(order);
	};

	const handleAdd = () => {
		requestAddTodo();
		setSearchPhrase('');
	};

	return (
		<div className={styles.app}>
			<div className={styles.containerTodoList}>
				<input
					className={styles.input}
					name="search"
					type="text"
					placeholder="Поиск и добавление новой задачи"
					value={searchPhrase}
					onChange={onSearchChange}
					onBlur={onSearchBlur}
				/>
				<button
					disabled={isCreating}
					onClick={handleAdd}
					className={styles.todoButton}
				>
					Добавить+
				</button>
			</div>
			{isLoading ? (
				<div className={styles.loader}></div>
			) : (
				processTodoList?.map(({ id, title }) => (
					<div className={styles.containerTodoList} key={id}>
						<div className={styles.task}>
							<Link className={styles.spanText} to={`Task/${id}`}>
								{title}
							</Link>
						</div>
					</div>
				))
			)}

			<button
				onClick={() =>
					handleTitle(sortByTitle === 'asc' ? 'desc' : 'asc')
				}
				className={
					sortByTitle === 'asc' ? styles.sortIdOn : styles.sortIdOff
				}
			>
				Сортировка ↓
			</button>
		</div>
	);
};
