import { useEffect, useState, useMemo } from 'react';
import styles from './styles.module.css';

import { ref, onValue } from 'firebase/database';
import { db } from './firebase'; //наша база конфиг и приложения

import {
	useRequestAddTodo,
	useRequestDeleteTodo,
	useRequestUpdateTodo,
} from './hooksFirebase';

export const TodoListFirebase = () => {
	const refreshTodoList = () => setRefreshTodoListFlag(!refreshTodoListFlag);

	//const [refreshTodoListFlag, setRefreshTodoListFlag] = useState(false);
	const [todoList, setTodoList] = useState({}); //[]
	const [searchPhrase, setSearchPhrase] = useState('');
	const [sortByTitle, setSortByTitle] = useState('');

	const [isSave, setIsSave] = useState(false);
	const [isLoading, setIsLoading] = useState(true); //false

	const [editingId, setEditingId] = useState(null);
	const [editedTitle, setEditedTitle] = useState('');

	const { isCreating, requestAddTodo, handleIsCreating } =
		useRequestAddTodo(searchPhrase);

	const { isDelete, requestDeleteTodo } = useRequestDeleteTodo();

	const { isUpdating, requestUpdateTodo } = useRequestUpdateTodo(todoList);

	const todoListInArray = (todoList) => {
		return Object.entries(todoList).map(([id, todo]) => ({
			...todo,
			id: id,
		}));
	};

	const processTodoList = useMemo(() => {
		const todoArray = todoListInArray(todoList);

		let result = todoArray;

		if (searchPhrase.trim() !== '') {
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

	useEffect(() => {
		const todoDbRef = ref(db, 'todoList'); //firebase

		return onValue(todoDbRef, (snapshot) => {
			const loadedTodoList = snapshot.val() || {}; //[]

			console.log('loadedTodoList = ', loadedTodoList);

			setTodoList(loadedTodoList);
			setIsLoading(false);
		}); //функция для получения списка объектов
		//изменения значения в базе данных вроде как подписка на событие
		//слепок данных с таблице snapshot]
		//onValue возвращает функцию для отписки и возвращая в useEffect выполняется на момент удаления компонента
	}, []);

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

	const onEditChange = ({ target }) => {
		const newTitle = target.value;
		setEditedTitle(newTitle);

		if (newTitle !== '') {
			setIsSave(false);
		}
		setEditedTitle(target.value);
	};

	const handleTitle = (order) => {
		setSortByTitle(order);
	};

	const handleEdit = (id) => {
		setEditingId(id);

		const todoArray = todoListInArray(todoList);

		const todoToEdit = todoList[id];
		console.log('todoToEdit from handleEdit ', todoToEdit);

		//const todoToEdit = todoArray.find((todo) => todo.id === id);
		if (todoToEdit) {
			setEditedTitle(todoToEdit.title);
			setIsSave(false);
		}
	};

	const handleSave = (id) => {
		//обновление здесь

		const todoArray = todoListInArray(todoList); //если не переделывать то по id

		const originalTodo = todoList[id];

		//const originalTodo = todoArray.find((todo) => todo.id === id);

		if (!originalTodo) {
			setEditingId(null);
			setEditedTitle('');
			return;
		}
		if (editedTitle.trim() === '') {
			console.log('Нельзя сохранить пустую задачу');
			setIsSave(true);
			return;
		}

		if (originalTodo.title === editedTitle) {
			console.log('Текст не изменился, выход из режима редактирования');
			setEditingId(null);
			return;
		}

		console.log('editedTitle= ', editedTitle, 'id', id);

		requestUpdateTodo(id, { title: editedTitle });
		setEditingId(null);
		setEditedTitle('');
	};

	const handleCompleted = (id, currentCompleted) => {
		//обновление здесь //переделать после обеда если надо

		setTodoList((currentList) => ({
			...currentList,
			[id]: {
				...currentList[id],
				completed: !currentList[id].completed,
			},
		}));

		requestUpdateTodo(id, { completed: !currentCompleted });
	};

	const handleDelete = (id) => {
		requestDeleteTodo(id);
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
				processTodoList?.map(({ id, title, completed }) => (
					<div className={styles.containerTodoList} key={id}>
						<div className={styles.Todo}>
							{editingId === id ? (
								<input
									className={styles.input}
									name="edit"
									type="text"
									placeholder="Внесите новую задачу"
									value={editedTitle}
									onChange={onEditChange}
									autoFocus
								/>
							) : (
								title
							)}
							<div className={styles.checkbox}>
								{editingId === id ? (
									<button
										disabled={isSave}
										onClick={() => handleSave(id)}
										className={styles.todoButton}
									>
										Сохранить
									</button>
								) : (
									<button
										disabled={isUpdating}
										onClick={() => handleEdit(id)}
										className={styles.todoButton}
									>
										Редактировать
									</button>
								)}

								<button
									disabled={isDelete}
									onClick={() => handleDelete(id)}
									className={styles.todoButton}
								>
									Удалить
								</button>
								<input
									type="checkbox"
									checked={completed}
									onChange={() =>
										handleCompleted(id, completed)
									}
								/>
							</div>
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
