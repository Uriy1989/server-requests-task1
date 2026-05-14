export const requestGetTask = (id) => {
	return fetch(`http://localhost:3003/todoList/${id}`)
		.then((response) => {
			if (!response.ok) {
				throw new Error(`Данные не найдены: ${response.status}`);
			}
			return response.json();
		})
		.catch((error) => {
			console.error('Ошибка загрузки задачи:', error);
			throw error;
		});
};
