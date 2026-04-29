import './App.css';
import styles from './styles.module.css';
import { TodoList } from './TodoList.jsx';
import { TodoListFirebase } from './TodoListFirebase.jsx';
import { TodoListPH } from './TodoListPH.jsx';
import React from 'react';
import { Routes, Route } from 'react-router-dom';

//сервер под 3003 портом для task 1
//npx json-server --watch --port 3003 db.json

function App() {
	return (
		<>
			<div className={styles.H3}>
				<h3>Список задач:</h3>
			</div>

			<div className={styles.block}></div>
			<div>
				<h3>Меню</h3>
				<ul>
					<li>
						<a href="/placeholder">Task 1</a>
					</li>
					<li>
						<a href="/todoList">Task 2</a>
					</li>
					<li>
						<a href="/todoListFirebase">Task 3</a>
					</li>
				</ul>
			</div>
			<Routes>
				<Route path="/placeholder" element={<TodoListPH />} />
				<Route path="/todoList" element={<TodoList />} />
				<Route
					path="/todoListFirebase"
					element={<TodoListFirebase />}
				/>
			</Routes>
		</>
	);
}

export default App;
