import styles from './styles.module.css';
import { useEffect, useState, useMemo } from 'react';
export const TodoListPH = () => {
	const [refreshTodoListFlag, setRefreshTodoListFlag] = useState(false);
	const [todoList, setTodoList] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setIsLoading(true);
		fetch('https://jsonplaceholder.typicode.com/todos')
			.then((loadedData) => loadedData.json())
			.then((loadedTodoList) => {
				setTodoList(loadedTodoList);
			})
			.catch((error) => {
				console.log('Ошибка загрузки списка задач:', error);
			})
			.finally(() => setIsLoading(false));
	}, [refreshTodoListFlag]);

	return (
		<>
			<div className={styles.app}>
				{isLoading ? (
					<div className={styles.loader}></div>
				) : (
					todoList?.map(({ id, title }) => (
						<div className={styles.containerTodoList} key={id}>
							<div className={styles.Todo}>{title}</div>
						</div>
					))
				)}
			</div>
		</>
	);
};
