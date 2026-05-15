import styles from '../styles.module.css';

import { useRequestUpdateTodo } from '../API/index.js';

export const Completed = ({ id, task, requestUpdateTodo, handleSetTask }) => {
	if (!task) {
		return <div className={styles.loader}></div>;
	}

	const handleCompleted = async (id, task) => {
		try {
			requestUpdateTodo(id, { completed: !task.completed });
			handleSetTask((oldTask) => ({
				...oldTask,
				completed: !task.completed,
			}));
		} catch (error) {
			console.error('Ошибка при сохранении:', error);
		} finally {
		}
	};

	return (
		<input
			type="checkbox"
			checked={task.completed}
			onChange={() => handleCompleted(id, task)} //task
		/>
	);
};
