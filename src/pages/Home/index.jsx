import { useEffect, useState, useRef } from "react";
import { Trash2  } from "lucide-react";
import api from "../../services/api";

function Home() {
    const [tasks, setTasks] = useState([]);

    const inputName = useRef();

    async function getTasks() {
        const response = await api.get("/tasks");

        setTasks(response.data.tasks);
    }

    async function createTask() {
        await api.post("/tasks", {
            name: inputName.current.value
        });

        inputName.current.value = "";
        getTasks();
    }

    async function deleteTask(id) {
        await api.delete(`/tasks/${id}`);
        getTasks();
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const pad = n => n.toString().padStart(2, '0');
        return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear().toString().slice(-2)} às ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    useEffect(() => {
        getTasks();
    }, [])

    return (
        <main className="antialised min-h-screen bg-zinc-950 text-white flex flex-col items-center gap-10 py-40">
            <section className="bg-zinc-900 p-8 rounded-lg shadow-2xl max-w-md">
                <h1 className="text-3xl font-semibold text-center">Nova tarefa</h1>

                <form>
                    <input type="text" name="name" id="name" className="w-full mt-6 px-4 py-3 bg-zinc-800 text-white rounded-md border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-600 transition placeholder-zinc-400" placeholder="Nome da tarefa" ref={inputName} />

                    <button type="button" onClick={createTask} className="w-full mt-8 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors cursor-pointer">Criar tarefa</button>
                </form>
            </section>

            <section className="space-y-4">

                { tasks.map(task => (
                    <div key={task.id} className="bg-zinc-900 p-8 rounded-lg shadow-2xl w-md flex justify-between items-center gap-4">
                        <div className="font-semibold text-zinc-400 text-left">
                            <p>Nome: <span className="font-normal text-white">{ task.name }</span></p>
                            <p>Status: <span className="font-normal text-white">{ task.status }</span></p>
                            <p>Criado em: <span className="font-normal text-white">{ formatDate(task.createdAt) }</span></p>
                        </div>
                        <div>
                            <button type="button" onClick={() => deleteTask(task.id)} className="w-10 h-10 flex justify-center items-center transition-colors duration-200 hover:bg-zinc-800 rounded-full cursor-pointer hover:text-red-400" title="Deletar">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )) }

            </section>
        </main>
    )
}

export default Home;
