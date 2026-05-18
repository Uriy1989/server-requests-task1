import styles from '../styles.module.css';

import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ButtonBack, Completed } from '../button/index.js';
import {
	useRequestDeleteTodo,
	useRequestUpdateTodo,
	requestGetTask,
} from '../API/index.js';
import { NotFound } from './NotFound.jsx';

export const Task = () => {
	const [refreshTodoListFlag, setRefreshTodoListFlag] = useState(false);
	const refreshTodoList = () => setRefreshTodoListFlag(!refreshTodoListFlag);

	const [task, setTask] = useState(null);

	const [isSave, setIsSave] = useState(true);
	const [editedTitle, setEditedTitle] = useState(task?.title || '');
	const [editingId, setEditingId] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();

	const { id } = useParams();

	useEffect(() => {
		setIsLoading(true);
		requestGetTask(id)
			.then((loadedTask) => {
				if (!loadedTask || loadedTask.error) {
					navigate('/404', { replace: true });
				} else {
					setTask(loadedTask);
				}
			})
			.catch((error) => {
				console.error('Ошибка загрузки задачи:', error);
				navigate('/404', { replace: true });
			})
			.finally(() => setIsLoading(false));
	}, [id, navigate]);

	const { isUpdating, requestUpdateTodo } =
		useRequestUpdateTodo(refreshTodoList);

	const { isDelete, requestDeleteTodo } =
		useRequestDeleteTodo(refreshTodoList);

	const onEditChange = ({ target }) => {
		const newTitle = target.value;

		if (newTitle.trim() === '') {
			setIsSave(true);
		} else {
			setIsSave(false);
		}
		setEditedTitle(newTitle);
	};

	const handleEdit = (id) => {
		setEditingId(id);
		setEditedTitle(task.title || '');
		setIsSave(false);
	};

	const handleSave = async (id) => {
		if (task.title === editedTitle) {
			console.log('Текст не изменился, выход из режима редактирования');
			setEditingId(null);
			return;
		}

		try {
			await requestUpdateTodo(id, { title: editedTitle });
			setTask((oldTask) => ({
				...oldTask,
				title: editedTitle,
			}));
		} catch (error) {
			console.error('Ошибка при сохранении:', error);
		} finally {
			setEditingId(null);
		}
	};

	const handleCompleted = async (id, completed) => {
		try {
			requestUpdateTodo(id, { completed: !completed });
			setTask((oldTask) => ({ ...oldTask, completed: !completed }));
		} catch (error) {
			console.error('Ошибка при сохранении:', error);
		} finally {
			setEditingId(null);
		}
	};

	const handleDelete = (id) => {
		requestDeleteTodo(id);
		navigate(-1);
	};

	return (
		<>
			<div className={styles.containerTodoList} key={id}>
				<div className={styles.Todo}>
					{editingId === id ? (
						<textarea
							className={styles.editText}
							name="edit"
							placeholder="Внесите новую задачу"
							value={editedTitle}
							onChange={onEditChange}
							autoFocus
						/>
					) : task ? (
						task.title
					) : (
						<div className={styles.loader}></div>
					)}
				</div>

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

					{
						<input
							type="checkbox"
							checked={
								task ? (
									task.completed
								) : (
									<div className={styles.loader}></div>
								)
							}
							onChange={() => handleCompleted(id, task.completed)}
						/>
					}
				</div>
			</div>
			<ButtonBack />
		</>
	);
};
