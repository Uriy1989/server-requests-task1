import { useState, useEffect } from 'react';

export const useRequestGetTodo = (refreshTodoListFlag) => {
	const [isLoading, setIsLoading] = useState(false);
	const [todoList, setTodoList] = useState([]);

	useEffect(() => {
		setIsLoading(true);
		fetch('http://localhost:3003/todoList')
			.then((loadedData) => loadedData.json())
			.then((loadedTodoList) => {
				setTodoList(loadedTodoList);
			})
			.catch((error) => {
				console.log('Ошибка загрузки списка задач:', error);
			})
			.finally(() => setIsLoading(false));
	}, [refreshTodoListFlag]);

	return { isLoading, todoList };
};
