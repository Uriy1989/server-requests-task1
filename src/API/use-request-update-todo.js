import { useState } from 'react';

export const useRequestUpdateTodo = (refreshTodoList, Task) => {
	const [isUpdating, setIsUpdating] = useState(false);

	const requestUpdateTodo = (id, updates = {}) => {
		setIsUpdating(true);

		fetch(`http://localhost:3003/todoList/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			body: JSON.stringify(updates), // Отправляем только обновления
		})
			.then((rawResponse) => {
				if (!rawResponse.ok) {
					throw new Error(
						`HTTP error! status: ${rawResponse.status}`,
					);
				}
				return rawResponse.json();
			})
			.then((response) => {
				console.log('Задача обновлена:', response);
				refreshTodoList();
			})
			.catch((error) => {
				console.error('Ошибка при обновлении задачи:', error);
			})
			.finally(() => setIsUpdating(false));
	};

	return { isUpdating, requestUpdateTodo };
};
